'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _middleware = require('../middleware');

var _utils = require('../../utils');

var _models = require('../models');

var _nodeSpAuth = require('node-sp-auth');

var spauth = _interopRequireWildcard(_nodeSpAuth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

router
/*
    Accepts a request with a "Basic" Authorization header using the sharepoint email/username and password.
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme
*/
.get('/', function (req, res) {
    if (typeof req.headers.authorization != "string") {
        res.status(400).json({
            error: {
                code: "No token",
                message: "You need a Authorization header with 'Basic' authorization"
            }
        });
        return;
    }

    var _basicToCredentials = (0, _utils.basicToCredentials)(req.headers.authorization),
        username = _basicToCredentials.username,
        password = _basicToCredentials.password;

    (0, _middleware.getToken)(username, password).then(function (token) {
        _models.User.findOne({ email: username }).exec().then(function (d) {
            if (d._doc) {
                res.status(200).json(Object.assign({}, d._doc, { token: token }));
            } else {
                _models.User.create({ email: username });
                res.status(200).json({ token: token });
            }
        });
    }).catch(function (err) {
        res.status(401).send("Wrong credentials or failed to connect to auth service");
    });
}).get('/test', function (req, res) {
    var _basicToCredentials2 = (0, _utils.basicToCredentials)(req.headers.authorization),
        username = _basicToCredentials2.username,
        password = _basicToCredentials2.password;

    // authurl: https://abb.sharepoint.com/
    // basic auth

    spauth.getAuth(req.headers.authurl, {
        username: username,
        password: password
    }).then(function (resp) {
        console.log(resp);
        res.sendStatus(200);
    }).catch(function (resp) {
        console.log(resp);
        res.sendStatus(400);
    });
});

exports.default = router;