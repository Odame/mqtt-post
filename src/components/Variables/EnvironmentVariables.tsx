import React, { FunctionComponent, useState } from 'react';
import Form, { FormInstance } from 'antd/lib/form';
import { Input, Button, Row } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Col, { ColProps } from 'antd/lib/col';
import './EnvironmentVariables.css';
import { useForm } from 'antd/lib/form/Form';

const formColProps = {
	default: {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 4 },
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
			sm: { span: 18, offset: 4 },
			lg: { span: 16, offset: 4 },
		} as ColProps,
	},
	saveButton: {
		wrapperCol: {
			xs: { span: 4, offset: 6 },
			sm: { span: 4, offset: 11 },
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
	return (
		<Form
			form={props.form}
			autoComplete="off"
			{...formColProps.default}
			initialValues={{
				keyValuePairs: [
					...(props.initialNameValuePairs || []),
					{ varName: '', varValue: '' },
				],
			}}
			scrollToFirstError
			className="environment-variables-form"
		>
			<Form.List name="keyValuePairs">
				{(fields, { add, remove }) => {
					const isSingleItem = fields.length === 1;
					return (
						<>
							{fields.map((field, i) => {
								return (
									<Form.Item label={`Item #${(field.fieldKey + 1).toString()}`}>
										<div
											className="environment-variables-entry-container"
											key={Math.random().toString().substr(2)}
										>
											<Form.Item noStyle shouldUpdate={true}>
												{({ getFieldValue }) => {
													const isRequired = !!(getFieldValue([
														'keyValuePairs',
														field.name,
														'varValue',
													]) as string)?.trim();
													return (
														<Form.Item
															className="environment-variable-field"
															{...field}
															noStyle
															name={[field.name, 'varName']}
															fieldKey={[field.fieldKey, 'varName']}
															style={{ display: 'inline-block' }}
															rules={[
																{
																	required: isRequired,
																	type: 'string',
																	message: 'Name is required',
																},
															]}
														>
															<Input placeholder="Name" />
														</Form.Item>
													);
												}}
											</Form.Item>
											<Form.Item noStyle shouldUpdate={true}>
												{({ getFieldValue }) => {
													const isRequired = !!(getFieldValue([
														'keyValuePairs',
														field.name,
														'varName',
													]) as string)?.trim();
													return (
														<Form.Item
															className="environment-variable-input"
															{...field}
															noStyle
															name={[field.name, 'varValue']}
															fieldKey={[field.fieldKey, 'varValue']}
															style={{ display: 'inline-block' }}
															rules={[
																{
																	required: isRequired,
																	type: 'string',
																	message: 'Value is required',
																},
															]}
														>
															<Input placeholder="Value" />
														</Form.Item>
													);
												}}
											</Form.Item>

											<Button
												className="remove-environment-variable-button"
												onClick={
													isSingleItem
														? undefined
														: () => {
																remove(field.name);
														  }
												}
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
		</Form>
	);
};

export default EnvironmentVariables;
