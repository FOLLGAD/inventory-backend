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
        return res.status(500);
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
        return res.status(500);
    });
}).get('/:id/borrow', function (req, res) {
    _models.Item.findById(req.params.id).exec().then(function (item) {
        res.json(item);
        console.log(item);
    }).catch(function (d) {
        return res.status(500);
    });
}).post('/', function (req, res) {
    _models.Item.create(req.body, function (err, item) {
        res.json(item);
    });
}).delete('/:id', function (req, res) {
    _models.Item.findByIdAndRemove(req.params.id, function (err, item) {
        if (item) {
            res.json(item);
        } else {
            res.send(404);
        }
    });
});

exports.default = router;