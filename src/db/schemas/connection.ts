import {
	STRING_TYPE,
	BOOLEAN_TYPE,
	POSITIVE_INTEGER_TYPE,
	QOS_TYPE,
	INTEGER_TYPE,
	NULLABLE_STRING_TYPE,
} from '../types';
import { RxCollection, RxJsonSchema, PrimaryProperty, RxDocument } from 'rxdb';
import { generate as generateShortId } from 'shortid';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const SCHEMA_VERSION = 0;
/** MQTT Connection and related info as stored in database */
export interface IConnection {
	id: string;
	name: string;
	lastModified: number;
	paused: boolean;
	/** Supported client connection options that can be stored in the Database */
	clientOptions: {
		clientId: string;
		protocol: 'wss' | 'ws' | 'mqtt' | 'mqtts';
		protocolVersion: 3 | 4 | 5;
		hostname: string;
		port: number;
		path?: string;
		username: string | null;
		password: string | null;
		clean: boolean;
		reconnectPeriod: number;
		connectTimeout: number;
		keepalive: number;
		properties?: {
			sessionExpiryInterval?: number;
			receiveMaximum?: number;
			topicAliasMaximum?: number;
		};
		will: {
			topic?: string;
			payload?: string;
			qos: 0 | 1 | 2;
			retain: boolean;
			properties?: {
				willDelayInterval?: number;
				messageExpiryInterval?: number;
			};
		};
		sslTls: {
			useSSL: boolean;
			certSign?: 'serverSigned' | 'selfSigned';
			ca?: string;
			cert?: string;
			key?: string;
			rejectUnauthorized?: boolean;
		};
	};
}

/** Instance methods on `IConnection` */
interface IConnectionMethods {}
type IConnectionDocument = RxDocument<IConnection, IConnectionMethods>;

/** Static methods on `IConnectionsCollection` */
interface IConnectionsCollectionMethods {
	/** Observable to listen for ids of connections */
	getConnectionsIds$: (this: IConnectionsCollection) => Observable<string[]>;
	/** Get a connection given it's id */
	getConnection: (
		this: IConnectionsCollection,
		id: string
	) => Promise<IConnectionDocument | null>;
	/** Returns an observable which can be used to subscribe to changes to a connection */
	getConnection$: (
		this: IConnectionsCollection,
		id: string
	) => BehaviorSubject<IConnectionDocument | null>;
	/** Update a connection's info in the database.
	 * If the connection does not exist already, it will be created with an auto-generated id
	 */
	upsertConnection: (
		this: IConnectionsCollection,
		connectionData: IConnection | Omit<IConnection, 'id'>
	) => Promise<IConnectionDocument>;
	deleteConnection: (
		this: IConnectionsCollection,
		id: string
	) => Promise<IConnection | null>;
}
export type IConnectionsCollection = RxCollection<
	IConnection,
	IConnectionMethods,
	IConnectionsCollectionMethods
>;

export const connectionDocumentMethods: IConnectionMethods = {};
export const connectionCollectionMethods: IConnectionsCollectionMethods = {
	getConnectionsIds$: function () {
		return this.find()
			.sort('-lastModified')
			.$.pipe(map((documents) => documents.map((doc) => doc.id)));
	},
	getConnection: function (id) {
		return this.findOne({ selector: { id } }).exec();
	},
	getConnection$: function (id) {
		return this.findOne({ selector: { id } }).$;
	},
	upsertConnection: async function (connectionData) {
		const connection = await this.upsert({
			...connectionData,
			id: (connectionData as IConnection).id || generateShortId(),
			lastModified: new Date().getTime(),
		});
		return connection;
	},
	deleteConnection: function (id) {
		return this.findOne({ selector: { id } }).remove();
	},
};

const schema: RxJsonSchema<IConnection> = {
	version: SCHEMA_VERSION,
	type: 'object',
	required: ['id', 'name', 'lastModified', 'clientOptions'],
	indexes: ['lastModified'],
	properties: {
		id: {
			...STRING_TYPE,
			primary: true,
		} as PrimaryProperty,
		name: STRING_TYPE,
		lastModified: INTEGER_TYPE,
		paused: {
			...BOOLEAN_TYPE,
			default: false,
		},
		clientOptions: {
			type: 'object',
			required: [
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
				username: NULLABLE_STRING_TYPE,
				password: NULLABLE_STRING_TYPE,
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
				},
				sslTls: {
					type: 'object',
					required: ['useSSL'],
					properties: {
						useSSL: BOOLEAN_TYPE,
						certSign: {
							enum: ['serverSigned', 'selfSigned'],
						},
						ca: STRING_TYPE,
						cert: STRING_TYPE,
						key: STRING_TYPE,
						rejectUnauthorized: BOOLEAN_TYPE,
					},
				},
			},
		},
		// variables: {
		// 	type: 'array',
		// 	items: {
		// 		type: 'object',
		// 		required: ['key', 'value'],
		// 		properties: {
		// 			key: STRING_TYPE,
		// 			value: STRING_TYPE,
		// 		},
		// 	},
		// },
	},
};
export default schema;
