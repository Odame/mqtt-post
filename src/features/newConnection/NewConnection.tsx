import React, { useState } from 'react';
import ConnectionOptions from '../../components/ConnectionOptions';
import { Tabs, Button, Form } from 'antd';
import './NewConnection.css';
import { DownloadOutlined } from '@ant-design/icons';
import { useForm, FormInstance } from 'antd/lib/form/Form';

const { TabPane } = Tabs;

export default function NewConnection() {
	const [form, setForm] = useState<FormInstance>();

	const onClickConnect = async () => {
		if (form === undefined) return;
		try {
			const values = await form.validateFields();
		} catch (e) {
			const error = e.errorFields as ReturnType<typeof form.getFieldsError>;
			form.scrollToField(error[0].name, {
				skipOverflowHiddenElements: true,
				block: 'start',
			});
			console.error('Validation errors', error);
		}
	};

	return (
		<div className="page-content new-connection">
			<Tabs
				className="tabs-container"
				defaultActiveKey="options"
				renderTabBar={(props, DefaultTabBar) => (
					<DefaultTabBar {...props} className="tabs-header" />
				)}
			>
				<TabPane tab="Connection Options" key="options" className="tab-content">
					<ConnectionOptions formRef={setForm} />
				</TabPane>
				<TabPane tab="Variables" key="variables">
					Variables
				</TabPane>
			</Tabs>
			<Button
				className="action-button"
				type="primary"
				shape="circle"
				icon={<DownloadOutlined />}
				size={'large'}
				onClick={onClickConnect}
			/>
		</div>
	);
}
