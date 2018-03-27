'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _items = require('./routes/items');

var _items2 = _interopRequireDefault(_items);

var _containers = require('./routes/containers');

var _containers2 = _interopRequireDefault(_containers);

var _itemTypes = require('./routes/item-types');

var _itemTypes2 = _interopRequireDefault(_itemTypes);

var _users = require('./routes/users');

var _users2 = _interopRequireDefault(_users);

var _me = require('./routes/me');

var _me2 = _interopRequireDefault(_me);

var _borrows = require('./routes/borrows');

var _borrows2 = _interopRequireDefault(_borrows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    app.use('/v1/auth', _auth2.default);
    app.use('/v1/users', _users2.default);
    app.use('/v1/me', _me2.default);
    app.use('/v1/items', _items2.default);
    app.use('/v1/containers', _containers2.default);
    app.use('/v1/item-types', _itemTypes2.default);
    app.use('/v1/borrows', _borrows2.default);
};