import React, { FunctionComponent } from 'react';
import Form, { FormInstance } from 'antd/lib/form';
import { Space, Input, Button } from 'antd';
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

type EnvironmentVariablesProps = {
	form: FormInstance;
	constKeyValuePairs?: Array<{ varName: string; varValue: string }>;
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
					keyValuePairs: props.constKeyValuePairs
						? props.constKeyValuePairs
						: [],
				}}
			>
				<Form.List name="keyValuePairs">
					{(fields, { add, remove }) => {
						return (
							<>
								{fields.map((field, i) => {
									const disabled =
										props.constKeyValuePairs &&
										props.constKeyValuePairs.length > 0 &&
										i < props.constKeyValuePairs.length;
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
													rules={[{ required: true, message: 'Missing name' }]}
													style={{ display: 'inline-block' }}
												>
													<Input placeholder="Name" disabled={disabled} />
												</Form.Item>
												<Form.Item
													className="environment-variable-input"
													{...field}
													noStyle
													name={[field.name, 'varValue']}
													fieldKey={[field.fieldKey, 'varValue']}
													rules={[{ required: true, message: 'Missing value' }]}
													style={{ display: 'inline-block' }}
												>
													<Input placeholder="Value" disabled={disabled} />
												</Form.Item>

												<Button
													className="remove-environment-variable-button"
													disabled={disabled}
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
