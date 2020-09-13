import { Tabs, Button } from 'antd';
import './TabbedPage.css';
import { CloseOutlined } from '@ant-design/icons';
import React, { ReactNode, useState } from 'react';
import { useHistory } from 'react-router';

const { TabPane } = Tabs;

type TabbedPageProps<T extends string> = {
	tabs: Record<T, Array<string | ReactNode>>;
	extraContent?: ReactNode;
	className?: string;
};

export default function TabbedPage<T extends string>(
	props: TabbedPageProps<T>
) {
	const [activeTab, setActiveTab] = useState<T>();

	const history = useHistory();
	const onClickClose = () => {
		history.goBack();
	};

	return (
		<div className={`${props.className || ''} page-content tabbed-page`}>
			{/* We use this to push the content visually down.
			This is preferred over padding-top, in order to make `scroll-to-element` work */}
			<div className="tabbed-page-content-pusher" />
			<Tabs
				className="tabs-container"
				activeKey={activeTab}
				renderTabBar={(props, DefaultTabBar) => (
					<div className="tabs-header-container">
						<DefaultTabBar {...props} className="tabs-header" />
					</div>
				)}
				tabBarExtraContent={
					<Button
						type="text"
						shape="circle"
						onClick={onClickClose}
						className="btn-close"
					>
						<CloseOutlined
							// twoToneColor="#FF3C2F"
							style={{ fontSize: '18px', color: '#FF3C2F' }}
						/>
					</Button>
				}
				onChange={(activeKey) => setActiveTab(activeKey as T | undefined)}
			>
				{Object.entries(props.tabs).map((entry) => {
					const [tabKey, nameElementPair] = entry;
					const [tabName, element] = nameElementPair as Array<
						string | ReactNode
					>;
					return (
						<TabPane
							tab={tabName as string}
							key={tabKey}
							className="tab-content"
						>
							{element}
						</TabPane>
					);
				})}
			</Tabs>
			{props.extraContent || null}
		</div>
	);
}
