import { Router } from 'express';
import { verifyToken } from '../middleware';

import { ItemType } from '../models';
import { Schema, Types } from 'mongoose';

let router = new Router();
router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/', (req, res) => {
		let items = ItemType
			.find()
			.exec()
			.then(items => {
				res.json(items.map(d => d.toJSON()));
			});
	})
	.get('/:id', (req, res) => {
		let items = ItemType
			.findOne({ _id: req.params.id })
			.exec()
			.then(item => {
				res.json(item.toJSON());
			});
	})
	.post('/', (req, res) => {
		let item = ItemType
			.create(req.body, (err, item) => {
				res.json(item);
			});
	})

export default router;