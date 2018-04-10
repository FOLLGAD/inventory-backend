import { Router } from 'express';
import { verifyToken } from '../middleware';
import { ItemType } from '../models';

let errorHandle = (req, res, cb) => (err, doc) => err ? res.send(500) : (doc ? cb(doc) : res.send(404));

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
				console.log(err);
				if (err) return res.sendStatus(500);
				res.json(itemType);
			});
	})
	.delete('/:id', (req, res) => {
		ItemType
			.findByIdAndRemove(req.params.id, (err, itemType) => {
				if (err || !itemType) return res.sendStatus(404);
				res.json(itemType);
			});
	})
    .patch('/:id', (req, res) => {
        ItemType
            .findByIdAndUpdate(req.params.id, req.body, (err, itemType) => {
                if (!itemType || err) return res.sendStatus(404);

                res.status(200).send(itemType)
            })
    })

export default router;