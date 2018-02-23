'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.User = exports.Borrow = exports.Item = exports.ItemType = exports.Container = undefined;

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
});

/* 
	ItemType
 */
var itemTypeSchema = new _mongoose.Schema({
	name: { type: String, required: true },
	propertyTypes: [propertyTypeSchema]
});
var ItemType = exports.ItemType = _mongoose2.default.model('item-type', itemTypeSchema);

/* 
	Item
 */
var propertySchema = new _mongoose.Schema({
	propertyType: { type: _mongoose.Schema.Types.ObjectId, required: true },
	value: _mongoose.Schema.Types.Mixed
}, {
	_id: false
});
var itemSchema = new _mongoose.Schema({
	container: { type: _mongoose.Schema.Types.ObjectId, ref: 'container' },
	itemType: { type: _mongoose.Schema.Types.ObjectId, ref: 'item-type' },
	properties: {
		type: [propertySchema]
	}
}, {
	timestamps: true,
	toJSON: {
		virtuals: true
	},
	toObject: {
		virtuals: true
	}
});
var Item = exports.Item = _mongoose2.default.model('item', itemSchema);

/*
	Borrow
 */
var borrowSchema = new _mongoose.Schema({
	from: { type: Date, required: true, default: function _default() {
			return new Date();
		} },
	to: { type: Date, required: true },
	returned: Date,
	user: { type: _mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
	item: { type: _mongoose.Schema.Types.ObjectId, required: true, ref: 'item' }
});
var Borrow = exports.Borrow = _mongoose2.default.model('borrow', borrowSchema);

/* 
	User
 */
var nameSchema = new _mongoose.Schema({
	first: String,
	last: String
});
var userSchema = new _mongoose.Schema({
	email: { type: String, unique: true, required: true },
	name: nameSchema,
	lastActive: { type: Date, default: function _default() {
			return new Date();
		} },
	phone: String
}, {
	timestamps: {
		updatedAt: 'updatedAt',
		createdAt: 'registered'
	},
	toJSON: {
		virtuals: true
	},
	toObject: {
		virtuals: true
	}
});

var fullNameVirtual = userSchema.virtual('fullName');
fullNameVirtual.get(function () {
	if (this.name && this.name.first && this.name.last) {
		return this.name.first + ' ' + this.name.last;
	} else {
		return this.name ? this.name.first || this.name.last : null;
	}
});

var User = exports.User = _mongoose2.default.model('user', userSchema);