'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.connect = connect;
exports.get = get;
exports.collection = collection;
exports.close = close;

var _mongodb = require('mongodb');

var _config = require('../config.json');

var dataBase = null;

function connect(url) {
	return new Promise(function (res, rej) {
		if (dataBase) return res();

		_mongodb.MongoClient.connect(url).then(function (db, err) {
			dataBase = db;
			res(db);
		});
	});
}

function get() {
	return dataBase.db(_config.dbName);
}

function collection(collection) {
	return dataBase.db(_config.dbName).collection(collection);
}

function close() {
	return new Promise(function (res, rej) {
		if (dataBase) {
			dataBase.close();
		}
	});
}