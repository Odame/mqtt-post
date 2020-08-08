/* eslint-disable no-template-curly-in-string */

const typeTemplate = "'${label}' is not a valid ${type}";

/** Form validation messages based on the definitions at https://github.com/react-component/field-form/blob/master/src/utils/messages.ts */
export const defaultFormValidateMessages = {
	default: "Validation error on field '${label}'",
	required: "'${label}' is required",
	enum: "'${label}' must be one of [${enum}]",
	whitespace: "'${label}' cannot be empty",
	date: {
		format: "'${label}' is invalid for format date",
		parse: "'${label}' could not be parsed as date",
		invalid: "'${label}' is invalid date",
	},
	types: {
		string: typeTemplate,
		method: typeTemplate,
		array: typeTemplate,
		object: typeTemplate,
		number: typeTemplate,
		date: typeTemplate,
		boolean: typeTemplate,
		integer: typeTemplate,
		float: typeTemplate,
		regexp: typeTemplate,
		email: typeTemplate,
		url: typeTemplate,
		hex: typeTemplate,
	},
	string: {
		len: "'${label}' must be exactly ${len} characters",
		min: "'${label}' must be at least ${min} characters",
		max: "'${label}' cannot be longer than ${max} characters",
		range: "'${label}' must be between ${min} and ${max} characters",
	},
	number: {
		len: "'${label}' must equal ${len}",
		min: "'${label}' cannot be less than ${min}",
		max: "'${label}' cannot be greater than ${max}",
		range: "'${label}' must be between ${min} and ${max}",
	},
	array: {
		len: "'${label}' must have exactly ${len} items",
		min: "'${label}' cannot have less than ${min} items",
		max: "'${label}' cannot have more than ${max} items",
		range: "'${label}' must have between ${min} and ${max} items",
	},
	pattern: {
		mismatch: "'${label}' does not match pattern ${pattern}",
	},
};
