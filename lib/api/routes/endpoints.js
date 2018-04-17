'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _middleware = require('../middleware');

var _models = require('../models');

var _consts = require('../../consts');

var router = new _express.Router();

router.get('/auth-url', function (req, res) {
	res.json({ authUrl: _consts.sharepointUrl });
});

exports.default = router;