import mongoose, { Schema } from 'mongoose';

// function stringToType(string) {
// 	if (string == 'Number') return Number;
// 	if (string == 'String') return String;
// 	if (string == 'Date') return Date;
// 	if (string == 'Boolean') return Boolean;
// 	// if (/^\/.*\/\w*$/.test(string)) return new RegExp(string);
// }

const ObjectTypes = {
	'Number': Number,
	'String': String,
	'Date': Date,
	'Boolean': Boolean,
}

const containerSchema = new Schema({
	name: String,
});
export const Container = mongoose.model('container', containerSchema);


const propertyTypeSchema = new Schema({
	name: String,
	type: {
		type: String,
		validate(type) {
			return type in ObjectTypes;
		}
	},
}, {
		_id: false,
		id: false,
	});


const itemTypeSchema = new Schema({
	name: { type: String, required: true },
	properties: [propertyTypeSchema],
});
export const ItemType = mongoose.model('item-type', itemTypeSchema);


const propertySchema = new Schema({
	type: { type: propertyTypeSchema, required: true },
	value: Schema.Types.Mixed,
});


const itemSchema = new Schema({
	container: { type: Schema.Types.ObjectId, ref: 'container' },
	itemType: { type: Schema.Types.ObjectId, ref: 'property-type' },
	properties: {
		type: [propertySchema],
	},
});
export const Item = mongoose.model('item', itemSchema);


const userSchema = new Schema({
	email: { type: String, unique: true, required: true },
});
export const User = mongoose.model('user', userSchema);