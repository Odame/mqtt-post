import React from 'react';
import emptySVG from '../images/empty.svg';
import { Empty, Button } from 'antd';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

export default function Welcome() {
	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Empty
				image={emptySVG}
				imageStyle={{
					height: 80,
				}}
				description={<span>No Connections Have Been Created Yet</span>}
			>
				<Link to={routes.newConnection}>
					<Button type="primary">Create New</Button>
				</Link>
			</Empty>
		</div>
	);
}
