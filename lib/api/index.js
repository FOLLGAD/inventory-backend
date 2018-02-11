'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _items = require('./items');

var _items2 = _interopRequireDefault(_items);

var _containers = require('./containers');

var _containers2 = _interopRequireDefault(_containers);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    app.use('/api/v1/auth', _auth2.default);
    app.use('/api/v1/items', _items2.default);
    app.use('/api/v1/users', _users2.default);
    app.use('/api/v1/containers', _containers2.default);
};