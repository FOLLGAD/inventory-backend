'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _db = require('./db');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _config = require('../config.json');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* DATABASE */

var url = 'mongodb://localhost:27017';
var dbName = 'inventory-abb';

function loop() {
	var expressPromise = new Promise(function (res, rej) {
		var app = (0, _express2.default)();
		app.use(_bodyParser2.default.json());
		(0, _api2.default)(app);
		res(app);
	});

	var mongoPromise = (0, _db.connect)(url);

	Promise.all([expressPromise, mongoPromise]).then(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    app = _ref2[0],
		    db = _ref2[1];

		app.listen(_config.port, function () {
			return console.log('OPEN at port', _config.port);
		});
	}).catch(console.error);
}

loop();