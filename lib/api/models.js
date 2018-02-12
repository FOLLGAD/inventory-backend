'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.User = exports.Item = exports.ItemType = exports.Container = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* 
	Container
 */
var containerSchema = new _mongoose.Schema({
	name: String
});
var Container = exports.Container = _mongoose2.default.model('container', containerSchema);

/* 
	PropertyType
 */
var propertyTypeSchema = new _mongoose.Schema({
	name: String,
	type: {
		type: String,
		validate: function validate(type) {
			return type in _utils.ObjectTypes;
		}
	}
}, {
	_id: false,
	id: false
});

/* 
	ItemType
 */
var itemTypeSchema = new _mongoose.Schema({
	name: { type: String, required: true },
	properties: [propertyTypeSchema]
});
var ItemType = exports.ItemType = _mongoose2.default.model('item-type', itemTypeSchema);

/* 
	Property
 */
var propertySchema = new _mongoose.Schema({
	type: { type: propertyTypeSchema, required: true },
	value: _mongoose.Schema.Types.Mixed
});

/* 
	Item
 */
var itemSchema = new _mongoose.Schema({
	container: { type: _mongoose.Schema.Types.ObjectId, ref: 'container' },
	itemType: { type: _mongoose.Schema.Types.ObjectId, ref: 'property-type' },
	properties: {
		type: [propertySchema]
	}
});
var Item = exports.Item = _mongoose2.default.model('item', itemSchema);

/* 
	User
 */
var userSchema = new _mongoose.Schema({
	email: { type: String, unique: true, required: true },
	lastActive: { type: Date, default: function _default() {
			return new Date();
		} }
}, {
	timestamps: {
		updatedAt: 'updatedAt',
		createdAt: 'registered'
	}
});
var User = exports.User = _mongoose2.default.model('user', userSchema);