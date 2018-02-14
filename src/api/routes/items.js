import { Router } from 'express';
import { verifyToken } from '../middleware';

import { Item, ItemType } from '../models';

let router = new Router();
router
    .use(verifyToken) // Require user to send a valid token in order to proceed
    .get('/', (req, res) => {
        let dbQuery = Item
            .find();

        if (req.query.populate != undefined) {
            dbQuery
                .populate('container', 'name')
                .populate('itemType')
        }

        dbQuery
            .exec()
            .then(items => {
                if (req.query.populate != undefined) {
                    let toJson = items.map(d => d.toJSON());
                    return res.json(toJson.map(item => {
                        item.name = item.itemType.name;
                        let typeProps = item.itemType.properties;

                        item.properties = item.properties.map(prop => {
                            let newType = typeProps.find(p => p._id.equals(prop.type));
                            prop.type = newType;
                            return prop
                        });
                        return item;
                    }))
                }
                res.json(items);
            })
            .catch(d => res.status(500));
    })
    .get('/:id', (req, res) => {
        let dbQuery = Item
            .findById(req.params.id)

        if (req.query.populate != undefined) {
            dbQuery
                .populate('container', 'name')
                .populate('itemType')
        }

        dbQuery
            .exec()
            .then(item => {
                if (req.query.populate != undefined) {
                    item.name = item.itemType.name;

                    let typeProps = item.itemType.properties;

                    item.properties = item.properties.map(prop => {
                        let newType = typeProps.find(p => p._id.equals(prop.type));
                        prop.type = newType;
                        return prop
                    });

                    res.json(item);
                    return
                }
                res.json(item);
            })
            .catch(d => res.status(500));
    })
    .get('/:id/borrow', (req, res) => {
        Item
            .findById(req.params.id)
            .exec()
            .then(item => {
                res.json(item);
                console.log(item);
            })
            .catch(d => res.status(500));
    })
    .post('/', (req, res) => {
        Item
            .create(req.body, (err, item) => {
                res.json(item);
            })
    })
    .delete('/:id', (req, res) => {
        Item
            .findByIdAndRemove(req.params.id, (err, item) => {
                if (item) {
                    res.json(item);
                } else {
                    res.send(404);
                }
            })
    })

export default router;