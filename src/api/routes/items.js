import { Router } from 'express';
import { verifyToken } from '../middleware';
import { Item, ItemType, Borrow } from '../models';

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
                        if (!item.itemType) return;
                        let typeProps = item.itemType.propertyTypes;
                        item.properties = item.properties.map(prop => {
                            let newType = typeProps.find(p => p._id.equals(prop.propertyType));
                            prop.propertyType = newType;
                            return prop;
                        });
                        return item;
                    }))
                }
                res.json(items);
            })
            .catch(d => (res.sendStatus(500), console.error(d)));
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
            .catch(d => res.sendStatus(500));
    })
    .get('/:id/is-borrowed', (req, res) => {
        let now = Date.now()
        let isBorrowedQuery = Borrow
            .findOne({
                item: req.params.id,
                returned: { $exists: true },
                to: { $gte: now },
                from: { $lte: now },
            })
            .populate('user')
            .exec()
            .then(borrow => {
                if (borrow) {
                    res.status(200).json(borrow);
                } else {
                    res.status(204).json()
                }
            })
            .catch(error => {
                res.status(500).send();
            })
    })
    .post('/:id/borrow', (req, res) => {
        let now = Date.now()
        let isBorrowedQuery = Borrow
            .findOne({
                item: req.params.id,
                returned: { $exists: true },
                to: { $gte: now },
                from: { $lte: now },
            })
            .exec()
            .then(item => {
                if (item) {
                    res.status(400).send('Item is already borrowed1');
                } else {
                    return false;
                }
            })
            .catch(error => {
                res.status(500).json(error);
            })
        let itemExistsQuery = Item
            .findById(req.params.id)
            .exec()
            .then(item => {
                let timestamp = Date.parse(req.body.to);
                if (isNaN(timestamp)) { // Check whether req.body.to is a valid date or not
                    res.status(400).send('Invalid "to" date');
                    return;
                }

                let toDate = new Date(timestamp),
                    now = new Date();

                if (toDate < now) {
                    res.status(400).send('ToDate can not be in the past');
                    return;
                }

                let isBorrowed = item.borrows && item.borrows.some && item.borrows.some(b => !b.returned && b.to > now && b.from < now);

                if (!isBorrowed) {
                    Item
                        .findByIdAndUpdate(req.params.id, { $push: { borrows: { to: toDate, from: now, user: req.user } } }, (err, docs) => {
                            if (err || !docs) {
                                console.error(err)
                                return res.sendStatus(500);
                            }
                            res.sendStatus(200);
                        });
                } else {
                    res.status(400).send('Item is already borrowed3');
                }
            })
            .catch(d => {
                console.log(d)
                res.sendStatus(500)
            });
    })
    .get('/:id/return', (req, res) => {
        let now = new Date();
        Item
            .findByIdAndUpdate(req.params.id,

                // Finds array where "returned" property equals null, and where "user" property is the user id,
                // then sets the "returned" field to the current date
                { $set: { 'borrows.$[currentborrower].returned': now } },
                { arrayFilters: [{ 'currentborrower.returned': null, 'currentborrower.user': req.user._id }] },

                (err, docs) => {
                    if (err || !docs) return (console.log(err), res.sendStatus(500));
                    res.send(200);
                });
    })
    .post('/', (req, res) => {
        console.log(req.body)
        if (!req.body.code) req.body.code = (Math.random() * 10000000000).toFixed(0).toString() //Remove later plox
        Item
            .create(req.body, (err, item) => {
                if (err) return res.status(400).send(err);
                res.json(item);
            });
    })
    .delete('/:id', (req, res) => {
        Item
            .findByIdAndRemove(req.params.id, (err, item) => {
                if (item) {
                    res.json(item);
                } else {
                    res.sendStatus(404);
                }
            })
    })

export default router;