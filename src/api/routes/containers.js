import { Router } from 'express';
import { verifyToken } from '../middleware';

import { Container } from '../models';

let router = new Router();

router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/', (req, res) => {
		let containers = Container
			.find()
			.exec()
			.then(containers => {
				res.json(containers);
			});
	})
	.post('/', (req, res) => {
		let container = Container
			.insertOne(req.body)
			.then(d => {
				let container = d.ops[0]; // Returns the newly inserted document

				res.json(container);
			})
			.catch(err => {
				res.status(400).send();
			});
	})

export default router;