import React, { useState } from 'react';
import ConnectionOptions, {
	IConnectionOptions,
} from '../../components/ConnectionOptions';
import { Tabs, Button, Form } from 'antd';
import './NewConnection.css';
import { DownloadOutlined } from '@ant-design/icons';
import { useForm, FormInstance } from 'antd/lib/form/Form';
import { IClientOptions } from 'mqtt';
import EnvironmentVariables from '../../components/Variables/EnvironmentVariables';

const { TabPane } = Tabs;

const formValuesToClientOptions = (formValues: IConnectionOptions) => {
	return {
		...(formValues as IClientOptions),
		protocolId: formValues.protocolVersion === 3 ? 'MQIsdp' : 'MQTT',
		path: ['ws', 'wss'].includes(formValues.protocol) ? formValues.path : '',
	} as IClientOptions;
};

export default function NewConnection() {
	const [connectionOptionsForm] = useForm();
	const [environmentVariablesForm] = useForm();

	const onClickConnect = async () => {
		if (connectionOptionsForm === undefined) return;
		try {
			const values = await connectionOptionsForm.validateFields();
		} catch (e) {
			const error = e.errorFields as ReturnType<
				typeof connectionOptionsForm.getFieldsError
			>;
			connectionOptionsForm.scrollToField(error[0].name, {
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
				defaultActiveKey="environmentVariables"
				renderTabBar={(props, DefaultTabBar) => (
					<DefaultTabBar {...props} className="tabs-header" />
				)}
			>
				<TabPane
					tab="Connection Options"
					key="connectionOptions"
					className="tab-content"
				>
					<ConnectionOptions form={connectionOptionsForm} />
				</TabPane>
				<TabPane
					tab="Variables"
					key="environmentVariables"
					className="tab-content"
				>
					<EnvironmentVariables
						form={environmentVariablesForm}
						constKeyValuePairs={[
							{ varName: 'one', varValue: '1' },
							{ varName: 'two', varValue: '2' },
							{ varName: 'three', varValue: '3' },
							{ varName: 'four', varValue: '4' },
						]}
					/>
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
