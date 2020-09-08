import React, { useState } from 'react';
import ConnectionOptions, {
	IConnectionOptions,
} from '../../components/ConnectionOptions';
import { Tabs, Button, Form } from 'antd';
import './NewConnection.css';
import { DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useForm, FormInstance } from 'antd/lib/form/Form';
import { IClientOptions } from 'mqtt';
import EnvironmentVariables, {
	IVar,
} from '../../components/Variables/EnvironmentVariables';

const { TabPane } = Tabs;

const formValuesToClientOptions = (formValues: IConnectionOptions) => {
	return {
		...(formValues as IClientOptions),
		protocolId: formValues.protocolVersion === 3 ? 'MQIsdp' : 'MQTT',
		path: ['ws', 'wss'].includes(formValues.protocol) ? formValues.path : '',
	} as IClientOptions;
};

enum TabKey {
	ConnectionOptions = 'connectionOptions',
	Variables = 'variable',
}
export default function NewConnection() {
	const [activeTab, setActiveTab] = useState<TabKey>(TabKey.ConnectionOptions);
	const [connectionOptionsForm] = useForm();
	const [environmentVariablesForm] = useForm();

	const onClickConnect = async () => {
		let connectionOptions: IConnectionOptions;
		let variables: Array<IVar>;
		try {
			connectionOptions = (await connectionOptionsForm.validateFields()) as IConnectionOptions;
		} catch (e) {
			const error = e.errorFields as ReturnType<
				typeof connectionOptionsForm.getFieldsError
			>;
			connectionOptionsForm.scrollToField(error[0].name, {
				skipOverflowHiddenElements: true,
				block: 'start',
			});
			setActiveTab(TabKey.ConnectionOptions);
			return;
		}

		try {
			const values = await environmentVariablesForm.validateFields();
			variables = values['nameValuePairs'] as Array<IVar>;
		} catch (e) {
			const error = e.errorFields as ReturnType<
				typeof environmentVariablesForm.getFieldsError
			>;
			environmentVariablesForm.scrollToField(error[0].name, {
				skipOverflowHiddenElements: true,
				block: 'start',
			});
			setActiveTab(TabKey.Variables);
			return;
		}
	};

	return (
		<div className="page-content new-connection">
			<Tabs
				className="tabs-container"
				activeKey={activeTab}
				renderTabBar={(props, DefaultTabBar) => (
					<DefaultTabBar {...props} className="tabs-header" />
				)}
				onChange={(activeKey) => setActiveTab(activeKey as TabKey)}
			>
				<TabPane
					tab="Connection Options"
					key={TabKey.ConnectionOptions}
					className="tab-content"
				>
					<ConnectionOptions form={connectionOptionsForm} />
				</TabPane>
				<TabPane tab="Variables" key={TabKey.Variables} className="tab-content">
					<EnvironmentVariables
						form={environmentVariablesForm}
						initialNameValuePairs={
							[
								// { varName: 'one', varValue: '1' },
								// { varName: 'two', varValue: '2' },
								// { varName: 'three', varValue: '3' },
								// { varName: 'four', varValue: '4' },
							]
						}
					/>
				</TabPane>
			</Tabs>
			<Button
				className="action-button"
				type="primary"
				shape="circle"
				icon={<SaveOutlined size={1} />}
				size={'large'}
				onClick={onClickConnect}
			/>
		</div>
	);
}
