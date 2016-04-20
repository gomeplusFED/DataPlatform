exports.id = 0;
exports.modules = {

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author fuqiang
	 * @fileoverview main app.js
	 * @date 20151201
	 */
	var ejs = __webpack_require__(39);
	var express = __webpack_require__(40);
	var session = __webpack_require__(41);
	var lactate = __webpack_require__(42);
	var config = __webpack_require__(43);
	var routers = __webpack_require__(55);
	var bodyParser = __webpack_require__(197);
	var flash = __webpack_require__(198);
	var mysql = __webpack_require__(199);
	var app = express();
	var orm = __webpack_require__(135);
	var path = __webpack_require__(79);

	orm.settings.set("connection.pool", true);
	(0, _keys2.default)(config).forEach(function (key) {
	    app.locals[key] = config[key];
	});

	app.use(function (req, res, next) {
	    if (req.headers['user-agent'].indexOf('Chrome') === -1) {
	        res.send('请使用谷歌浏览器');
	    } else {
	        next();
	    }
	});

	app.engine('html', ejs.renderFile);
	app.set('view engine', 'html');

	//parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
	    extended: false
	}));

	//parse application/json
	app.use(bodyParser.json());

	app.set('trust proxy', 1);

	app.use(session({
	    name: 'DataPlatform',
	    secret: 'DataPlatform'
	}));

	app.use(flash);

	app.use(function (req, res, next) {
	    res.locals.session = req.session;
	    next();
	});

	//载入view helps
	__webpack_require__(202)(app);

	new mysql(app);

	routers.forEach(function (router) {
	    app.use(router);
	});

	var count = 0;
	setInterval(function () {
	    count += 1;
	}, repeat);

	var test = __webpack_require__(203);

	if (true) {
	    module.hot.accept(203, function () {
	        test = __webpack_require__(203);
	        console.log('hot');
	    });
	}

	app.use(lactate.static(path.resolve(__dirname, '../static')));

	app.use(function () {
	    var args = arguments;
	    var isErr = args[0] instanceof Error;
	    if (isErr) {
	        args[2].status(500).send(args[0]);
	    } else {
	        args[2]();
	    }
	});

	// app.use((err, req, res, next) => {
	//     res.send({
	//         iserro: true
	//     });
	// });

	app.listen(7879);

/***/ }

};