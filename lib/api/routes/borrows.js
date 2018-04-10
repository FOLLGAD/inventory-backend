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
	_models.Borrow.find().exec().then(function (containers) {
		res.json(containers);
	});
}).get('/:id', function (req, res) {
	_models.Borrow.findById(req.params.id).exec().then(function (container) {
		res.json(container);
	});
});

exports.default = router;