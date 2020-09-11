import React from 'react';
import { Redirect } from 'react-router';
import routes from '../constants/routes.json';
import { useSelectedConnectionId } from '../context/currConnId';

export default function WorkSpace() {
	const selectedConnectionId = useSelectedConnectionId();

	return selectedConnectionId === null ? (
		<Redirect to={routes.welcome} />
	) : (
		<div>Workspace</div>
	);
}
