import { Router } from 'express';
import { verifyToken } from '../middleware';

import { ItemType } from '../models';
import { Schema, Types } from 'mongoose';

let router = new Router();
router
	.use(verifyToken) // Require user to send a valid token in order to proceed
	.get('/', (req, res) => {
		ItemType
			.find()
			.exec()
			.then(itemTypes => {
				res.json(itemTypes.map(d => d.toJSON()));
			});
	})
	.get('/:id', (req, res) => {
		ItemType
			.findById(req.params.id)
			.exec()
			.then(itemType => {
				res.json(itemType.toJSON());
			});
	})
	.post('/', (req, res) => {
		ItemType
			.create(req.body, (err, itemType) => {
				res.json(itemType);
			});
	})

export default router;