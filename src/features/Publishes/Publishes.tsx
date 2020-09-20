import { Card } from 'antd';
import React from 'react';
import './Publishes.css';

export default function Publishes() {
	return (
		<Card
			className="fill-width fill-height publishes"
			type="inner"
			title="Saved Publishes"
			extra={null}
			style={{ width: '100%', contain: 'layout' }}
			size="small"
		>
			Publishes go here
		</Card>
	);
}
