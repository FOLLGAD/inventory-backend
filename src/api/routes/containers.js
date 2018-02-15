import { Router } from 'express';
import { verifyToken } from '../middleware';
import { Container } from '../models';

let router = new Router();

router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/', (req, res) => {
		Container
			.find()
			.exec()
			.then(containers => {
				res.json(containers);
			});
	})
	.get('/:id', (req, res) => {
		Container
			.findById(req.params.id)
			.exec()
			.then(container => {
				res.json(container);
			});
	})
	.post('/', (req, res) => {
		Container
			.create(req.body)
			.then(container => {
				res.json(container);
			})
			.catch(err => {
				res.status(400).send();
			});
	})

export default router;