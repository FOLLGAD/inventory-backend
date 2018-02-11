import express from 'express';

import { connect as dbConnect } from './db';
import initApi from './api';
import { port } from '../config.json';
import bodyParser from 'body-parser';

/* DATABASE */

const url = 'mongodb://localhost:27017';
const dbName = 'inventory-abb';

function loop() {
	let expressPromise = new Promise((res, rej) => {
		const app = express();
		app.use(bodyParser.json())
		initApi(app);
		res(app);
	});

	let mongoPromise = dbConnect(url);

	Promise
		.all([expressPromise, mongoPromise])
		.then(([app, db]) => {
			app.listen(port, () => console.log('OPEN at port', port));
		})
		.catch(console.error);
}

loop();