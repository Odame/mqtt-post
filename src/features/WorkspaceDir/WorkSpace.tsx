import React from 'react';
import { Redirect } from 'react-router';
import routes from '../../constants/routes.json';
import { useSelectedConnectionId } from '../../context/currConnId';
import StatusBar from './StatusBar';
import ToolBar from './ToolBar';
import SplitPane from 'react-split-pane';
import './Workspace.css';
import Subscriptions from '../Subscriptions/Subscriptions';
import Publishes from '../Publishes/Publishes';

export default function WorkSpace() {
	const selectedConnectionId = useSelectedConnectionId();

	return selectedConnectionId === null ? (
		<Redirect to={routes.welcome} />
	) : (
		<div className="workspace main-page">
			<ToolBar />
			<div className="fill-width multi-panes">
				{/* 
					See https://github.com/tomkp/react-split-pane 
					for more info about what these props mean 
				*/}
				<SplitPane
					split="vertical"
					minSize={100}
					maxSize={300}
					defaultSize={300}
				>
					<SplitPane split="horizontal" minSize={200} maxSize={-200}>
						<div className="workspace-pane subscriptions-pane fill-height fill-width">
							<Subscriptions />
						</div>
						<div className="workspace-pane publishes-pane fill-width fill-height">
							<Publishes />
						</div>
					</SplitPane>
					<SplitPane
						split="horizontal"
						primary="second"
						minSize={200}
						defaultSize={200}
						maxSize={-200}
					>
						<div className="pane messages-pane">Messages Pane</div>
						<div className="pane new-message-pane">New Message Pane</div>
					</SplitPane>
				</SplitPane>
			</div>
			<StatusBar />
		</div>
	);
}
