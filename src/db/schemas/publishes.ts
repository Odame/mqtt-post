import { RxDocument, RxCollection, RxJsonSchema, PrimaryProperty } from 'rxdb';
import { STRING_TYPE, QOS_TYPE, POSITIVE_INTEGER_TYPE } from '../types';
import { generate } from 'shortid';

const SCHEMA_VERSION = 0;

export interface ISavedPublish {
	id: string;
	connectionId: string;
	topic: string;
	qos: 0 | 1 | 2;
	timestamp: number;
	payload?: string;
}
interface ISavedPublishMethods {}
interface ISavedPublishCollectionMethods {
	getSavedPublishes: (connectionId: string) => Promise<ISavedPublishDocument[]>;
	searchSavedPublishes: (
		connectionId: string,
		topic: RegExp
	) => Promise<ISavedPublishDocument[]>;
	addSavedPublish: (
		data: Omit<ISavedPublish, 'id'>
	) => Promise<ISavedPublishDocument>;
	deleteSavedPublish: (id: string) => Promise<ISavedPublishDocument | null>;
}

type ISavedPublishDocument = RxDocument<ISavedPublish, ISavedPublishMethods>;
export type ISavedPublishCollection = RxCollection<
	ISavedPublish,
	ISavedPublishMethods,
	ISavedPublishCollectionMethods
>;

export const savedPublishCollectionMethods: ISavedPublishCollectionMethods = {
	getSavedPublishes: function (this: ISavedPublishCollection, connectionId) {
		return this.find({
			selector: {
				connectionId,
			},
			sort: [{ timestamp: 'desc' }],
		}).exec();
	},
	searchSavedPublishes: function (
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
	addSavedPublish: async function (this: ISavedPublishCollection, data) {
		return this.insert({ ...data, id: generate() });
	},
	deleteSavedPublish: async function (this: ISavedPublishCollection, id) {
		return this.findOne({ selector: { id } }).remove();
	},
};

const SavedPublishSchema: RxJsonSchema<ISavedPublish> = {
	version: SCHEMA_VERSION,
	title: 'SavedPublish',
	description: 'Publishes saved by the user',
	type: 'object',
	required: ['id', 'qos', 'timestamp', 'topic'],
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
		payload: STRING_TYPE,
	},
};

export default SavedPublishSchema;
