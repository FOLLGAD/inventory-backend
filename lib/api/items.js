'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _middleware = require('./middleware');

var router = new _express.Router();

router.use(_middleware.verifyToken).get('/', function (req, res) {
    var _basicToCredentials = basicToCredentials(req.headers.authorization),
        username = _basicToCredentials.username,
        password = _basicToCredentials.password;

    getToken(username, password).then(function (token) {
        res.status(200).json({ token: token });
    }).catch(function (err) {
        res.status(err.status || 400).json({ errors: [err] });
    });
});

exports.default = router;