import { Router } from 'express';
import { verifyToken } from './middleware';

import * as db from '../db';

let router = new Router();

router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/', (req, res) => {
		let users = db.get()
			.collection('users')
			.find()
			.toArray()
			.then(users => {
				res.json(users);
			});
	})

export default router;