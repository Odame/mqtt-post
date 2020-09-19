import React from 'react';
import emptySVG from '../images/empty.svg';
import { Empty, Button } from 'antd';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

export default function Welcome() {
	return (
		<div className="fill-height fill-width center-children">
			<Empty
				image={emptySVG}
				imageStyle={{
					height: 80,
				}}
				description={
					<span>
						No connection has been selected.
						<br />
						Select one from the left-pane
						<br />
						<br />
						OR
					</span>
				}
			>
				<Link to={routes.newConnection}>
					<Button type="primary">Create New</Button>
				</Link>
			</Empty>
		</div>
	);
}
