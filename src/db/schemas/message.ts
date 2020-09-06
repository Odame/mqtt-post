import {
	STRING_TYPE,
	QOS_TYPE,
	BOOLEAN_TYPE,
	POSITIVE_INTEGER_TYPE,
	INTEGER_TYPE,
} from '../types';
import { RxDocument, RxCollection, RxJsonSchema, PrimaryProperty } from 'rxdb';

const SCHEMA_VERSION = 0;
interface IMessage {
	id: string;
	connectionId: string;
	direction: 'in' | 'out';
	payload?: string;
	topic: string;
	qos: 0 | 1 | 2;
	dup: boolean;
	retain: boolean;
	messageId?: number;
	properties?: {
		payloadFormatIndicator?: boolean;
		messageExpiryInterval?: number;
		topicAlias?: number;
		responseTopic?: string;
		userProperties?: Record<string, any>;
		subscriptionIdentifier?: number | Array<number>;
		contentType?: string;
	};
}
interface IMessageMethods {}
// export type IMessageDocument = RxDocument<IMessage, IMessageMethods>;

interface IMessagesCollectionMethods {}
export type IMessagesCollection = RxCollection<
	IMessage,
	IMessageMethods,
	IMessagesCollectionMethods
>;

const schema: RxJsonSchema<IMessage> = {
	version: SCHEMA_VERSION,
	type: 'object',
	required: [
		'id',
		'connectionId',
		'direction',
		'topic',
		'qos',
		'dup',
		'retain',
	],
	// indexes: [
	// 	['connectionId', 'topic'],
	// 	['connectionId', 'direction'],
	// ],
	properties: {
		id: {
			...STRING_TYPE,
			primary: true,
		} as PrimaryProperty,
		// id of the mqtt connection via which this message was sent or received
		connectionId: STRING_TYPE,
		direction: {
			enum: ['in', 'out'], // received message or sent message, respectively
		},
		payload: STRING_TYPE,
		topic: STRING_TYPE,
		qos: QOS_TYPE,
		dup: BOOLEAN_TYPE,
		retain: BOOLEAN_TYPE,
		messageId: POSITIVE_INTEGER_TYPE,
		// optional properties MQTT 5.0
		properties: {
			type: 'object',
			properties: {
				payloadFormatIndicator: BOOLEAN_TYPE,
				messageExpiryInterval: POSITIVE_INTEGER_TYPE,
				topicAlias: INTEGER_TYPE,
				responseTopic: STRING_TYPE,
				userProperties: {
					type: 'object',
					additionalProperties: true,
				}, // a stringified object, containing arbitrary key-value pairs
				subscriptionIdentifier: { type: 'array', items: INTEGER_TYPE },
				contentType: STRING_TYPE,
			},
		},
	},
};
export default schema;
