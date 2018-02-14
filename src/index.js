require('dotenv').config({ path: __dirname + '/../.env' });

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import initApi from './api';

/* DATABASE */

let mongoUrl = process.env.DB_HOST,
	dbName = process.env.DB_NAME,
	port = process.env.PORT;

function loop() {
	const app = express();

	app.use(bodyParser.json()); // Parse the body as JSON
	app.use(morgan('tiny')); // Initialize logger

	initApi(app);

	mongoose.connect(`${mongoUrl}/${dbName}`)
		.then(() => {
			app.listen(port, () => console.log('OPEN at port', port));
		})
}

loop();