import {
	FunctionComponent,
	useState,
	useEffect,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import React from 'react';
import { MqttClient, IClientOptions } from 'mqtt';
import * as _mqtt from 'mqtt';
import { getDatabase } from '../db';
import { map } from 'rxjs/operators';
import { IConnection } from '../db/schemas/connection';
import { buildContextProviderHOC } from './utils';

// Use the mqtt lib preloaded from the main process (which is a nodejs process)
const mqtt = (window as any).mqtt as typeof _mqtt;

const MqttClientsContext = React.createContext<
	Record<string, MqttClient | null>
>({});
MqttClientsContext.displayName = 'MqttClientsContext';

type IAny =
	| null
	| string
	| boolean
	| number
	| IAny[]
	| { [key: string]: IAny | undefined };
const removeUndefinedFields = (data: IAny): IAny => {
	if (typeof data === 'object') {
		if (Array.isArray(data)) {
			return data.map((item) => removeUndefinedFields(item));
		} else if (data === null) {
			return data;
		} else {
			return Object.fromEntries(
				Object.entries(data)
					// discard entries where the value is undefined
					.filter(([key, value]) => value !== undefined)
					.map(([key, value]) => [key, removeUndefinedFields(value as IAny)])
			);
		}
	} else return data;
};

/** Convert the data grabbed from the database into
 * a form that can be used for connecting to an mqtt broker */
const fromIConnectionToIClientOptions = (
	connection: IConnection
): IClientOptions => {
	const clientOptions = {
		...connection.clientOptions,
		reconnectPeriod: connection.clientOptions.reconnectPeriod * 1000,
		connectTimeout: connection.clientOptions.connectTimeout * 1000,
		protocolId:
			connection.clientOptions.protocolVersion === 3 ? 'MQIsdp' : 'MQTT',
		path: ['ws', 'wss'].includes(connection.clientOptions.protocol)
			? connection.clientOptions.path
			: undefined,
		will: undefined,
		sslTls: undefined,
	};
	if (!['ws', 'wss'].includes(connection.clientOptions.protocol))
		delete clientOptions.path;
	delete clientOptions.will;
	delete clientOptions.sslTls;

	const sanitizedClientOptions = removeUndefinedFields(clientOptions);
	return sanitizedClientOptions as IClientOptions;
};
const MqttClientsContextProvider: FunctionComponent = (props) => {
	const [mqttClients, setMqttClients] = useState<
		Record<string, MqttClient | null>
	>({});

	// Grab the data from the db initially and setup the mqttClients
	useEffect(() => {
		const database = getDatabase();
		database.connections
			.find()
			.exec()
			.then((connections) => {
				const mqttConnections = Object.fromEntries(
					connections.map((conn) => [
						conn.id,
						conn.paused
							? null
							: mqtt.connect(fromIConnectionToIClientOptions(conn)),
					])
				);
				setMqttClients(mqttConnections);
			});
	}, []);

	const onConnectionModified = useCallback(
		(connection: IConnection) => {
			const prevClient = mqttClients[connection.id];
			if (prevClient) prevClient.end(true);

			const newClient = connection.paused
				? null
				: mqtt.connect(fromIConnectionToIClientOptions(connection));
			(window as any).clients = (window as any).clients || {};
			(window as any).clients[connection.id] = newClient;
			setMqttClients((clients) => {
				return {
					...clients,
					[connection.id]: newClient,
				};
			});
		},
		[mqttClients]
	);

	// Listen for newly inserted connections and modify mqttClients
	useEffect(() => {
		const rxSubscription = getDatabase()
			.connections.insert$.pipe(map((e) => e.documentData as IConnection))
			.subscribe(onConnectionModified);
		return () => rxSubscription.unsubscribe();
	}, [onConnectionModified]);

	// listen for updated connections and modify mqttClients
	useEffect(() => {
		const rxSubscription = getDatabase()
			.connections.update$.pipe(map((e) => e.documentData as IConnection))
			.subscribe(onConnectionModified);
		return () => rxSubscription.unsubscribe();
	}, [onConnectionModified]);

	// listen for deleted connections and modify mqttClients
	useEffect(() => {
		const rxSubscription = getDatabase()
			.connections.remove$.pipe(map((e) => e.documentData as IConnection))
			.subscribe((connection) => {
				const prevClient = mqttClients[connection.id];
				if (prevClient) prevClient.end(true);

				setMqttClients((clients) => {
					delete clients[connection.id];
					return clients;
				});
			});
		return () => rxSubscription.unsubscribe();
	}, [mqttClients]);

	return (
		<MqttClientsContext.Provider value={mqttClients}>
			{props.children}
		</MqttClientsContext.Provider>
	);
};
export const withMqttClients = buildContextProviderHOC(
	MqttClientsContextProvider
);

export const useMqttClient = (connectionId: string) => {
	const clients = useContext(MqttClientsContext);

	const _client = clients[connectionId] || null;
	const memoizedClient = useMemo(() => _client, [_client]);

	return memoizedClient;
};

export enum MqttClientState {
	/** The exact state of the mqtt client cannot be determined currently */
	unknown = 'unknown',
	/** On successful (re)connection, (i.e. connack rc=0) */
	connected = 'connected',
	/** After receiving disconnect packet from broker. MQTT 5.0 feature */
	disconnected = 'disconnected',
	/** When a reconnect starts */
	reconnecting = 'reconnecting',
	/** When mqtt.Client goes offline */
	offline = 'offline',
	closed = 'closed',
	/** When mqtt.Client.end is called */
	ended = 'ended',
}

const getClientInitialState = (client: MqttClient | null | undefined) => {
	return client?.connected
		? MqttClientState.connected
		: client?.reconnecting
		? MqttClientState.reconnecting
		: client?.disconnected || client?.disconnecting
		? MqttClientState.disconnected
		: MqttClientState.unknown;
};
/** Hook to track the state of a connection's related mqtt client */
export const useMqttClientState = (connectionId: string | null) => {
	const client = useMqttClient(connectionId || '');

	const [clientState, setClientState] = useState<MqttClientState>(
		getClientInitialState(client)
	);
	const [clientError, setClientError] = useState<Error | null>(null);

	useEffect(() => {
		if (!client) return;

		const onConnect = () => {
			setClientState(MqttClientState.connected);
			// The client has successfully connected, so clear the error
			setClientError(null);
		};
		const onDisconnect = () => setClientState(MqttClientState.disconnected);
		const onOffline = () => setClientState(MqttClientState.offline);
		const onClose = () => setClientState(MqttClientState.closed);
		const onReconnect = () => setClientState(MqttClientState.reconnecting);
		const onEnd = () => {
			setClientState(MqttClientState.ended);
			// The client has been ended, the error state makes sense no more
			setClientError(null);
		};

		client
			.addListener('connect', onConnect)
			.addListener('disconnect', onDisconnect)
			.addListener('offline', onOffline)
			.addListener('reconnect', onReconnect)
			.addListener('close', onClose)
			.addListener('end', onEnd)
			.addListener('error', setClientError);
		console.log('client.listeners.registered');

		return () => {
			client
				.removeListener('connect', onConnect)
				.removeListener('disconnect', onDisconnect)
				.removeListener('offline', onOffline)
				.removeListener('reconnect', onReconnect)
				.removeListener('close', onClose)
				.removeListener('end', onEnd)
				.removeListener('error', setClientError);
			console.log('client.listeners.unregistered');
		};
	}, [client]);

	useEffect(() => {
		console.log(
			`connection.client.${clientState} -> ${connectionId}`,
			client?.options,
			clientError
		);
	}, [client, clientError, clientState, connectionId]);

	// In case we missed the event fired from the client, attempt to set the state
	const setInitialState = useCallback(() => {
		const initialState = getClientInitialState(client);
		setClientState(initialState);
	}, [client]);
	useEffect(setInitialState, []);

	return { clientState, clientError };
};
