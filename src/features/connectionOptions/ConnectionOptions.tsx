import React from 'react';
import { IClientOptions } from 'mqtt';
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
import { InfoCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
import './ConnectionOptions.css';

const { shell } = window.require('electron');

const openExternalLink = (link: string) => {
	shell.openExternal(link);
};

type Props = {
	id?: string;
	prevOptions?: IClientOptions;
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

const ConnectionOptions = () => {
	const [form] = Form.useForm();

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
		<div>
			<Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
				<Card
					type="inner"
					title="General"
					extra={<InfoButton link={InfoLinks.general} />}
				>
					<Form.Item label="Name" name="name" required>
						<Input placeholder="Name for identifying this connection" />
					</Form.Item>

					<Form.Item label="Client ID" name="clientId" required>
						<Input placeholder="Client ID to use in this connection" />
					</Form.Item>

					<Form.Item label="Host">
						<Space direction="horizontal" align="center">
							<Form.Item
								name="protocol"
								required
								noStyle
								className="form-item-inline"
							>
								<Select
									placeholder="Protocol"
									options={[
										{ value: 'mqtt', label: 'mqtt://' },
										{ value: 'mqtts', label: 'mqtts://' },
										{ value: 'ws', label: 'ws://' },
										{ value: 'wss', label: 'wss://' },
									]}
								/>
							</Form.Item>
							<Form.Item name="hostname" noStyle className="form-item-inline">
								<Input placeholder="Hostname" />
							</Form.Item>
							<Form.Item name="port" noStyle className="form-item-inline">
								<InputNumber min={0} max={65535} placeholder="Port" />
							</Form.Item>

							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) =>
									prevValues.protocol !== currentValues.protocol
								}
							>
								{({ getFieldValue }) => {
									return ['wss', 'ws'].includes(getFieldValue('protocol')) ? (
										<Form.Item name="path" noStyle className="form-item-inline">
											<Input placeholder="Path" />
										</Form.Item>
									) : null;
								}}
							</Form.Item>
						</Space>
					</Form.Item>

					<Form.Item label="Credentials" noStyle>
						<Space direction="horizontal" align="center">
							<Form.Item name="username">
								<Input placeholder="Username" />
							</Form.Item>
							<Form.Item name="Password">
								<Input placeholder="Password" />
							</Form.Item>
						</Space>
					</Form.Item>

					<Card type="inner">
						{/* Connection timeout and keepalive, on the same row */}
						<Form.Item>
							<Space direction="horizontal" align="center">
								<Form.Item
									className="form-item-inline"
									label="Connect Timeout (s)"
									name="connectTimeout"
									initialValue={10}
									required
									noStyle
								>
									<InputNumber min={0} />
								</Form.Item>
								<Form.Item
									className="form-item-inline"
									label="Keep Alive (s)"
									name="keepalive"
									initialValue={30}
									required
									noStyle
								>
									<InputNumber min={0} />
								</Form.Item>
							</Space>
						</Form.Item>

						{/* Clean session and Auto reconnect */}
						<Form.Item>
							<Space direction="horizontal" align="center">
								<Form.Item
									name="cleanSession"
									label="Clean Session"
									noStyle
									className="form-item-inline"
								>
									<Switch defaultChecked />
								</Form.Item>
								<Form.Item
									name="autoReconnect"
									label="Auto Reconnect"
									noStyle
									className="form-item-inline"
								>
									<Switch defaultChecked={false} />
								</Form.Item>
							</Space>
						</Form.Item>

						<Form.Item name="protocolVersion" label="MQTT Version">
							<Select
								options={[
									{ value: 3, label: '3.1.1' },
									{ value: 5, label: '5.0' },
								]}
							/>
						</Form.Item>

						<Form.Item
							noStyle
							shouldUpdate={(prevValues, currValues) =>
								prevValues.protocolVersion !== currValues.protocolVersion
							}
						>
							{({ getFieldValue }) => {
								return getFieldValue('protocolVersion') === 5 ? (
									<Space>
										<Form.Item
											className="form-item-inline"
											name="sessionExpiryInterval"
											label="Session Expiry Interval"
										>
											<InputNumber min={0} />
										</Form.Item>
										<Form.Item
											className="form-item-inline"
											name="receiveMaximum"
											label="Receive Maximum"
										>
											<InputNumber min={0} />
										</Form.Item>
										<Form.Item
											className="form-item-inline"
											name="topicAliasMaximum"
											label="Topic Alias Maximum"
										>
											<InputNumber min={0} />
										</Form.Item>
									</Space>
								) : null;
							}}
						</Form.Item>
					</Card>
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
							return getFieldValue('ssl_tls') === true ? (
								<Form.Item name="certSign">
									<Radio.Group
										defaultValue="serverSigned"
										options={[
											{ value: 'serverSigned', label: 'Server Signed' },
											{ value: 'selfSigned', label: 'Self Signed' },
										]}
									/>
								</Form.Item>
							) : null;
						}}
					</Form.Item>
					<Form.Item
						noStyle
						shouldUpdate={(prevValues, currValues) =>
							prevValues.ssl_tls !== currValues.ssl_tls
						}
					>
						{({ getFieldValue }) => {
							return getFieldValue('certSign') === 'selfSigned' ? (
								<>
									{/* TODO: Specify the file types for the Upload components */}
									<Form.Item name="caFile" label="CA File" required>
										<Upload {...getFileProps('caFile')}>
											<Button>
												<FolderOpenOutlined color="grey" /> Select File
											</Button>
										</Upload>
									</Form.Item>
									<Form.Item
										name="clientCertFile"
										label="Client Certificate File"
									>
										<Upload {...getFileProps('clientCertFile')}>
											<Button>
												<FolderOpenOutlined color="grey" /> Select File
											</Button>
										</Upload>
									</Form.Item>
									<Form.Item name="clientKeyFile" label="Client Key File">
										<Upload {...getFileProps('clientKeyFile')}>
											<Button>
												<FolderOpenOutlined color="grey" /> Select File
											</Button>
										</Upload>
									</Form.Item>
									<Form.Item
										name="strictValidateCert"
										label="Strict Validate Cert?"
									>
										<Switch defaultChecked={false} />
									</Form.Item>
								</>
							) : null;
						}}
					</Form.Item>
				</Card>

				<Card title="Last Will">
					<Form.Item name="lastWillTopic" label="Topic">
						<Input placeholder="eg: nodes/014/offline" />
					</Form.Item>

					<Form.Item>
						<Space size="large" align="center">
							<Form.Item
								name="lastWillQos"
								label="QoS"
								className="form-item-inline"
								noStyle
							>
								<Radio.Group
									options={[
										{ value: 1, label: 1 },
										{ value: 2, label: 2 },
										{ value: 3, label: 3 },
									]}
								/>
							</Form.Item>
							<Form.Item
								name="lastWillRetain"
								label="Retain"
								className="form-item-inline"
								noStyle
							>
								<Switch defaultChecked={false} />
							</Form.Item>
						</Space>
					</Form.Item>

					<Form.Item name="lastWillPayload" label="Payload">
						<Input.TextArea />
					</Form.Item>
				</Card>
			</Form>
		</div>
	);
};

export default ConnectionOptions;
