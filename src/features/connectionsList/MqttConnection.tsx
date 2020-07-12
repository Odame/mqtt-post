import React, { useEffect, useState, useCallback } from 'react';
import mqtt, { IClientOptions, Client } from 'mqtt';

export enum MqttConnectionState {
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

export type MqttClientRef = (id: string, client: Client | undefined) => void;

const useMqttConnection = (mqttOptions: IClientOptions) => {
	const [client, setClient] = useState<mqtt.Client>();
	const [connState, setConnState] = useState<MqttConnectionState>(
		MqttConnectionState.offline
	);
	const [connError, setConnError] = useState<Error>();

	const disconnect = useCallback(() => {
		setClient((curr) => (curr ? curr.end() : curr));
	}, []);

	const connect = useCallback(($mqttOptions?: IClientOptions) => {
		setClient((curr) => {
			if ($mqttOptions) {
				// make a new connection with these mqttOptions
				return mqtt
					.connect($mqttOptions)
					.on('connect', () => setConnState(MqttConnectionState.connected))
					.on('disconnect', () =>
						setConnState(MqttConnectionState.disconnected)
					)
					.on('offline', () => setConnState(MqttConnectionState.offline))
					.on('reconnect', () => setConnState(MqttConnectionState.reconnecting))
					.on('end', () => setConnState(MqttConnectionState.ended))
					.on('error', setConnError);
			}
			if (curr) {
				// reconnect with the same mqttOptions as before
				return curr.reconnect();
			}
			return curr;
		});
	}, []);

	// Connect using updated mqttOptions when mqttOptions changes
	useEffect(() => {
		connect(mqttOptions);
		return disconnect;
	}, [connect, disconnect, mqttOptions]);

	return { client, connState, connError, connect, disconnect };
};

type Props = {
	id: string;
	isSelected?: boolean;
	name: string;
	options: IClientOptions;
	mqttClientRef?: MqttClientRef;
	onConnectionStateChange?: (
		id: string,
		connState: MqttConnectionState
	) => void;
	onConnectionError?: (id: string, error: Error) => void;
	className?: string;
};

const MqttConnection = ({
	id,
	isSelected,
	name,
	options: mqttOptions,
	mqttClientRef,
	onConnectionStateChange,
	onConnectionError,
	className,
}: Props) => {
	const { client, connState, connError } = useMqttConnection(mqttOptions);

	useEffect(() => mqttClientRef && mqttClientRef(id, client), [
		id,
		client,
		mqttClientRef,
	]);

	useEffect(
		() => onConnectionStateChange && onConnectionStateChange(id, connState),
		[connState, id, onConnectionStateChange]
	);

	useEffect(
		() => connError && onConnectionError && onConnectionError(id, connError),
		[connError, id, onConnectionError]
	);

	return (
		<div className={`${isSelected ? 'selected' : ''} ${className || ''}`}>
			<div className="toolbar">
				{/* power icon */}
				{/* edit icon */}
			</div>
			<div>{name}</div>
		</div>
	);
};

export default MqttConnection;
