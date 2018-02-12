'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.verifyToken = verifyToken;
exports.getToken = getToken;

var _nodeSpAuth = require('node-sp-auth');

var spauth = _interopRequireWildcard(_nodeSpAuth);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _models = require('./models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _require = require('../../config.json'),
    sharepointUrl = _require.sharepointUrl,
    tokenSecret = _require.tokenSecret;

/*
    Checks the validity of the token in the "token" header, and sets the req.user property to the users' database entry.
*/


function verifyToken(req, res, next) {
    if (!req.headers.token) {
        res.status(401).send('TOKEN REQUIRED');
        return;
    }

    try {
        var email = _jsonwebtoken2.default.verify(req.headers.token, tokenSecret);

        _models.User.findOneAndUpdate({ email: email }, { lastActive: new Date() }, { upsert: true }, function (err, user) {
            if (user && !err) {
                req.user = user; // Set the req.user to the user object for easy access in the rest of the API
                next();
            } else {
                throw new Error('USER NOT FOUND');
            }
        });
    } catch (err) {
        res.status(400).send('BAD TOKEN');
    }
}

/*
    Takes username and password and returns a JWT token to be sent in the "token" header in subsequent requests.
*/
function getToken(username, password) {
    return new Promise(function (res, rej) {
        if (typeof username != 'string' || typeof password != 'string') {
            rej('Username and password needed');
            return;
        }
        // spauth.getAuth() returns a cookie, which can then be used to auth further Sharepoint-requests.
        spauth.getAuth(sharepointUrl, {
            username: username,
            password: password
        }).then(function (options) {
            // Auth successful
            _models.User.findOne({ email: username }).exec().then(function (user) {
                if (user) {
                    // If user already exists in database, just resolve the token without further actions
                    res(_jsonwebtoken2.default.sign(username, tokenSecret));
                } else {
                    // If user exists in database, register the email.
                    db.collection('users').insertOne({ email: username, lastActive: new Date(), registered: new Date() }).then(function (te) {
                        res(_jsonwebtoken2.default.sign(username, tokenSecret));
                    });
                }
            });
        }).catch(function (err) {
            // Auth failed
            rej(err);
        });
    });
}