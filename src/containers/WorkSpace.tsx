import React from 'react';
import { useTypedSelector } from '../rootReducer';
import { Redirect } from 'react-router';
import routes from '../constants/routes.json';

export default function WorkSpace() {
	const noConnections = useTypedSelector(
		(state) => Object.keys(state.connections.byId).length === 0
	);

	return noConnections ? (
		<Redirect to={routes.welcome} />
	) : (
		<div>Workspace</div>
	);
}
