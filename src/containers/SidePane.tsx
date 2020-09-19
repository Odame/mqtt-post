import React, { CSSProperties, useCallback, useState } from 'react';
import ConnectionsList from '../features/connectionsList/ConnectionsList';
import BottomToolbar from '../features/BottomToolbar';
import { Button, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { SidePaneCollapsedStateContextProvider } from '../context/sidePane';
const { Sider } = Layout;

type SidePaneProps = {
	className?: string;
};

const toggleCollapseButtonStyles: CSSProperties = {
	fontSize: '22px',
	color: '#000000',
};
export default function SidePane({ className }: SidePaneProps) {
	const [collapsed, setCollapsed] = useState(false);
	const toggleCollapsedState = useCallback(() => {
		setCollapsed((collapsed) => !collapsed);
	}, []);

	return (
		<Sider
			className={`${className || ''} ${collapsed ? 'collapsed' : 'expanded'}`}
			collapsible
			collapsed={collapsed}
			trigger={null}
		>
			<SidePaneCollapsedStateContextProvider value={collapsed}>
				<div className="collapsed-toggle-button-container">
					<Button
						type="text"
						onClick={toggleCollapsedState}
						size="large"
						className="btn-toggle-collapsed-state"
					>
						{collapsed ? (
							<MenuUnfoldOutlined style={toggleCollapseButtonStyles} />
						) : (
							<MenuFoldOutlined style={toggleCollapseButtonStyles} />
						)}
					</Button>
				</div>
				<ConnectionsList />
				<BottomToolbar />
			</SidePaneCollapsedStateContextProvider>
		</Sider>
	);
}
