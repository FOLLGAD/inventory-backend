import { Router } from 'express';
import { verifyToken } from './middleware';

import * as db from '../db';

import { ObjectID } from 'mongodb';

let router = new Router();

export const itemSchema = {
    container: ObjectID,
    
}

router
    .use(verifyToken) // Require user to send a valid token in order to proceed
    .get('/', (req, res) => {
        let items = db.get()
            .collection('items')
            .find()
            .toArray()
            .then(items => {
                res.json(items);
            });
    })
    .post('/', (req, res) => {
        let item = db.get()
            .collection('items')
            .insertOne(req.body)
            .then(d => {
                let item = d.ops[0]; // Returns the newly inserted document

                res.json(item);
            })
            .catch(err => {
                res.status(400).send();
            });
    })

export default router;