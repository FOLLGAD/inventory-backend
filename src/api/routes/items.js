import { Router } from 'express';
import { verifyToken } from '../middleware';

import { Item, ItemType } from '../models';

let router = new Router();
router
    .use(verifyToken) // Require user to send a valid token in order to proceed
    .get('/', (req, res) => {
        let items = Item
            .find()
            .exec()
            .then(items => {
                res.json(items);
            });
    })
    .post('/', (req, res) => {
        let item = Item
            .create(req.body, (err, item) => {
                res.json(item);
            });
    })

export default router;