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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _require = require('../../config.json'),
    sharepointUrl = _require.sharepointUrl,
    tokenSecret = _require.tokenSecret;

// function make_base_auth(user, password) {
//     var tok = user + ':' + password;
//     var hash = Base64.encode(tok);
//     return "Basic " + hash;
// }

function btoa(str) {
    return Buffer(str, 'binary').toString('base64');
}
function atob(str) {
    return new Buffer(str, 'base64').toString('binary');
}

function basicToCredentials(basicAuthString) {
    var base64String = basicAuthString.replace('Basic ', '');
    var decoded = atob(base64String);

    var _decoded$split = decoded.split(':'),
        _decoded$split2 = _slicedToArray(_decoded$split, 2),
        username = _decoded$split2[0],
        password = _decoded$split2[1];

    return { username: username, password: password };
}

function verifyToken(req, res, next) {
    try {
        var user = _jsonwebtoken2.default.verify(req.header.token, tokenSecret);
        req.user = user;
        return user;
    } catch (err) {
        return err;
    }
}

function getToken(username, password) {
    return new Promise(function (res, rej) {
        if (typeof username != 'string' || typeof password != 'string') rej('Username and password needed');

        spauth.getAuth('https://abb.sharepoint.com/sites/CombiX/LabInventory/', {
            username: username,
            password: password
        }).then(function (options) {
            var headers = options.headers;
            headers['Accept'] = 'application/json;odata=verbose';

            (0, _axios2.default)(sharepointUrl + '/_api/web', {
                headers: headers
            }).then(function (response) {
                response.status == 200 ? res(_jsonwebtoken2.default.sign(username, tokenSecret)) : rej(response.status);
            });
        });
    });
}