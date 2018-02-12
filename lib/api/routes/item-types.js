'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _middleware = require('../middleware');

var _models = require('../models');

var _mongoose = require('mongoose');

var router = new _express.Router();
router.use(_middleware.verifyToken) // Require user to send a valid token in order to proceed
.get('/', function (req, res) {
	var items = _models.ItemType.find().exec().then(function (items) {
		res.json(items.map(function (d) {
			return d.toJSON();
		}));
	});
}).get('/:id', function (req, res) {
	var items = _models.ItemType.findOne({ _id: req.params.id }).exec().then(function (item) {
		res.json(item.toJSON());
	});
}).post('/', function (req, res) {
	var item = _models.ItemType.create(req.body, function (err, item) {
		res.json(item);
	});
});

exports.default = router;