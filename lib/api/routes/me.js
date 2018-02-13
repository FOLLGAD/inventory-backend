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
	_models.User.findById(req.user._id).exec().then(function (user) {
		res.json(user);
	});
}).post('/', function (req, res) {
	var body = {};
	['name', 'phone'].forEach(function (key) {
		if (req.body[key]) body[key] = req.body[key];
	});
	_models.User.findByIdAndUpdate(req.user._id, body, function (err, info) {
		res.status(200).send("User updated");
	});
});

exports.default = router;