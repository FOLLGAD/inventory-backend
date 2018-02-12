'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.User = exports.Item = exports.ItemType = exports.Container = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// function stringToType(string) {
// 	if (string == 'Number') return Number;
// 	if (string == 'String') return String;
// 	if (string == 'Date') return Date;
// 	if (string == 'Boolean') return Boolean;
// 	// if (/^\/.*\/\w*$/.test(string)) return new RegExp(string);
// }

var ObjectTypes = {
	'Number': Number,
	'String': String,
	'Date': Date,
	'Boolean': Boolean
};

var containerSchema = new _mongoose.Schema({
	name: String
});
var Container = exports.Container = _mongoose2.default.model('container', containerSchema);

var propertyTypeSchema = new _mongoose.Schema({
	name: String,
	type: {
		type: String,
		validate: function validate(type) {
			return type in ObjectTypes;
		}
	}
}, {
	_id: false,
	id: false
});

var itemTypeSchema = new _mongoose.Schema({
	name: { type: String, required: true },
	properties: [propertyTypeSchema]
});
var ItemType = exports.ItemType = _mongoose2.default.model('item-type', itemTypeSchema);

var propertySchema = new _mongoose.Schema({
	type: { type: propertyTypeSchema, required: true },
	value: _mongoose.Schema.Types.Mixed
});

var itemSchema = new _mongoose.Schema({
	container: { type: _mongoose.Schema.Types.ObjectId, ref: 'container' },
	itemType: { type: _mongoose.Schema.Types.ObjectId, ref: 'property-type' },
	properties: {
		type: [propertySchema]
	}
});
var Item = exports.Item = _mongoose2.default.model('item', itemSchema);

var userSchema = new _mongoose.Schema({
	email: { type: String, unique: true, required: true }
});
var User = exports.User = _mongoose2.default.model('user', userSchema);