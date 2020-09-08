import { createRxDatabase, RxDatabase, addRxPlugin } from 'rxdb';
import ConnectionSchema, {
	IConnectionsCollection,
	connectionCollectionMethods,
	connectionDocumentMethods,
} from './schemas/connection';
import MessageSchema, { IMessagesCollection } from './schemas/message';
import SavedSubscriptionSchema, {
	ISavedSubscriptionCollection,
	savedSubscriptionCollectionMethods,
} from './schemas/subscription';
import SavedPublishSchema, {
	savedPublishCollectionMethods,
	ISavedPublishCollection,
} from './schemas/publishes';

addRxPlugin(require('pouchdb-adapter-indexeddb'));

/** All the collections supported in the application database */
interface IDatabaseCollections {
	connections: IConnectionsCollection;
	messages: IMessagesCollection;
	savedSubscriptions: ISavedSubscriptionCollection;
	savedPublishes: ISavedPublishCollection;
}
let database: RxDatabase<IDatabaseCollections>;

export const initDatabase = async () => {
	database = await createRxDatabase<IDatabaseCollections>({
		name: 'mqtt_post',
		multiInstance: false,
		adapter: 'indexeddb',
	});
	// create the collections in the database
	await database.collection({
		name: 'connections',
		schema: ConnectionSchema,
		methods: { ...connectionDocumentMethods },
		statics: { ...connectionCollectionMethods },
	});
	await database.collection({
		name: 'messages',
		schema: MessageSchema,
		methods: {},
		statics: {},
	});
	await database.collection({
		name: 'savedSubscriptions',
		schema: SavedSubscriptionSchema,
		methods: {},
		statics: { ...savedSubscriptionCollectionMethods },
	});
	await database.collection({
		name: 'savedPublishes',
		schema: SavedPublishSchema,
		methods: {},
		statics: { ...savedPublishCollectionMethods },
	});

	return database;
};

/** Get the singleton database of this application.
 *
 * @throws If the database has not been initialized already.
 * The database can be initialized by calling `initDatabase()`
 */
export const getDatabase = () => {
	if (!database) {
		throw Error('The database instance has not been created yet.\n');
	}
	return database!;
};
