import React, { useState, useEffect } from 'react';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MqttConnection from './MqttConnection';
import emptySVG from '../../images/empty.svg';
import routes from '../../constants/routes.json';
import './ConnectionsList.css';
import { Link } from 'react-router-dom';
import { getDatabase } from '../../db';
import { List } from 'antd';
import { useIsSidePaneCollapsed } from '../../context/sidePane';

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
				<Link to={routes.newConnection} className="fill-width">
					<Button
						type="dashed"
						block
						icon={
							<PlusOutlined style={{ fontSize: '22px', color: '#1990FF' }} />
						}
					/>
				</Link>
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
							<span className="no-highlight">
								{isSidePaneCollapsed ? '' : 'No Connections Yet!'}
							</span>
						}
					></Empty>
				</div>
			) : (
				<List
					className={`connections-list ${isSidePaneCollapsed ? 'hidden' : ''}`}
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
