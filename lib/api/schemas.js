'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.User = exports.Container = exports.Item = undefined;

var _mongoose = require('mongoose');

var itemSchema = new _mongoose.Schema({
	container: _mongoose.Types.ObjectId
});

var Item = exports.Item = (0, _mongoose.model)('item', itemSchema);

var containerSchema = new _mongoose.Schema({
	container: _mongoose.Types.ObjectId
});

var Container = exports.Container = (0, _mongoose.model)('container', containerSchema);

var userSchema = new _mongoose.Schema({
	container: _mongoose.Types.ObjectId,
	email: /.*\@.*\./
});

var User = exports.User = (0, _mongoose.model)('user', userSchema);