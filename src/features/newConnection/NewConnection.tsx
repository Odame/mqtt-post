import React from 'react';
import ConnectionOptions from '../../components/ConnectionOptions';
import { Button } from 'antd';
import './NewConnection.css';
import { SaveOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { getDatabase } from '../../db';
import { IConnection } from '../../db/schemas/connection';
import TabbedPage from '../../containers/pageWithTabs/TabbedPage';

export default function NewConnection() {
	const [connectionOptionsForm] = useForm();

	const onClickSave = async () => {
		let connectionOptions: Omit<IConnection, 'id'>;
		try {
			connectionOptions = (await connectionOptionsForm.validateFields()) as IConnection;
		} catch (e) {
			const error = e.errorFields as ReturnType<
				typeof connectionOptionsForm.getFieldsError
			>;
			connectionOptionsForm.scrollToField(error[0].name, {
				skipOverflowHiddenElements: true,
				block: 'start',
			});
			return;
		}
		getDatabase().connections.upsertConnection(connectionOptions);
	};

	return (
		<TabbedPage
			className="new-connection"
			tabs={{
				newConnection: [
					'New Connection',
					<ConnectionOptions form={connectionOptionsForm} />,
				],
			}}
			extraContent={
				<Button
					className="floating-action-button"
					type="primary"
					shape="circle"
					icon={<SaveOutlined />}
					size={'large'}
					onClick={onClickSave}
				/>
			}
		/>
	);
}
