import { Router } from 'express';
import { verifyToken } from '../middleware';

import { User } from '../models';

let router = new Router();

router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/', (req, res) => {
		User
			.findById(req.user._id)
			.exec()
			.then(user => {
				res.json(user);
			});
	})
	.post('/', (req, res) => {
		let body = {};
		['name', 'phone'].forEach(key => {
			if (req.body[key])
				body[key] = req.body[key];
		});
		User
			.findByIdAndUpdate(req.user._id, body, (err, info) => {
				res.status(200).send("User updated");
			});
	})

export default router;