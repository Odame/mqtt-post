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
