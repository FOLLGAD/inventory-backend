require('dotenv').config({ path: __dirname + '/../.env' });

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import initApi from './api';
import cors from 'cors';

/* DATABASE */

let mongoUrl = process.env.DB_HOST,
	dbName = process.env.DB_NAME,
	port = process.env.PORT;

if (!mongoUrl) console.error("You need a DB_HOST entry in .env")
if (!dbName) console.error("You need a DB_NAME entry in .env")
if (!port) console.error("You need a PORT entry in .env")

function loop() {
	const app = express();

	app.use(cors());
	app.use(bodyParser.json()); // Parse the body as JSON
	app.use(morgan('tiny')); // Initialize logger
	initApi(app);
	//Conect to the db
	mongoose.connect(`${mongoUrl}/${dbName}`)
		.then(() => {
			app.listen(port, () => console.log('OPEN at port', port));
		})
}

loop();