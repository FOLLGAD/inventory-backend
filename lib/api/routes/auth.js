'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _middleware = require('../middleware');

var router = new _express.Router();

router
/*
    Accepts a request with a "Basic" Authorization header using the sharepoint email/username and password.
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme
*/
.get('/', function (req, res) {
    var _basicToCredentials = (0, _middleware.basicToCredentials)(req.headers.authorization),
        username = _basicToCredentials.username,
        password = _basicToCredentials.password;

    (0, _middleware.getToken)(username, password).then(function (token) {
        res.status(200).json({ token: token });
    }).catch(function (err) {
        res.status(err.status || 400).json({ errors: [err] });
    });
});

exports.default = router;