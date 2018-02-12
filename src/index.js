import express from 'express';

import initApi from './api';
import { port } from '../config.json';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { dbName } from '../config.json';

/* DATABASE */

const mongoUrl = 'mongodb://localhost:27017';

function loop() {
	const app = express();
	app.use(bodyParser.json())
	app.use(morgan('tiny'));
	initApi(app);

	mongoose.connect(`${mongoUrl}/${dbName}`)
		.then(() => {
			app.listen(port, () => console.log('OPEN at port', port));
		})
}

loop();