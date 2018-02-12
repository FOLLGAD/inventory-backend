'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _config = require('../config.json');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* DATABASE */

var mongoUrl = 'mongodb://localhost:27017';

function loop() {
	var app = (0, _express2.default)();
	app.use(_bodyParser2.default.json());
	app.use((0, _morgan2.default)('tiny'));
	(0, _api2.default)(app);

	_mongoose2.default.connect(mongoUrl + '/' + _config.dbName).then(function () {
		app.listen(_config.port, function () {
			return console.log('OPEN at port', _config.port);
		});
	});
}

loop();