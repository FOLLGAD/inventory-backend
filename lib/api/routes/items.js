'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _middleware = require('../middleware');

var _models = require('../models');

var router = new _express.Router();
router.use(_middleware.verifyToken) // Require user to send a valid token in order to proceed
.get('/', function (req, res) {
    var dbQuery = _models.Item.find();

    if (req.query.populate != undefined) {
        dbQuery.populate('container', 'name').populate('itemType');
    }

    dbQuery.exec().then(function (items) {
        if (req.query.populate != undefined) {
            var toJson = items.map(function (d) {
                return d.toJSON();
            });
            return res.json(toJson.map(function (item) {
                if (!item.itemType) return;
                var typeProps = item.itemType.propertyTypes;
                item.properties = item.properties.map(function (prop) {
                    var newType = typeProps.find(function (p) {
                        return p._id.equals(prop.propertyType);
                    });
                    prop.propertyType = newType;
                    return prop;
                });
                return item;
            }));
        }
        res.json(items);
    }).catch(function (d) {
        return res.sendStatus(500), console.error(d);
    });
}).get('/:id', function (req, res) {
    var dbQuery = _models.Item.findById(req.params.id);

    if (req.query.populate != undefined) {
        dbQuery.populate('container', 'name').populate('itemType');
    }

    dbQuery.exec().then(function (item) {
        if (req.query.populate != undefined) {
            item.name = item.itemType.name;

            var typeProps = item.itemType.properties;

            item.properties = item.properties.map(function (prop) {
                var newType = typeProps.find(function (p) {
                    return p._id.equals(prop.type);
                });
                prop.type = newType;
                return prop;
            });

            res.json(item);
            return;
        }
        res.json(item);
    }).catch(function (d) {
        return res.sendStatus(500);
    });
}).get('/:id/is-borrowed', function (req, res) {
    var now = Date.now();
    var isBorrowedQuery = _models.Borrow.findOne({
        item: req.params.id,
        returned: { $exists: true },
        to: { $gte: now },
        from: { $lte: now }
    }).populate('user').exec().then(function (borrow) {
        if (borrow) {
            res.status(200).json(borrow);
        } else {
            res.status(204).json();
        }
    }).catch(function (error) {
        res.status(500).send();
    });
}).post('/:id/borrow', function (req, res) {
    var now = Date.now();
    var isBorrowedQuery = _models.Borrow.findOne({
        item: req.params.id,
        returned: { $exists: true },
        to: { $gte: now },
        from: { $lte: now }
    }).exec().then(function (item) {
        if (item) {
            res.status(400).send('Item is already borrowed1');
        } else {
            return false;
        }
    }).catch(function (error) {
        res.status(500).json(error);
    });
    var itemExistsQuery = _models.Item.findById(req.params.id).exec().then(function (item) {
        var timestamp = Date.parse(req.body.to);
        if (isNaN(timestamp)) {
            // Check whether req.body.to is a valid date or not
            res.status(400).send('Invalid "to" date');
            return;
        }

        var toDate = new Date(timestamp),
            now = new Date();

        if (toDate < now) {
            res.status(400).send('ToDate can not be in the past');
            return;
        }

        var isBorrowed = item.borrows && item.borrows.some && item.borrows.some(function (b) {
            return !b.returned && b.to > now && b.from < now;
        });

        if (!isBorrowed) {
            _models.Item.findByIdAndUpdate(req.params.id, { $push: { borrows: { to: toDate, from: now, user: req.user } } }, function (err, docs) {
                if (err || !docs) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                res.sendStatus(200);
            });
        } else {
            res.status(400).send('Item is already borrowed3');
        }
    }).catch(function (d) {
        console.log(d);
        res.sendStatus(500);
    });
}).get('/:id/return', function (req, res) {
    var now = new Date();
    _models.Item.findByIdAndUpdate(req.params.id,

    // Finds array where "returned" property equals null, and where "user" property is the user id,
    // then sets the "returned" field to the current date
    { $set: { 'borrows.$[currentborrower].returned': now } }, { arrayFilters: [{ 'currentborrower.returned': null, 'currentborrower.user': req.user._id }] }, function (err, docs) {
        if (err || !docs) return console.log(err), res.sendStatus(500);
        res.send(200);
    });
}).post('/', function (req, res) {
    console.log(req.body);
    if (!req.body.code) req.body.code = (Math.random() * 10000000000).toFixed(0).toString(); //Remove later plox
    _models.Item.create(req.body, function (err, item) {
        if (err) return res.status(400).send(err);
        res.json(item);
    });
}).delete('/:id', function (req, res) {
    _models.Item.findByIdAndRemove(req.params.id, function (err, item) {
        if (item) {
            res.json(item);
        } else {
            res.sendStatus(404);
        }
    });
});

exports.default = router;