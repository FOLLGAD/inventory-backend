require('dotenv').config()
import express from 'express';

import initApi from './api';
import { port } from '../config.json';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { dbName } from '../config.json';

/* DATABASE */

const mongoUrl = process.env.DB_HOST || 'mongodb://localhost:27017';
const portToUse = process.env.PORT || port;
function loop() {
	const app = express();
	app.use(bodyParser.json())
	app.use(morgan('tiny'));
	initApi(app);

	mongoose.connect(`${mongoUrl}/${dbName}`)
		.then(() => {
			app.listen(portToUse, () => console.log('OPEN at port', portToUse));
		})
}

loop();