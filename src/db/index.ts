import { createRxDatabase, RxDatabase, addRxPlugin } from 'rxdb';
import ConnectionSchema, { IConnectionsCollection } from './schemas/connection';
import MessageSchema, { IMessagesCollection } from './schemas/message';
import { generate } from 'shortid';

addRxPlugin(require('pouchdb-adapter-indexeddb'));

/** All the collections supported in the application database */
interface IDatabaseCollections {
	connections: IConnectionsCollection;
	messages: IMessagesCollection;
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
	});
	await database.collection({
		name: 'messages',
		schema: MessageSchema,
	});

	// Set the ids of the various documents automatically
	// 		https://rxdb.info/middleware.html
	database.collections.connections.preInsert((connection) => {
		connection.id = generate();
	}, true);
	database.collections.messages.preInsert((message) => {
		message.id = `${message.connectionId}-${generate()}`;
	}, true);

	return database;
};

/** Get the singleton database of this application.
 *
 * If the database has not been initialized already, it will be created.
 * Subsequent calls will just return the already created database
 */
export const getDatabase = async () => {
	if (!database) {
		console.warn(
			'The database instance has not been created yet.\n' +
				'It will be created now\n' +
				'Consider initializing database before calling this method'
		);
		await initDatabase();
	}
	return database!;
};
