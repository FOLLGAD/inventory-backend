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
    var items = _models.Item.find().exec().then(function (items) {
        res.json(items);
    });
}).get('/:id', function (req, res) {
    _models.Item.findById(req.params.id).exec().then(function (item) {
        res.json(item);
    });
}).post('/', function (req, res) {
    var item = _models.Item.create(req.body, function (err, item) {
        res.json(item);
    });
});

exports.default = router;