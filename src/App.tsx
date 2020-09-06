import React, { useState, useEffect } from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import SidePane from './containers/SidePane';
import Welcome from './features/Welcome';
import routes from './constants/routes.json';
import WorkSpace from './containers/WorkSpace';
import NewConnection from './features/newConnection/NewConnection';
import GeneralSettings from './features/generalSettings/GeneralSettings';
import About from './features/About';
import { Spin, Button, Result } from 'antd';
import { initDatabase } from './db';
import { quitApp, restartApp } from './utils';

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
		<div className="App no-highlight">
			{dbStatus === 'initialized' ? (
				<>
					<SidePane className="sidepane" />
					<div className="pages">
						<Switch>
							<Route path={routes.workspace} component={WorkSpace} />
							<Route path={routes.welcome} component={Welcome} />
							<Route path={routes.newConnection} component={NewConnection} />
							<Route
								path={routes.generalSettings}
								component={GeneralSettings}
							/>
							<Route path={routes.about} component={About} />
							<Route path="/">
								<Redirect to={routes.workspace} />
							</Route>
						</Switch>
					</div>
				</>
			) : (
				<div className="extra-info-container">
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
				</div>
			)}
		</div>
	);
}
