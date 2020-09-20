import React, { useState, useEffect, ComponentType } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import SidePane from './containers/SidePane';
import Welcome from './features/Welcome';
import routes from './constants/routes.json';
import WorkSpace from './features/WorkspaceDir/WorkSpace';
import NewConnection from './features/newConnection/NewConnection';
import GeneralSettings from './features/generalSettings/GeneralSettings';
import About from './features/About';
import { Spin, Button, Result, Layout } from 'antd';
import { initDatabase } from './db';
import { quitApp, restartApp } from './utils';
import { withMqttClients } from './context/mqttClients';
import { withSelectedConnectionId } from './context/currConnId';

const { Content } = Layout;

type HOC = <P>(component: ComponentType<P>) => (props: P) => JSX.Element;
const higherOderComponents: Array<HOC> = [
	withMqttClients,
	withSelectedConnectionId,
];

const compose = (higherOderComponents: Array<HOC>) => (
	Component: ComponentType
) => {
	return higherOderComponents
		.reverse()
		.reduce((current, provider) => provider(current), Component);
};

// We employ React.memo to avoid re-renders when the parent ContextProviders re-render
const MemoizedApp = React.memo(() => {
	return (
		<>
			<SidePane className="sidepane" />
			<Content className="content">
				<Switch>
					<Route path={routes.workspace} component={WorkSpace} />
					<Route path={routes.welcome} component={Welcome} />
					<Route path={routes.newConnection} component={NewConnection} />
					<Route path={routes.generalSettings} component={GeneralSettings} />
					<Route path={routes.about} component={About} />
					<Route path="/">
						<Redirect to={routes.workspace} />
					</Route>
				</Switch>
			</Content>
		</>
	);
});
const ComposedApp = compose(higherOderComponents)(MemoizedApp);

export default function App() {
	const [dbStatus, setDbStatus] = useState<'initialized' | 'error' | 'new'>(
		'new'
	);

	useEffect(() => {
		initDatabase()
			.then(() => {
				setDbStatus('initialized');
			})
			.catch((error) => {
				console.error('Unable to initialize database', error);
				setDbStatus('error');
			});
	}, []);

	return (
		<Layout className="App no-highlight">
			{dbStatus === 'initialized' ? (
				<ComposedApp />
			) : (
				<Content className="extra-info-container">
					{dbStatus === 'error' ? (
						<Result
							status="error"
							title="Database initialization failed"
							subTitle="An error occurred while initializing database."
							extra={[
								<Button type="primary" key="restart" onClick={restartApp}>
									Restart
								</Button>,
								<Button type="default" key="quit" onClick={quitApp}>
									Close
								</Button>,
							]}
						/>
					) : (
						<Spin size="large" tip="Initializing..." />
					)}
				</Content>
			)}
		</Layout>
	);
}
