'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import items from './items';
// import containers from './containers';
// import users from './users';

exports.default = function (app) {
    app.use('/api/v1/auth', _auth2.default);
};