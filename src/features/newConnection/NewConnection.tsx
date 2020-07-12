import React from 'react';
import ConnectionOptions from '../ConnectionOptions';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

export default function NewConnection() {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				overflowY: 'auto',
				paddingLeft: '18px',
				paddingRight: '18px',
				paddingBottom: '18px',
			}}
		>
			<Tabs
				defaultActiveKey="options"
				renderTabBar={(props, DefaultTabBar) => (
					<DefaultTabBar
						{...props}
						style={{
							top: '0',
							position: 'sticky',
							zIndex: 1,
							marginBottom: '18px',
						}}
					/>
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
