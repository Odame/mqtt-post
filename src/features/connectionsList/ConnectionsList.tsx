import React from 'react';
import { Button, Popover, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MqttConnection, { MqttClientRef } from './MqttConnection';
import { useTypedSelector } from '../../rootReducer';
import emptySVG from '../../images/empty.svg';
import routes from '../../constants/routes.json';
import './ConnectionsList.css';
import { Link } from 'react-router-dom';

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
				<span
					style={{ fontSize: '20px', fontWeight: 600, color: 'black' }}
					className="no-highlight"
				>
					Connections
				</span>
				<Popover content="Create New Connection" mouseLeaveDelay={0}>
					<Link to={routes.newConnection}>
						<Button type="link" size="large" shape="circle">
							<PlusOutlined style={{ fontSize: '26px' }} />
						</Button>
					</Link>
				</Popover>
			</div>
			{isEmpty ? (
				<div className="connections-list empty">
					<Empty
						className="no-highlight"
						image={emptySVG}
						imageStyle={{
							height: 60,
						}}
						description={
							<span className="no-highlight">No Connections Yet!</span>
						}
					></Empty>
				</div>
			) : // <div className="connections-list">
			// 	{Object.values(connections).map((conn) => (
			// 		<MqttConnection
			// 			{...conn}
			// 			key={conn.id}
			// 			isSelected={selectedConnectionId === conn.id}
			// 		/>
			// 	))}
			// </div>

			null}
		</>
	);
}
