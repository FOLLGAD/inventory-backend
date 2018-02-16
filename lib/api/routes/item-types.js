'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _middleware = require('../middleware');

var _models = require('../models');

var errorHandle = function errorHandle(req, res, cb) {
	return function (err, doc) {
		return err ? res.send(500) : doc ? cb(doc) : res.send(404);
	};
};

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
		console.log(err);
		if (err) return res.sendStatus(500);
		res.json(itemType);
	});
}).delete('/:id', function (req, res) {
	_models.ItemType.findByIdAndRemove(req.params.id, function (err, itemType) {
		if (err || !itemType) return res.sendStatus(404);
		res.json(itemType);
	});
});

exports.default = router;