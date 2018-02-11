import { MongoClient } from 'mongodb';

import { dbName } from '../config.json';

let dataBase = null;

export function connect(url) {
	return new Promise((res, rej) => {
		if (dataBase) return res();

		MongoClient.connect(url)
			.then((db, err) => {
				dataBase = db;
				res(db);
			});
	});
}

export function get() {
	return dataBase.db(dbName);
}

export function collection(collection) {
	return dataBase.db(dbName).collection(collection);
}

export function close() {
	return new Promise((res, rej) => {
		if (dataBase) {
			dataBase.close()
		}
	});
}