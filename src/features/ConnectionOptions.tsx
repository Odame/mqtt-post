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
import {
	InfoCircleOutlined,
	FolderOpenOutlined,
	SyncOutlined,
} from '@ant-design/icons';
import { IConnectionOptions } from './connectionsList/ConnectionsSlice';

const { shell } = window.require('electron');
const openExternalLink = (link: string) => {
	shell.openExternal(link);
};

const InfoButton = ({ link }: { link: string }) => (
	<Button type="link" onClick={() => openExternalLink(link)}>
		<InfoCircleOutlined />
	</Button>
);

const InfoLinks = {
	general: '',
	certificates:
		'https://www.hivemq.com/blog/mqtt-security-fundamentals-x509-client-certificate-authentication/',
	lastWill: '',
};

type Props = {
	connId?: string;
	prevOptions?: Partial<IConnectionOptions>;
};

const inlineFormItemStyles: React.CSSProperties = {
	display: 'inline-block',
};

const ConnectionOptions = ({ connId, prevOptions }: Props) => {
	const connectionId = connId || Date.now().toString();
	const [clientId, setClientId] = useState<string>('ghghghf');
	const [form] = Form.useForm();

	const [_, setVar] = useState<number>();
	useEffect(() => {
		setVar((c) => Math.random());
	}, []);

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
		<div style={{ height: '100%', width: '100%' }}>
			<Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
				<Space direction="vertical" size="large" style={{ width: '100%' }}>
					<Card
						type="inner"
						title="General"
						extra={<InfoButton link={InfoLinks.general} />}
					>
						<Form.Item label="Name" name="name" required>
							<Input placeholder="Name for identifying this connection" />
						</Form.Item>

						<Form.Item label="Client ID" name="clientId" required>
							<Input
								addonAfter={
									<Button
										type="link"
										size="small"
										shape="circle"
										onClick={() => {}}
										color="green"
										icon={<SyncOutlined />}
									/>
								}
								value={clientId}
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

						<Form.Item name="autoReconnect" label="Auto Reconnect">
							<Switch defaultChecked={false} />
						</Form.Item>
						<Form.Item name="cleanSession" label="Clean Session">
							<Switch defaultChecked />
						</Form.Item>
						<Form.Item
							label="Connect Timeout (s)"
							name="connectTimeout"
							initialValue={10}
							required
						>
							<InputNumber min={0} />
						</Form.Item>
						<Form.Item
							label="Keep Alive (s)"
							name="keepalive"
							initialValue={30}
							required
						>
							<InputNumber min={0} />
						</Form.Item>

						<Form.Item name="protocolVersion" label="MQTT Version">
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
								return getFieldValue('protocolVersion') === 5 ? (
									<Form.Item label="MQTT 5 Options">
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
						<Form.Item name="ssl_tls" label="SSL/TLS">
							<Switch defaultChecked={false} />
						</Form.Item>
						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currValues) =>
								prevValues.ssl_tls !== currValues.ssl_tls
							}
						>
							{({ getFieldValue }) => {
								console.log(`ssl is ${getFieldValue('ssl_tls')}`);
								const isSSL = getFieldValue('ssl_tls') === true;
								return (
									<Form.Item name="certSign" label="Signing">
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
										<Form.Item name="caFile" label="CA File" required>
											<Upload {...getFileProps('caFile')} disabled={disabled}>
												<Button disabled={disabled}>
													<FolderOpenOutlined color="grey" /> Select File
												</Button>
											</Upload>
										</Form.Item>
										<Form.Item
											name="clientCertFile"
											label="Client Certificate File"
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
										<Form.Item name="clientKeyFile" label="Client Key File">
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
		</div>
	);
};

export default ConnectionOptions;
