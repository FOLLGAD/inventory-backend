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
	.delete('/:id', (req, res) => {
		Container
			.findByIdAndRemove(req.params.id, (err, container) => {
				if (err || !container) return res.sendStatus(404);
				res.json(container);
			});
	})
    .patch('/:id', (req, res) => {
        Container
            .findByIdAndUpdate(req.params.id, req.body, (err, container) => {
                if (!container || err) return res.sendStatus(404);

                res.status(200).send(container)
            })
    })

export default router;