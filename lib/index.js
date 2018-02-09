'use strict';

var _mongodb = require('mongodb');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* DATABASE */

var url = 'mongodb://localhost:27017';
var dbName = 'inventory-abb';

function loop() {
	_mongodb.MongoClient.connect(url).then(function (client, err) {
		var db = client.db(dbName);
		var app = (0, _express2.default)();

		(0, _api2.default)(app);

		app.listen(3000, function () {
			return console.log('OPEN');
		});
	});
}

loop();