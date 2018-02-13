'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

/* DATABASE */

var mongoUrl = process.env.DB_HOST,
    dbName = process.env.DB_NAME,
    port = process.env.PORT;

function loop() {
	var app = (0, _express2.default)();

	app.use(_bodyParser2.default.json()); // Parse the body as JSON
	app.use((0, _morgan2.default)('tiny')); // Initialize logger

	(0, _api2.default)(app);

	_mongoose2.default.connect(mongoUrl + '/' + dbName).then(function () {
		app.listen(port, function () {
			return console.log('OPEN at port', port);
		});
	});
}

loop();