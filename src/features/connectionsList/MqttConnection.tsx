import React, { useEffect, useState, FunctionComponent } from 'react';
import { IConnection } from '../../db/schemas/connection';
import { getDatabase } from '../../db';
import { MqttClientState, useMqttClientState } from '../../context/mqttClients';
import {
	useSelectedConnectionId,
	useCurrConnectionIdSetter,
} from '../../context/currConnId';
import { List } from 'antd';

type Props = {
	connectionId: string;
};

export const getConnectionDesc = (connection: IConnection | null): string => {
	if (!connection) return '...';

	const resolvedPath = ['ws', 'wss'].includes(connection.clientOptions.protocol)
		? connection.clientOptions.path
		: '';
	return `${connection.clientOptions.username || ''}@${
		connection.clientOptions.hostname
	}:${connection.clientOptions.port}${resolvedPath}`;
};

type MappedClientState = 'unknown' | 'connected' | 'notConnected';
const getMappedClientState = (
	clientState: MqttClientState
): MappedClientState => {
	return clientState === MqttClientState.unknown
		? 'unknown'
		: clientState === MqttClientState.connected
		? 'connected'
		: 'notConnected';
};
const MqttConnection: FunctionComponent<Props> = ({ connectionId: id }) => {
	const [connection, setConnection] = useState<IConnection | null>(null);
	useEffect(() => {
		const rxSubscription = getDatabase()
			.connections.getConnection$(id)
			.subscribe(setConnection);
		return () => rxSubscription.unsubscribe();
	}, [id]);

	const currSelectedConnectionId = useSelectedConnectionId();
	const setSelectedConnectionId = useCurrConnectionIdSetter();

	const { clientState } = useMqttClientState(id);
	const [clientMappedState, setClientMappedState] = useState<MappedClientState>(
		getMappedClientState(clientState)
	);
	useEffect(() => {
		setClientMappedState(getMappedClientState(clientState));
	}, [clientState]);

	return (
		<List.Item
			className={`connections-list-item ${
				currSelectedConnectionId === id ? 'selected' : ''
			} no-highlight`}
			onClick={() => setSelectedConnectionId(id)}
		>
			<List.Item.Meta
				className="connections-list-item-meta"
				avatar={
					<div className={`connection-state-indicator ${clientMappedState}`} />
				}
				title={connection?.name || 'loading...'}
				description={getConnectionDesc(connection)}
			/>
		</List.Item>
	);
};

export default MqttConnection;
