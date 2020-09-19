import React from 'react';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Space, Button, Popover } from 'antd';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

export default function BottomToolbar() {
	return (
		<div
			style={{
				bottom: 0,
				width: '100%',
				height: 'var(--statusbar-height)',
				padding: '4px',
				backgroundColor: '#333844',
				flexGrow: 0,
			}}
		>
			<Space align="center" size={4} style={{ height: '100%' }}>
				<Popover content="About" mouseEnterDelay={0.8} className="no-highlight">
					<Link to={routes.about}>
						<Button
							type="link"
							shape="circle"
							icon={<InfoCircleOutlined style={{ fontSize: '18px' }} />}
							size="middle"
						/>
					</Link>
				</Popover>
				<Popover
					content="General Settings"
					mouseEnterDelay={0.8}
					className="no-highlight"
				>
					<Link to={routes.generalSettings}>
						<Button
							type="link"
							shape="circle"
							icon={<SettingOutlined style={{ fontSize: '18px' }} />}
							size="middle"
						/>
					</Link>
				</Popover>
			</Space>
		</div>
	);
}
