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
	_models.Container.find().exec().then(function (containers) {
		res.json(containers);
	});
}).get('/:id', function (req, res) {
	_models.Container.findById(req.params.id).exec().then(function (container) {
		res.json(container);
	});
}).post('/', function (req, res) {
	_models.Container.create(req.body).then(function (container) {
		res.json(container);
	}).catch(function (err) {
		res.status(400).send();
	});
}).delete('/:id', function (req, res) {
	_models.Container.findByIdAndRemove(req.params.id, function (err, container) {
		if (err || !container) return res.sendStatus(404);
		res.json(container);
	});
}).patch('/:id', function (req, res) {
	_models.Container.findByIdAndUpdate(req.params.id, req.body, function (err, container) {
		if (!container || err) return res.sendStatus(404);

		res.status(200).send(container);
	});
});

exports.default = router;