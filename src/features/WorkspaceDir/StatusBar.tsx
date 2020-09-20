import { Typography } from 'antd';
import React from 'react';
import { useSelectedConnectionId } from '../../context/currConnId';
import { MqttClientState, useMqttClientState } from '../../context/mqttClients';
import { useConnectionInfo } from '../../db/hooks';
import { getConnectionDesc } from '../connectionsList/MqttConnection';
const { Text } = Typography;

const getConnectionStateMessage = (
	clientState: MqttClientState,
	clientError: Error | null
) => {
	return `${clientState}${clientError ? ' - "' + clientError.message + '"' : ''}`;
};

const getConnectionStateColor = (
	clientState: MqttClientState,
	clientError: Error | null
): 'success' | undefined | 'danger' => {
	if (clientError !== null) return 'danger';
	else if (clientState === MqttClientState.connected) return 'success';
	else return undefined;
};

export default function StatusBar() {
	const selectedConnectionId = useSelectedConnectionId();
	const connection = useConnectionInfo(selectedConnectionId);
	const { clientState, clientError } = useMqttClientState(selectedConnectionId);

	return (
		<div className="fill-width status-bar">
			<Text>{connection?.name || 'Loading...'}</Text>
			<div className="separator" />
			<Text>{getConnectionDesc(connection)}</Text>
			<div className="separator" />
			<Text type={getConnectionStateColor(clientState, clientError)}>
				{getConnectionStateMessage(clientState, clientError)}
			</Text>
		</div>
	);
}
