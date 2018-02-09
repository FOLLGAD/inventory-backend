'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _middleware = require('./middleware');

var router = new _express.Router();
router.get('/', function (req, res) {
    var _basicToCredentials = (0, _middleware.basicToCredentials)(req.headers.authorization),
        username = _basicToCredentials.username,
        password = _basicToCredentials.password;

    (0, _middleware.getToken)(username, password).then(function (token) {
        console.log(token);
    }).catch(function (err) {
        console.error(err);
    });
});

exports.default = router;