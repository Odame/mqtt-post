import {
	STRING_TYPE,
	BOOLEAN_TYPE,
	POSITIVE_INTEGER_TYPE,
	QOS_TYPE,
} from '../types';
import { RxDocument, RxCollection, RxJsonSchema, PrimaryProperty } from 'rxdb';

const SCHEMA_VERSION = 0;
/** MQTT Connection and related info as stored in database */
interface IConnection {
	id: string;
	/** Supported client connection options that can be stored in the Database */
	clientOptions: {
		id: string;
		name: string;
		clientId: string;
		protocol: 'wss' | 'ws' | 'mqtt' | 'mqtts';
		protocolVersion: 3 | 4 | 5;
		hostname: string;
		port: number;
		path?: string;
		username?: string;
		password?: string;
		clean: boolean;
		reconnectPeriod: number;
		connectTimeout: number;
		keepalive: number;
		properties?: {
			sessionExpiryInterval: number;
			receiveMaximum: number;
			topicAliasMaximum: number;
		};
		will?: {
			topic: string;
			payload?: string;
			qos: 0 | 1 | 2;
			retain: boolean;
			properties?: {
				willDelayInterval?: number;
				messageExpiryInterval?: number;
			};
		};
	};
	variables: Array<{ key: string; value: string }>;
}
interface IConnectionDocumentMethods {
	// TODO: Define a method to get a variable by key
}
// export type IConnectionDocument = RxDocument<
// 	IConnectionDocumentType,
// 	IConnectionDocumentMethods
// >;

interface IConnectionsCollectionMethods {}
export type IConnectionsCollection = RxCollection<
	IConnection,
	IConnectionDocumentMethods,
	IConnectionsCollectionMethods
>;

const schema: RxJsonSchema<IConnection> = {
	version: SCHEMA_VERSION,
	type: 'object',
	required: ['clientOptions', 'variables'],
	properties: {
		id: {
			...STRING_TYPE,
			primary: true,
		} as PrimaryProperty,
		clientOptions: {
			type: 'object',
			required: [
				'name',
				'clientId',
				'protocol',
				'protocolVersion',
				'hostname',
				'port',
				'clean',
				'reconnectPeriod',
				'connectTimeout',
				'keepalive',
			],
			properties: {
				name: STRING_TYPE,
				clientId: STRING_TYPE,
				protocol: STRING_TYPE,
				protocolVersion: {
					enum: [3, 4, 5],
				},
				hostname: STRING_TYPE,
				port: {
					...POSITIVE_INTEGER_TYPE,
					maximum: 65535,
				},
				path: STRING_TYPE,
				username: STRING_TYPE,
				password: STRING_TYPE,
				clean: BOOLEAN_TYPE,
				reconnectPeriod: POSITIVE_INTEGER_TYPE,
				connectTimeout: POSITIVE_INTEGER_TYPE,
				keepalive: POSITIVE_INTEGER_TYPE,
				properties: {
					type: 'object',
					properties: {
						sessionExpiryInterval: POSITIVE_INTEGER_TYPE,
						receiveMaximum: POSITIVE_INTEGER_TYPE,
						topicAliasMaximum: POSITIVE_INTEGER_TYPE,
					},
				},
				will: {
					type: 'object',
					properties: {
						topic: STRING_TYPE,
						payload: STRING_TYPE,
						qos: QOS_TYPE,
						retain: BOOLEAN_TYPE,
						properties: {
							type: 'object',
							properties: {
								willDelayInterval: POSITIVE_INTEGER_TYPE,
								messageExpiryInterval: POSITIVE_INTEGER_TYPE,
							},
						},
					},
					required: ['topic', 'payload', 'qos', 'retain'],
				},
			},
		},
		variables: {
			type: 'array',
			items: {
				type: 'object',
				required: ['key', 'value'],
				properties: {
					key: STRING_TYPE,
					value: STRING_TYPE,
				},
			},
		},
	},
};
export default schema;
