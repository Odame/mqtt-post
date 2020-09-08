import { RxDocument, RxCollection, RxJsonSchema, PrimaryProperty } from 'rxdb';
import { STRING_TYPE, QOS_TYPE, POSITIVE_INTEGER_TYPE } from '../types';
import { ISavedPublishCollection } from './publishes';
import { generate } from 'shortid';

const SCHEMA_VERSION = 0;

export interface ISavedSubscription {
	id: string;
	connectionId: string;
	topic: string;
	qos: 0 | 1 | 2;
	timestamp: number;
}

interface ISavedSubscriptionMethods {}
type ISavedSubscriptionDocument = RxDocument<
	ISavedSubscription,
	ISavedSubscriptionMethods
>;

interface ISavedSubscriptionCollectionMethods {
	getSavedSubscriptions: (
		connectionId: string
	) => Promise<ISavedSubscriptionDocument[]>;
	searchSavedSubscriptions: (
		connectionId: string,
		topic: RegExp
	) => Promise<ISavedSubscriptionDocument[]>;
	addSavedSubscription: (
		data: Omit<ISavedSubscription, 'id'>
	) => Promise<ISavedSubscriptionDocument>;
	deleteSavedSubscription: (
		id: string
	) => Promise<ISavedSubscriptionDocument | null>;
}

export type ISavedSubscriptionCollection = RxCollection<
	ISavedSubscription,
	ISavedSubscriptionMethods,
	ISavedSubscriptionCollectionMethods
>;

export const savedSubscriptionCollectionMethods: ISavedSubscriptionCollectionMethods = {
	getSavedSubscriptions: function (
		this: ISavedPublishCollection,
		connectionId
	) {
		return this.find({
			selector: {
				connectionId,
			},
			sort: [{ timestamp: 'desc' }],
		}).exec();
	},
	searchSavedSubscriptions: function (
		this: ISavedPublishCollection,
		connectionId,
		topic
	) {
		return this.find({
			selector: {
				$and: [{ connectionId }, { $regex: { topic } }],
			},
			sort: [{ timestamp: 'desc' }],
		}).exec();
	},
	addSavedSubscription: function (this: ISavedPublishCollection, data) {
		return this.insert({ ...data, id: generate() });
	},
	deleteSavedSubscription: function (this: ISavedPublishCollection, id) {
		return this.findOne({ selector: { id } }).remove();
	},
};

const SavedSubscriptionSchema: RxJsonSchema<ISavedSubscription> = {
	version: SCHEMA_VERSION,
	title: 'SavedSubscription',
	description: 'Subscriptions saved by the user',
	type: 'object',
	required: ['id', 'connectionId', 'qos', 'timestamp', 'topic'],
	indexes: [
		['connectionId', '-timestamp'],
		['connectionId', 'topic', '-timestamp'],
	],
	properties: {
		id: {
			...STRING_TYPE,
			primary: true,
		} as PrimaryProperty,
		connectionId: STRING_TYPE,
		topic: STRING_TYPE,
		qos: QOS_TYPE,
		timestamp: POSITIVE_INTEGER_TYPE,
	},
};

export default SavedSubscriptionSchema;
