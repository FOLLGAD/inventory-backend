import { Router } from 'express';
import { verifyToken } from '../middleware';

import { User } from '../models';

let router = new Router();

router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/', (req, res) => {
		let users = User
			.find()
			.exec()
			.then(users => {
				res.json(users);
			});
	})

export default router;