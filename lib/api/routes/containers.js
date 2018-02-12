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
	var containers = _models.Container.find().exec().then(function (containers) {
		res.json(containers);
	});
}).post('/', function (req, res) {
	var container = _models.Container.insertOne(req.body).then(function (d) {
		var container = d.ops[0]; // Returns the newly inserted document

		res.json(container);
	}).catch(function (err) {
		res.status(400).send();
	});
});

exports.default = router;