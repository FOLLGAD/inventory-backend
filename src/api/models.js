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
});


/* 
	ItemType
 */
const itemTypeSchema = new Schema({
	name: { type: String, required: true },
	propertyTypes: [propertyTypeSchema],
});
export const ItemType = mongoose.model('item-type', itemTypeSchema);


/* 
	Item
 */
const propertySchema = new Schema({
	propertyType: { type: Schema.Types.ObjectId, required: true },
	value: Schema.Types.Mixed,
}, {
		_id: false,
	});
const itemSchema = new Schema({
	container: { type: Schema.Types.ObjectId, ref: 'container' },
	itemType: { type: Schema.Types.ObjectId, ref: 'item-type' },
	properties: {
		type: [propertySchema],
	},
}, {
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		}
	});
export const Item = mongoose.model('item', itemSchema);


/*
	Borrow
 */
const borrowSchema = new Schema({
	from: { type: Date, required: true, default: () => (new Date()) },
	to: { type: Date, required: true },
	returned: Date,
	user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
	item: { type: Schema.Types.ObjectId, required: true, ref: 'item' },
});
export const Borrow = mongoose.model('borrow', borrowSchema);


/* 
	User
 */
const nameSchema = new Schema({
	first: String,
	last: String,
});
const userSchema = new Schema({
	email: { type: String, unique: true, required: true },
	name: nameSchema,
	lastActive: { type: Date, default: () => new Date() },
	phone: String,
}, {
		timestamps: {
			updatedAt: 'updatedAt',
			createdAt: 'registered',
		},
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		}
	});

let fullNameVirtual = userSchema.virtual('fullName');
fullNameVirtual.get(function () {
	if (this.name && this.name.first && this.name.last) {
		return `${this.name.first} ${this.name.last}`;
	} else {
		return this.name ? this.name.first || this.name.last : null;
	}
});

export const User = mongoose.model('user', userSchema);