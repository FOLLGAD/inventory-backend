'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _middleware = require('./middleware');

var _db = require('../db');

var db = _interopRequireWildcard(_db);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

router.use(_middleware.verifyToken) // Require user to send a valid token in order to proceed
.get('/', function (req, res) {
	var containers = db.get().collection('containers').find().toArray().then(function (containers) {
		res.json(containers);
	});
}).post('/', function (req, res) {
	var container = db.get().collection('containers').insertOne(req.body).then(function (d) {
		var container = d.ops[0]; // Returns the newly inserted document

		res.json(container);
	}).catch(function (err) {
		res.status(400).send();
	});
});

exports.default = router;