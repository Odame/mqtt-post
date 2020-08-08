import React, { useState, useEffect } from 'react';
import {
	Form,
	Input,
	Select,
	InputNumber,
	Radio,
	Upload,
	Button,
	Switch,
	Card,
	Space,
} from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { FolderOpenOutlined, SyncOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { ColProps } from 'antd/lib/col';
import { defaultFormValidateMessages } from '../utils/formValidation';

const { shell } = window.require('electron');
const openExternalLink = (link: string) => {
	shell.openExternal(link);
};

const InfoButton = ({ link }: { link: string }) =>
	// <Button type="link" size="small" onClick={() => openExternalLink(link)}>
	// 	<InfoCircleOutlined />
	// </Button>
	null;

const InfoLinks = {
	general: '',
	certificates:
		'https://www.hivemq.com/blog/mqtt-security-fundamentals-x509-client-certificate-authentication/',
	lastWill: '',
};

const inlineFormItemStyles: React.CSSProperties = {
	display: 'inline-block',
};

const formColProps: Record<
	'default' | 'nested',
	{ labelCol: ColProps; wrapperCol: ColProps }
> = {
	default: {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 6 },
			lg: { span: 4 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 18 },
			lg: { span: 16 },
		},
	},
	nested: {
		labelCol: {
			xs: { span: 20, offset: 2 },
			sm: { span: 10, offset: 0 },
			lg: { span: 6, offset: 0 },
		},
		wrapperCol: {
			xs: { span: 20, offset: 2 },
			sm: { span: 12, offset: 0 },
			lg: { span: 16, offset: 0 },
		},
	},
};

const generateRandomClientId = () =>
	'mqtt_post_' + Math.random().toString(16).substr(2, 8);

/** Representation of mqtt connection options as stored in db */
export interface IConnectionOptions {
	name: string;
	clientId: string;
	keepalive: number;
	connectTimeout: number;
	reconnectPeriod: number;
	clean: boolean;
	protocolVersion: number;
	protocol: 'mqtt' | 'mqtts' | 'ws' | 'wss';
	hostname: string;
	port: number;
	path: string;
	username?: string;
	password?: string;
	ca?: {};
	cert?: {};
	key?: {};
}

const defaultValues = {
	name: '',
	clientId: generateRandomClientId(),
	keepalive: 60,
	connectTimeout: 30,
	reconnectPeriod: 1,
	clean: true,
	protocolVersion: 5,

	// see https://test.mosquitto.org/ for more info on connection options on this public broker
	protocol: 'mqtt',
	hostname: 'test.mosquitto.org',
	port: 1883,
	path: '/', // only useful when the user chooses ws:// or wss:// protocol

	username: '',
	password: '',
} as IConnectionOptions;

type ConnectionOptionsProps = {
	prevOptions?: IConnectionOptions;
	form: FormInstance;
};
const ConnectionOptions = ({ prevOptions, form }: ConnectionOptionsProps) => {
	const [initialFormValues] = useState({ ...defaultValues, ...prevOptions });
	const [clientId, setClientId] = useState<string>(generateRandomClientId());
	useEffect(() => {
		form.setFieldsValue({ clientId: clientId });
	}, [clientId, form]);

	const getFileProps = (name: string) => {
		return {
			beforeUpload: (file: RcFile, filesList: RcFile[]) => {
				return false;
			},
			onRemove: (file: UploadFile) => {
				return true;
			},
		};
	};

	return (
		<Form
			form={form}
			{...formColProps.default}
			scrollToFirstError
			initialValues={initialFormValues}
			validateMessages={defaultFormValidateMessages}
		>
			<Space
				direction="vertical"
				size="large"
				style={{ width: '100%', contain: 'layout' }}
			>
				<Card
					type="inner"
					title="General"
					extra={<InfoButton link={InfoLinks.general} />}
					style={{ width: '100%', contain: 'layout' }}
				>
					<Form.Item
						label="Name"
						name={['name']}
						rules={[{ required: true, min: 2, type: 'string' }]}
					>
						<Input placeholder="Name for identifying this connection" />
					</Form.Item>

					<Form.Item
						label="Client ID"
						name="clientId"
						rules={[{ required: true, min: 2, type: 'string' }]}
					>
						<Input
							addonAfter={
								<Button
									type="link"
									size="small"
									shape="circle"
									onClick={() => setClientId(generateRandomClientId())}
									color="green"
									icon={<SyncOutlined />}
								/>
							}
							placeholder="Client ID to use in this connection"
						/>
					</Form.Item>

					<Form.Item label="Host" required>
						<Input.Group compact>
							<Form.Item
								label="Protocol"
								name="protocol"
								rules={[{ required: true }]}
								noStyle
							>
								<Select
									style={{ width: '20%' }}
									placeholder="Protocol"
									options={[
										{ value: 'mqtt', label: 'mqtt://' },
										{ value: 'mqtts', label: 'mqtts://' },
										{ value: 'ws', label: 'ws://' },
										{ value: 'wss', label: 'wss://' },
									]}
								/>
							</Form.Item>

							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) =>
									prevValues.protocol !== currentValues.protocol
								}
							>
								{({ getFieldValue }) => {
									const isWebSockets = ['wss', 'ws'].includes(
										getFieldValue('protocol')
									);
									return (
										<Form.Item
											label="Hostname"
											name="hostname"
											noStyle
											rules={[{ required: true, type: 'string' }]}
										>
											<Input
												style={{ width: isWebSockets ? '40%' : '60%' }}
												placeholder="Hostname"
											/>
										</Form.Item>
									);
								}}
							</Form.Item>

							<Form.Item
								label="Port"
								name="port"
								noStyle
								rules={[{ required: true, max: 65535, min: 0, type: 'number' }]}
							>
								<InputNumber
									style={{ width: '20%' }}
									min={0}
									max={65535}
									placeholder="Port"
								/>
							</Form.Item>
							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) =>
									prevValues.protocol !== currentValues.protocol
								}
							>
								{({ getFieldValue }) => {
									return ['wss', 'ws'].includes(getFieldValue('protocol')) ? (
										<Form.Item
											label="Path"
											name="path"
											noStyle
											rules={[{ required: true, type: 'string' }]}
										>
											<Input placeholder="Path" style={{ width: '20%' }} />
										</Form.Item>
									) : null;
								}}
							</Form.Item>
						</Input.Group>
					</Form.Item>

					<Form.Item label="Credentials">
						<Space direction="horizontal" align="center" size="small">
							<Form.Item
								label="Username"
								name="username"
								noStyle
								style={{ ...inlineFormItemStyles }}
								rules={[{ type: 'string' }]}
							>
								<Input placeholder="Username" />
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
								noStyle
								style={{ ...inlineFormItemStyles }}
								rules={[{ type: 'string' }]}
							>
								<Input.Password placeholder="Password" />
							</Form.Item>
						</Space>
					</Form.Item>

					<Form.Item
						name="clean"
						label="Clean Session"
						{...formColProps.nested}
						rules={[{ type: 'boolean' }]}
					>
						<Switch defaultChecked={initialFormValues.clean} />
					</Form.Item>
					<Form.Item
						name="reconnectPeriod"
						label="Auto Reconnect Period (s)"
						rules={[{ required: true, min: 0, type: 'number' }]}
						{...formColProps.nested}
					>
						<InputNumber min={0} />
					</Form.Item>
					<Form.Item
						label="Connect Timeout (s)"
						name="connectTimeout"
						rules={[{ required: true, min: 0, type: 'number' }]}
						{...formColProps.nested}
					>
						<InputNumber min={0} />
					</Form.Item>
					<Form.Item
						label="Keep Alive (s)"
						name="keepalive"
						rules={[{ required: true, min: 0, type: 'number' }]}
						{...formColProps.nested}
					>
						<InputNumber min={0} />
					</Form.Item>

					<Form.Item
						name="protocolVersion"
						label="MQTT Version"
						{...formColProps.nested}
						rules={[{ required: true }]}
					>
						<Radio.Group buttonStyle="solid">
							<Radio.Button value={5}>{`  v5  `}</Radio.Button>
							<Radio.Button value={4}>v3.1.1</Radio.Button>
							<Radio.Button value={3}>{` v3.1 `}</Radio.Button>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currValues) =>
							prevValues.protocolVersion !== currValues.protocolVersion
						}
					>
						{({ getFieldValue }) => {
							const protocolVersion: number | undefined = getFieldValue(
								'protocolVersion'
							);
							return protocolVersion === 5 ? (
								<Form.Item label="MQTT 5 Options" {...formColProps.nested}>
									<Space
										direction="horizontal"
										align="center"
										size="small"
										style={{ width: '100%' }}
									>
										<Form.Item
											label="Session Expiry Interval"
											name="sessionExpiryInterval"
											noStyle
											style={{ width: '30%', ...inlineFormItemStyles }}
											rules={[{ type: 'number', min: 0 }]}
										>
											<InputNumber
												min={0}
												placeholder="Session Expiry Interval"
												style={{ width: '100%' }}
											/>
										</Form.Item>
										<Form.Item
											label="Receive Maximum"
											name="receiveMaximum"
											noStyle
											style={{ width: '30%', ...inlineFormItemStyles }}
											rules={[{ min: 0, type: 'number' }]}
										>
											<InputNumber
												min={0}
												placeholder="Receive Maximum"
												style={{ width: '100%' }}
											/>
										</Form.Item>
										<Form.Item
											label="Topic Alias Maximum"
											name="topicAliasMaximum"
											noStyle
											style={{ width: '30%', ...inlineFormItemStyles }}
											rules={[{ min: 0, type: 'number' }]}
										>
											<InputNumber
												min={0}
												placeholder="Topic Alias Maximum"
												style={{ width: '100%' }}
											/>
										</Form.Item>
									</Space>
								</Form.Item>
							) : null;
						}}
					</Form.Item>
				</Card>

				<Card type="inner" title="Certificate" extra={<InfoButton link="" />}>
					<Form.Item name="ssl_tls" label="SSL/TLS" {...formColProps.nested}>
						<Switch defaultChecked={false} />
					</Form.Item>
					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currValues) =>
							prevValues.ssl_tls !== currValues.ssl_tls
						}
					>
						{({ getFieldValue }) => {
							const isSSL = getFieldValue('ssl_tls') === true;
							return (
								<Form.Item
									name="certSign"
									label="Signing"
									{...formColProps.nested}
									rules={!isSSL ? undefined : [{ required: true }]}
								>
									<Radio.Group
										disabled={!isSSL}
										defaultValue="serverSigned"
										options={[
											{ value: 'serverSigned', label: 'Server Signed' },
											{ value: 'selfSigned', label: 'Self Signed' },
										]}
									/>
								</Form.Item>
							);
						}}
					</Form.Item>
					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currValues) =>
							prevValues.ssl_tls !== currValues.ssl_tls ||
							prevValues.certSign !== currValues.certSign
						}
					>
						{({ getFieldValue }) => {
							/** Disabled if the user had not selected ssl and chosen selfSigned */
							const disabled =
								getFieldValue('ssl_tls') !== true ||
								getFieldValue('certSign') !== 'selfSigned';
							return (
								<>
									<Form.Item
										name="caFile"
										label="CA File"
										rules={[{ required: disabled ? false : true }]}
										{...formColProps.nested}
									>
										<Upload {...getFileProps('caFile')} disabled={disabled}>
											<Button disabled={disabled}>
												<FolderOpenOutlined color="grey" /> Select File
											</Button>
										</Upload>
									</Form.Item>
									<Form.Item
										name="clientCertFile"
										label="Client Certificate File"
										{...formColProps.nested}
										rules={[{ required: disabled ? false : true }]}
									>
										<Upload
											{...getFileProps('clientCertFile')}
											disabled={disabled}
										>
											<Button disabled={disabled}>
												<FolderOpenOutlined color="grey" /> Select File
											</Button>
										</Upload>
									</Form.Item>
									<Form.Item
										name="clientKeyFile"
										label="Client Key File"
										{...formColProps.nested}
										rules={[{ required: disabled ? false : true }]}
									>
										<Upload
											{...getFileProps('clientKeyFile')}
											disabled={disabled}
										>
											<Button disabled={disabled}>
												<FolderOpenOutlined color="grey" /> Select File
											</Button>
										</Upload>
									</Form.Item>
									<Form.Item
										name="strictValidateCert"
										label="Strict Validate Cert?"
										{...formColProps.nested}
									>
										<Switch defaultChecked={false} disabled={disabled} />
									</Form.Item>
								</>
							);
						}}
					</Form.Item>
				</Card>

				<Card title="Last Will" type="inner">
					<Form.Item name="lastWillTopic" label="Topic">
						<Input placeholder="eg: nodes/014/offline" />
					</Form.Item>

					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currValues) =>
							prevValues.lastWillTopic !== currValues.lastWillTopic
						}
					>
						{({ getFieldValue }) => {
							const lastWillTopic = getFieldValue('lastWillTopic') as string;
							const disabled =
								lastWillTopic === undefined || lastWillTopic.trim() === '';
							return (
								<>
									<Form.Item name="lastWillQoS" label="QoS">
										<Radio.Group
											disabled={disabled}
											options={[
												{ value: 0, label: 0 },
												{ value: 1, label: 1 },
												{ value: 2, label: 2 },
											]}
										/>
									</Form.Item>

									<Form.Item name="lastWillRetain" label="Retain">
										<Switch defaultChecked={false} disabled={disabled} />
									</Form.Item>

									<Form.Item name="lastWillPayload" label="Payload">
										<Input.TextArea disabled={disabled} />
									</Form.Item>
								</>
							);
						}}
					</Form.Item>
				</Card>
			</Space>
		</Form>
	);
};

export default ConnectionOptions;
