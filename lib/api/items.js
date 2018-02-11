'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemSchema = undefined;

var _express = require('express');

var _middleware = require('./middleware');

var _db = require('../db');

var db = _interopRequireWildcard(_db);

var _mongodb = require('mongodb');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

var itemSchema = exports.itemSchema = {
    container: _mongodb.ObjectID

};

router.use(_middleware.verifyToken) // Require user to send a valid token in order to proceed
.get('/', function (req, res) {
    var items = db.get().collection('items').find().toArray().then(function (items) {
        res.json(items);
    });
}).post('/', function (req, res) {
    var item = db.get().collection('items').insertOne(req.body).then(function (d) {
        var item = d.ops[0]; // Returns the newly inserted document

        res.json(item);
    }).catch(function (err) {
        res.status(400).send();
    });
});

exports.default = router;