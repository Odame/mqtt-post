export enum Types {
	string = 'string',
	number = 'number',
	object = 'object',
}

export const STRING_TYPE = {
	type: 'string',
};
export const BOOLEAN_TYPE = {
	type: 'boolean',
};

export const INTEGER_TYPE = {
	type: 'integer',
};
export const POSITIVE_INTEGER_TYPE = {
	...INTEGER_TYPE,
	min: 0,
};

export const QOS_TYPE = {
	enum: [0, 1, 2],
};
