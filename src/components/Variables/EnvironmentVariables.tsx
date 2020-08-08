import React, { FunctionComponent } from 'react';
import Form, { FormInstance } from 'antd/lib/form';
import { Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ColProps } from 'antd/lib/col';
import './EnvironmentVariables.css';

const formColProps = {
	default: {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 6 },
			lg: { span: 4 },
		} as ColProps,
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 18 },
			lg: { span: 16 },
		} as ColProps,
	},
	tail: {
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 18, offset: 6 },
			lg: { span: 16, offset: 4 },
		} as ColProps,
	},
	saveButton: {
		wrapperCol: {
			xs: { span: 4, offset: 6 },
			sm: { span: 4, offset: 12 },
			lg: { span: 4, offset: 11 },
		} as ColProps,
	},
};

type IVar = {
	name: string;
	value: string;
	editable: boolean;
};
type EnvironmentVariablesProps = {
	form: FormInstance;
	initialNameValuePairs?: Array<{ varName: string; varValue: string }>;
};
const EnvironmentVariables: FunctionComponent<EnvironmentVariablesProps> = (
	props
) => {
	const onFinish = (values: any) => {
		console.log('Received values of form:', values);
	};

	return (
		<div>
			<Form
				onFinish={onFinish}
				autoComplete="off"
				{...formColProps.default}
				initialValues={{
					keyValuePairs: props.initialNameValuePairs || [],
				}}
			>
				<Form.List name="keyValuePairs">
					{(fields, { add, remove }) => {
						return (
							<>
								{fields.map((field, i) => {
									return (
										<Form.Item
											label={`Item #${(field.fieldKey + 1).toString()}`}
											// key={Math.random().toString().substr(2)}
										>
											<div
												className="environment-variables-entry-container"
												key={Math.random().toString().substr(2)}
											>
												<Form.Item
													className="environment-variable-field"
													{...field}
													noStyle
													name={[field.name, 'varName']}
													fieldKey={[field.fieldKey, 'varName']}
													style={{ display: 'inline-block' }}
												>
													<Input placeholder="Name" />
												</Form.Item>
												<Form.Item
													className="environment-variable-input"
													{...field}
													noStyle
													name={[field.name, 'varValue']}
													fieldKey={[field.fieldKey, 'varValue']}
													style={{ display: 'inline-block' }}
												>
													<Input placeholder="Value" />
												</Form.Item>

												<Button
													className="remove-environment-variable-button"
													onClick={() => {
														remove(field.name);
													}}
													type="text"
													shape="circle-outline"
													icon={<MinusCircleOutlined />}
												/>
											</div>
										</Form.Item>
									);
								})}

								<Form.Item {...formColProps.tail}>
									<Button type="dashed" onClick={() => add()} block>
										<PlusOutlined /> Add field
									</Button>
								</Form.Item>
							</>
						);
					}}
				</Form.List>

				<Form.Item {...formColProps.saveButton}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default EnvironmentVariables;
