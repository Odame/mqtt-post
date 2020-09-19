import React, { useState, useEffect } from 'react';
import { Button, Popover, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MqttConnection from './MqttConnection';
import emptySVG from '../../images/empty.svg';
import routes from '../../constants/routes.json';
import './ConnectionsList.css';
import { Link } from 'react-router-dom';
import { getDatabase } from '../../db';
import { List, Typography } from 'antd';
import { useIsSidePaneCollapsed } from '../../context/sidePane';
const { Title } = Typography;

export default function ConnectionsList() {
	const [connectionsIds, setConnectionsIds] = useState<Array<string>>([]);
	useEffect(() => {
		const rxSubscription = getDatabase()
			.connections.getConnectionsIds$()
			.subscribe(setConnectionsIds);
		return () => rxSubscription.unsubscribe();
	}, []);

	const isSidePaneCollapsed = useIsSidePaneCollapsed();

	return (
		<>
			<div className="connections-list-header">
				<Popover content="Create New Connection" mouseLeaveDelay={0}>
					<Link to={routes.newConnection}>
						<Button type="link" size="large" shape="circle">
							<PlusOutlined style={{ fontSize: '28px', fontWeight: 700 }} />
						</Button>
					</Link>
				</Popover>
				{isSidePaneCollapsed ? null : (
					<Title level={3} className="no-highlight title">
						Connections
					</Title>
				)}
			</div>
			{connectionsIds.length === 0 ? (
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
			) : (
				<List
					className="connections-list"
					itemLayout="horizontal"
					dataSource={connectionsIds}
					rowKey={(connectionId) => connectionId}
					renderItem={(connectionId) => (
						<MqttConnection connectionId={connectionId} />
					)}
				/>
			)}
		</>
	);
}
