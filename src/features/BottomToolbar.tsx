import React from 'react';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Space, Button, Tooltip } from 'antd';

export default function BottomToolbar() {
	return (
		<div
			style={{
				bottom: 0,
				width: '100%',
				height: '40px',
				padding: '4px',
				backgroundColor: '#333844',
				flexGrow: 0,
			}}
		>
			<Space align="center" size={6} style={{ height: '100%' }}>
				<Tooltip title="Info">
					<Button
						type="link"
						shape="circle"
						icon={<InfoCircleOutlined style={{ fontSize: '18px' }} />}
						size="middle"
					/>
				</Tooltip>
				<Tooltip title="General Settings">
					<Button
						type="link"
						shape="circle"
						icon={<SettingOutlined style={{ fontSize: '18px' }} />}
						size="middle"
					/>
				</Tooltip>
			</Space>
		</div>
	);
}
