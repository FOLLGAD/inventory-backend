import { Router } from 'express';
import { verifyToken } from '../middleware';
import { Borrow } from '../models';

let router = new Router();

router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/', (req, res) => {
		Borrow
			.find()
			.exec()
			.then(containers => {
				res.json(containers);
			});
	})
	.get('/:id', (req, res) => {
		Borrow
			.findById(req.params.id)
			.exec()
			.then(container => {
				res.json(container);
			});
	})

export default router;