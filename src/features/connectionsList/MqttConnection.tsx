import React, { useEffect, useState, FunctionComponent } from 'react';
import { IConnection } from '../../db/schemas/connection';
import { getDatabase } from '../../db';
import { useMqttClientState } from '../../context/mqttClients';
import {
	useSelectedConnectionId,
	useCurrConnectionIdSetter,
} from '../../context/currConnId';
import { List } from 'antd';

type Props = {
	connectionId: string;
};

const getConnectionDesc = (connection: IConnection | null): string => {
	if (!connection) return '...';

	return `${connection.clientOptions.username || ''}@${
		connection.clientOptions.hostname
	}:${connection.clientOptions.port}`;
};

const MqttConnection: FunctionComponent<Props> = ({ connectionId: id }) => {
	const [connection, setConnection] = useState<IConnection | null>(null);
	useEffect(() => {
		return getDatabase().Connections.getConnection$(id).subscribe(setConnection)
			.unsubscribe;
	}, [id]);

	const currSelectedConnectionId = useSelectedConnectionId();
	const setSelectedConnectionId = useCurrConnectionIdSetter();
	const { clientState, clientError } = useMqttClientState(id);

	return (
		<List.Item
			className={`connections-list-item ${
				currSelectedConnectionId === id ? 'selected' : ''
			} no-highlight`}
			onClick={() => setSelectedConnectionId(id)}
		>
			<List.Item.Meta
				avatar={
					<div
						className={`connection-state-indicator ${clientState} ${
							clientError ? 'error' : ''
						}`}
					/>
				}
				title={connection?.name || 'loading...'}
				description={getConnectionDesc(connection)}
			/>
		</List.Item>
	);
};

export default MqttConnection;
