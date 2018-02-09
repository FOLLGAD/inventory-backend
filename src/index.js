import { MongoClient } from 'mongodb';
import express from 'express';

/* DATABASE */

const url = 'mongodb://localhost:27017';
const dbName = 'inventory-abb';

import initApi from './api';

function loop() {
	MongoClient.connect(url).then((client, err) => {
		const db = client.db(dbName);
		const app = express();

		initApi(app);

		app.listen(3000, () => console.log('OPEN'));
	})
}

loop();