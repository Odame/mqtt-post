import React from 'react';
import ConnectionsList from '../features/connectionsList/ConnectionsList';
import BottomToolbar from '../features/BottomToolbar';
type Props = {
	className?: string;
};

const sidePaneStyle: React.CSSProperties = {
	height: '100vh',
	position: 'fixed',
	left: 0,
	width: '300px',
	padding: '0px !important',
	borderRight: '0.5px solid #E6E8F1',
	backgroundColor: '#F9FAFD',
	display: 'flex',
	flexDirection: 'column',
};

export default function SidePane({ className }: Props) {
	return (
		<div className={`${className || ''}`} style={sidePaneStyle}>
			<ConnectionsList />
			<BottomToolbar />
		</div>
	);
}
