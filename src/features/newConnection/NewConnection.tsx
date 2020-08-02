import React from 'react';
import ConnectionOptions from '../ConnectionOptions';
import { Tabs } from 'antd';
import './NewConnection.css';

const { TabPane } = Tabs;

export default function NewConnection() {
	return (
		<div className="page-content new-connection">
			<Tabs
				className="tabs-container"
				defaultActiveKey="options"
				renderTabBar={(props, DefaultTabBar) => (
					<DefaultTabBar {...props} className="tabs-header" />
				)}
			>
				<TabPane tab="Connection Options" key="options">
					<ConnectionOptions />
				</TabPane>
				<TabPane tab="Variables" key="variables">
					Variables
				</TabPane>
			</Tabs>
		</div>
	);
}
