import { MongoClient } from 'mongodb';
import express from 'express';

import initApi from './api';
import { port } from '../config.json';

/* DATABASE */

const url = 'mongodb://localhost:27017';
const dbName = 'inventory-abb';

function loop() {
	let expressPromise = new Promise((res, rej) => {
		const app = express();
		initApi(app);
		res(app);
	})
	let mongoPromise = new Promise((res, rej) => {
		MongoClient.connect(url).then((client, err) => {
			const db = client.db(dbName);
			res(db);
		})
	})
	Promise
		.all([expressPromise, mongoPromise])
		.then(([app, db]) => {
			app.listen(port, () => console.log('OPEN at port', port));
			
		})
		.catch(console.error);
}

loop();