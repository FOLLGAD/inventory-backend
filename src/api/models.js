import mongoose, { Schema } from 'mongoose';

import { ObjectTypes } from '../utils';

/* 
	Container
 */
const containerSchema = new Schema({
	name: String,
});
export const Container = mongoose.model('container', containerSchema);

/* 
	PropertyType
 */
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


/* 
	ItemType
 */
const itemTypeSchema = new Schema({
	name: { type: String, required: true },
	properties: [propertyTypeSchema],
});
export const ItemType = mongoose.model('item-type', itemTypeSchema);

/* 
	Property
 */
const propertySchema = new Schema({
	type: { type: propertyTypeSchema, required: true },
	value: Schema.Types.Mixed,
});

/* 
	Item
 */
const itemSchema = new Schema({
	container: { type: Schema.Types.ObjectId, ref: 'container' },
	itemType: { type: Schema.Types.ObjectId, ref: 'property-type' },
	properties: {
		type: [propertySchema],
	},
});
export const Item = mongoose.model('item', itemSchema);

/* 
	User
 */
const userSchema = new Schema({
	email: { type: String, unique: true, required: true },
	lastActive: { type: Date, default: () => new Date() },
}, {
		timestamps: {
			updatedAt: 'updatedAt',
			createdAt: 'registered',
		}
	});
export const User = mongoose.model('user', userSchema);