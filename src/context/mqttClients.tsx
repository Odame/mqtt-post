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

// Use the mqtt lib preloaded from the main process (which is a nodejs process)
const mqtt = (window as any).mqtt as typeof _mqtt;

const MqttClientsContext = React.createContext<
	Record<string, MqttClient | null>
>({});
MqttClientsContext.displayName = 'MqttClientsContext';

export const MqttClientsContextProvider: FunctionComponent = (props) => {
	const [mqttClients, setMqttClients] = useState<
		Record<string, MqttClient | null>
	>({});

	// Grab the data from the db initially and setup the mqttClients
	useEffect(() => {
		const database = getDatabase();
		database.Connections.find()
			.exec()
			.then((connections) => {
				const mqttConnections = Object.fromEntries(
					connections.map((conn) => [
						conn.id,
						conn.paused
							? null
							: mqtt.connect(conn.clientOptions as IClientOptions),
					])
				);
				setMqttClients(mqttConnections);
			});
	}, []);

	const onConnectionModified = useCallback(
		(connection: IConnection) => {
			const prevClient = mqttClients[connection.id];
			if (prevClient) prevClient.end(true);

			setMqttClients((clients) => {
				return {
					...clients,
					[connection.id]: connection.paused
						? null
						: mqtt.connect(connection.clientOptions),
				};
			});
		},
		[mqttClients]
	);

	// Listen for newly inserted connections and modify mqttClients
	useEffect(() => {
		const rxSubscription = getDatabase()
			.Connections.insert$.pipe(map((e) => e.documentData as IConnection))
			.subscribe(onConnectionModified);
		return rxSubscription.unsubscribe;
	}, [onConnectionModified]);

	// listen for updated connections and modify mqttClients
	useEffect(() => {
		const rxSubscription = getDatabase()
			.Connections.update$.pipe(map((e) => e.documentData as IConnection))
			.subscribe(onConnectionModified);
		return rxSubscription.unsubscribe;
	}, [onConnectionModified]);

	// listen for deleted connections and modify mqttClients
	useEffect(() => {
		const rxSubscription = getDatabase()
			.Connections.remove$.pipe(map((e) => e.documentData as IConnection))
			.subscribe((connection) => {
				const prevClient = mqttClients[connection.id];
				if (prevClient) prevClient.end(true);

				setMqttClients((clients) => {
					delete clients[connection.id];
					return clients;
				});
			});
		return rxSubscription.unsubscribe;
	}, [mqttClients]);

	return (
		<MqttClientsContext.Provider value={mqttClients}>
			{props.children}
		</MqttClientsContext.Provider>
	);
};

export const useMqttClient = (connectionId: string) => {
	const clients = useContext(MqttClientsContext);

	const _client = clients[connectionId] || null;
	const memoizedClient = useMemo(() => _client, [_client]);

	return memoizedClient;
};

export enum MqttClientState {
	/** The exact state of the mqtt client cannot be determined currently */
	unknown,
	/** On successful (re)connection, (i.e. connack rc=0) */
	connected,
	/** After receiving disconnect packet from broker. MQTT 5.0 feature */
	disconnected,
	/** When a reconnect starts */
	reconnecting,
	/** When mqtt.Client goes offline */
	offline,
	/** When mqtt.Client.end is called */
	ended,
}

/** Hook to track the state of a connection's related mqtt client */
export const useMqttClientState = (connectionId: string) => {
	const [clientState, setClientState] = useState<MqttClientState>(
		MqttClientState.unknown
	);
	const [clientError, setClientError] = useState<Error | null>(null);

	const client = useMqttClient(connectionId);
	useEffect(() => {
		if (!client) return;

		const onConnect = () => {
			setClientState(MqttClientState.connected);
			// The client has successfully connected, so clear the error
			setClientError(null);
		};
		const onDisconnect = () => setClientState(MqttClientState.disconnected);
		const onOffline = () => setClientState(MqttClientState.offline);
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
			.addListener('end', onEnd)
			.addListener('error', setClientError);

		return () => {
			client
				.removeListener('connect', onConnect)
				.removeListener('disconnect', onDisconnect)
				.removeListener('offline', onOffline)
				.removeListener('end', onEnd)
				.removeListener('error', setClientError);
		};
	}, [client]);

	return { clientState, clientError };
};
