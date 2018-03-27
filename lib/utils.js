'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.basicToCredentials = basicToCredentials;
exports.btoa = btoa;
exports.atob = atob;
// function make_base_auth(user, password) {
//     var tok = user + ':' + password;
//     var hash = Base64.encode(tok);
//     return 'Basic " + hash;
// }

function basicToCredentials(basicAuthString) {
    var base64String = basicAuthString.replace('Basic ', '');
    var decoded = atob(base64String);

    var _decoded$split = decoded.split(':'),
        _decoded$split2 = _slicedToArray(_decoded$split, 2),
        username = _decoded$split2[0],
        password = _decoded$split2[1];

    return { username: username, password: password };
}

// Implementation of the btoa() function in js
function btoa(str) {
    return Buffer(str, 'binary').toString('base64');
}

// Implementation of the atob() function in js
function atob(str) {
    return new Buffer(str, 'base64').toString('binary');
}

// Acceptable ObjectTypes with names
var ObjectTypes = exports.ObjectTypes = {
    'Number': Number,
    'String': String,
    'Date': Date,
    'Boolean': Boolean,
    'Link': String
};