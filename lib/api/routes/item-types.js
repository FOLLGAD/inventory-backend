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
	_models.ItemType.find().exec().then(function (itemTypes) {
		res.json(itemTypes.map(function (d) {
			return d.toJSON();
		}));
	});
}).get('/:id', function (req, res) {
	_models.ItemType.findById(req.params.id).exec().then(function (itemType) {
		res.json(itemType.toJSON());
	});
}).post('/', function (req, res) {
	_models.ItemType.create(req.body, function (err, itemType) {
		res.json(itemType);
	});
});

exports.default = router;