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
                item.name = item.itemType.name;
                var typeProps = item.itemType.properties;

                item.properties = item.properties.map(function (prop) {
                    var newType = typeProps.find(function (p) {
                        return p._id.equals(prop.type);
                    });
                    prop.type = newType;
                    return prop;
                });
                return item;
            }));
        }
        res.json(items);
    }).catch(function (d) {
        return res.sendStatus(500);
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
}).post('/:id/borrow', function (req, res) {
    _models.Item.findById(req.params.id).exec().then(function (item) {
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

        var isBorrowed = item.borrows.some(function (b) {
            return !b.returned && b.to > now && b.from < now;
        });

        if (!isBorrowed) {
            _models.Item.findByIdAndUpdate(req.params.id, { $push: { borrows: { to: toDate, from: now, user: req.user } } }, function (err, docs) {
                if (err || !docs) return res.sendStatus(500);
                res.sendStatus(200);
            });
        } else {
            res.status(400).send('Item is already borrowed');
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
}).get('/:id/return', function (req, res) {
    _models.Item.findById(req.params.id).exec().then(function (item) {
        res.json(item);
        console.log(item);
    }).catch(function (d) {
        return res.sendStatus(500);
    });
}).post('/', function (req, res) {
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