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
	Col,
} from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import {
	InfoCircleOutlined,
	FolderOpenOutlined,
	SyncOutlined,
} from '@ant-design/icons';
import { IConnectionOptions } from '../features/connectionsList/ConnectionsSlice';
import { FormInstance } from 'antd/lib/form';
import { ColProps } from 'antd/lib/col';
import { useForm } from 'antd/lib/form/Form';

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

type ConnectionOptionsProps = {
	connId?: string;
	prevOptions?: Partial<IConnectionOptions>;
	formRef: (form: FormInstance) => void;
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
			sm: {
				span: 6,
			},
			lg: {
				span: 4,
			},
		},
		wrapperCol: {
			sm: {
				span: 18,
			},
			lg: {
				span: 16,
			},
		},
	},
	nested: {
		labelCol: {
			sm: {
				span: 10,
			},
			lg: {
				span: 6,
			},
		},
		wrapperCol: {
			sm: {
				span: 12,
			},
			lg: {
				span: 16,
			},
		},
	},
};

const generateRandomClientId = () =>
	'mqtt_post_' + Math.random().toString(16).substr(2, 8);

const ConnectionOptions = ({
	connId,
	prevOptions,
	formRef,
}: ConnectionOptionsProps) => {
	const [form] = useForm();
	const connectionId = connId || Date.now().toString();
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

	useEffect(() => {
		formRef(form);
	}, [form, formRef]);

	return (
		<Form form={form} {...formColProps.default} scrollToFirstError>
			<Space
				direction="vertical"
				size="large"
				style={{ width: '100%', contain: 'layout' }}
			>
				<Card
					type="inner"
					title="General"
					extra={<InfoButton link={InfoLinks.general} />}
				>
					<Form.Item label="Name" name="name" rules={[{ required: true }]}>
						<Input placeholder="Name for identifying this connection" />
					</Form.Item>

					<Form.Item label="Client ID" name="clientId" required>
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
							<Form.Item name="protocol" required noStyle>
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
										<Form.Item name="hostname" noStyle>
											<Input
												style={{ width: isWebSockets ? '40%' : '60%' }}
												placeholder="Hostname"
											/>
										</Form.Item>
									);
								}}
							</Form.Item>

							<Form.Item name="port" noStyle>
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
										<Form.Item name="path" noStyle>
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
								name="username"
								noStyle
								style={{ ...inlineFormItemStyles }}
							>
								<Input placeholder="Username" />
							</Form.Item>
							<Form.Item
								name="Password"
								noStyle
								style={{ ...inlineFormItemStyles }}
							>
								<Input.Password placeholder="Password" />
							</Form.Item>
						</Space>
					</Form.Item>

					<Form.Item
						name="autoReconnect"
						label="Auto Reconnect"
						{...formColProps.nested}
					>
						<Switch defaultChecked={false} />
					</Form.Item>
					<Form.Item
						name="cleanSession"
						label="Clean Session"
						{...formColProps.nested}
					>
						<Switch defaultChecked />
					</Form.Item>
					<Form.Item
						label="Connect Timeout (s)"
						name="connectTimeout"
						initialValue={10}
						required
						{...formColProps.nested}
					>
						<InputNumber min={0} />
					</Form.Item>
					<Form.Item
						label="Keep Alive (s)"
						name="keepalive"
						initialValue={30}
						required
						{...formColProps.nested}
					>
						<InputNumber min={0} />
					</Form.Item>

					<Form.Item
						name="protocolVersion"
						label="MQTT Version"
						{...formColProps.nested}
						required
					>
						<Radio.Group defaultValue={5} buttonStyle="solid">
							<Radio.Button value={3}>v3.1.1</Radio.Button>
							<Radio.Button value={5}>{`  v5  `}</Radio.Button>
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
											name="sessionExpiryInterval"
											noStyle
											style={{ width: '30%', ...inlineFormItemStyles }}
										>
											<InputNumber
												min={0}
												placeholder="Session Expiry Interval"
												style={{ width: '100%' }}
											/>
										</Form.Item>
										<Form.Item
											name="receiveMaximum"
											noStyle
											style={{ width: '30%', ...inlineFormItemStyles }}
										>
											<InputNumber
												min={0}
												placeholder="Receive Maximum"
												style={{ width: '100%' }}
											/>
										</Form.Item>
										<Form.Item
											name="topicAliasMaximum"
											noStyle
											style={{ width: '30%', ...inlineFormItemStyles }}
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
							console.log(`certSign is ${getFieldValue('certSign')}`);
							const disabled =
								getFieldValue('ssl_tls') !== true ||
								getFieldValue('certSign') !== 'selfSigned';
							return (
								<>
									{/* TODO: Specify the file types for the Upload components */}
									<Form.Item
										name="caFile"
										label="CA File"
										required
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

					<Form.Item name="lastWillQoS" label="QoS">
						<Radio.Group
							options={[
								{ value: 0, label: 0 },
								{ value: 1, label: 1 },
								{ value: 2, label: 2 },
							]}
						/>
					</Form.Item>

					<Form.Item name="lastWillRetain" label="Retain">
						<Switch defaultChecked={false} />
					</Form.Item>

					<Form.Item name="lastWillPayload" label="Payload">
						<Input.TextArea />
					</Form.Item>
				</Card>
			</Space>
		</Form>
	);
};

export default ConnectionOptions;