'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.basicToCredentials = basicToCredentials;
exports.verifyToken = verifyToken;
exports.getToken = getToken;

var _nodeSpAuth = require('node-sp-auth');

var spauth = _interopRequireWildcard(_nodeSpAuth);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _db = require('../db');

var db = _interopRequireWildcard(_db);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _require = require('../../config.json'),
    sharepointUrl = _require.sharepointUrl,
    tokenSecret = _require.tokenSecret;

// function make_base_auth(user, password) {
//     var tok = user + ':' + password;
//     var hash = Base64.encode(tok);
//     return 'Basic " + hash;
// }

function basicToCredentials(basicAuthString) {
    var base64String = basicAuthString.replace('Basic ', '');
    var decoded = (0, _utils.atob)(base64String);

    var _decoded$split = decoded.split(':'),
        _decoded$split2 = _slicedToArray(_decoded$split, 2),
        username = _decoded$split2[0],
        password = _decoded$split2[1];

    return { username: username, password: password };
}

function verifyToken(req, res, next) {
    if (!req.headers.token) res.status(401).send('TOKEN REQUIRED');
    try {
        var user = _jsonwebtoken2.default.verify(req.headers.token, tokenSecret);
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send('BAD TOKEN');
    }
}

function getToken(username, password) {
    return new Promise(function (res, rej) {
        if (typeof username != 'string' || typeof password != 'string') rej('Username and password needed');

        // spauth.getAuth() returns a cookie, which can then be used to auth further requests.
        spauth.getAuth(sharepointUrl, {
            username: username,
            password: password
        }).then(function (options) {
            // Auth successful

            db.collection('users').findOne({ email: username }).then(function (user) {
                if (user) {
                    res(_jsonwebtoken2.default.sign(username, tokenSecret));
                } else {
                    db.collection('users').insertOne({ email: username, lastActive: new Date(), registered: new Date(), cookie: options.headers.Cookie }).then(function (te) {
                        res(_jsonwebtoken2.default.sign(username, tokenSecret));
                    });
                }
            });
        }).catch(function (err) {
            // Auth failed
            console.log(err);

            rej(err);
        });
    });
}