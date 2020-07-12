import React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import SidePane from './containers/SidePane';
import Welcome from './features/Welcome';
import routes from './constants/routes.json';
import WorkSpace from './containers/WorkSpace';
import NewConnection from './features/newConnection/NewConnection';
import GeneralSettings from './features/generalSettings/GeneralSettings';
import About from './features/About';

export default function App() {
	return (
		<div className="App">
			<SidePane className="sidepane" />
			<div className="pages">
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
			</div>
		</div>
	);
}
