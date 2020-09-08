import {
	STRING_TYPE,
	BOOLEAN_TYPE,
	POSITIVE_INTEGER_TYPE,
	QOS_TYPE,
} from '../types';
import { RxCollection, RxJsonSchema, PrimaryProperty, RxDocument } from 'rxdb';
import { generate as generateShortId } from 'shortid';
import { BehaviorSubject } from 'rxjs';

const SCHEMA_VERSION = 0;
/** MQTT Connection and related info as stored in database */
export interface IConnection {
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
			sessionExpiryInterval?: number;
			receiveMaximum?: number;
			topicAliasMaximum?: number;
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
	/** Key-value pairs associated with this connection.
	 * These can be used when making subscriptions or publishes
	 */
	variables: Array<{ key: string; value: string }>;
}

/** Instance methods on `IConnection` */
interface IConnectionMethods {
	/** Get the value of a variable, given it's key */
	getVar: (key: string) => string | null;
}
type IConnectionDocument = RxDocument<IConnection, IConnectionMethods>;

/** Static methods on `IConnectionsCollection` */
interface IConnectionsCollectionMethods {
	/** Get a connection given it's id */
	getConnection: (id: string) => Promise<IConnectionDocument | null>;
	/** Returns an observable which can be used to subscribe to changes to a connection */
	getConnection$: (id: string) => BehaviorSubject<IConnectionDocument | null>;
	/** Update a connection's info in the database.
	 * If the connection does not exist already, it will be created with an auto-generated id
	 */
	upsertConnection: (
		connectionData: IConnection | Omit<IConnection, 'id'>
	) => Promise<IConnectionDocument>;
}
export type IConnectionsCollection = RxCollection<
	IConnection,
	IConnectionMethods,
	IConnectionsCollectionMethods
>;

export const connectionDocumentMethods: IConnectionMethods = {
	getVar: function (this: IConnection, key: string) {
		const keyValuePair = this.variables.find(
			(variable) => variable.key === key
		);
		if (keyValuePair) return keyValuePair.value;
		return null;
	},
};
export const connectionCollectionMethods: IConnectionsCollectionMethods = {
	getConnection: async function (this: IConnectionsCollection, id) {
		return this.findOne({ selector: { id } }).exec();
	},
	getConnection$: function (this: IConnectionsCollection, id) {
		return this.findOne({ selector: { id } }).$;
	},
	upsertConnection: async function (
		this: IConnectionsCollection,
		connectionData
	) {
		const connection = await this.insert({
			...connectionData,
			id: (connectionData as IConnection).id || generateShortId(),
		});
		return connection;
	},
};

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
