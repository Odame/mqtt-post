import React from 'react';
import { Typography, Button, Tooltip, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MqttConnection, { MqttClientRef } from './MqttConnection';
import { useTypedSelector } from '../../rootReducer';
import emptySVG from '../../images/empty.svg';
import './ConnectionsList.css';

type Props = {
	mqttClientRef?: MqttClientRef;
};

export default function ConnectionsList() {
	const connections = useTypedSelector((state) => state.connections.byId);
	const isEmpty = useTypedSelector(
		(state) => Object.keys(state.connections.byId).length === 0
	);
	const selectedConnectionId = useTypedSelector(
		(state) => state.connections.selected
	);

	return (
		<>
			<div className="connections-list-header">
				<span style={{ fontSize: '20px', fontWeight: 600, color: 'black' }}>
					Connections
				</span>
				<Tooltip title="New Mqtt Connection">
					<Button type="link" size="large" shape="circle">
						<PlusOutlined style={{ fontSize: '26px' }} />
					</Button>
				</Tooltip>
			</div>
			{isEmpty ? (
				<div className="connections-list empty">
					<Empty
						image={emptySVG}
						imageStyle={{
							height: 60,
						}}
						description={<span>No Connections Yet!</span>}
					></Empty>
				</div>
			) : (
				<div className="connections-list">
					{Object.values(connections).map((conn) => (
						<MqttConnection
							{...conn}
							key={conn.id}
							isSelected={selectedConnectionId === conn.id}
						/>
					))}
				</div>
			)}
		</>
	);
}
