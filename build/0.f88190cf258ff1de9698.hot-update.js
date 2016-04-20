exports.id = 0;
exports.modules = {

/***/ 55:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var express = __webpack_require__(40),
	    router = express.Router(),
	    config = __webpack_require__(43),
	    fs = __webpack_require__(78),
	    path = __webpack_require__(79),
	    files = path.resolve(__dirname, "../controllers/manage"),
	    renderApi = __webpack_require__(80);

	var rd = __webpack_require__(87);

	//var model = mysql.init({
	//  username: 'datapltfm_user',
	//  pwd: 'Db57AteE172E4D1168',
	//  host: '10.125.31.220',
	//  database: 'dataplatform'
	//});

	module.exports = [];

	var context = __webpack_require__(88);

	function addRouter(path) {
	    module.exports.push(context(path)(router));
	}

	// var filePath = async(path) => {
	//     return new Promise((resolve, reject) => {
	//         fs.readdir(path, (err, data) => {
	//             if (err) {
	//                 reject(err);
	//             } else {
	//                 resolve(data);
	//             }
	//         })
	//     });
	// };

	// addRouter('./combine');

	module.exports.push(__webpack_require__(191)(router));
	module.exports.push(__webpack_require__(193)(router));
	module.exports.push(__webpack_require__(196)(router));

	// (async() => {
	//     try {
	//         var data = await filePath(files);
	//         for (var file of data) {
	//             if (file.indexOf(".js") < 0) {
	//                 var f = await filePath(files + "/" + file);
	//                 for (var key of f) {
	//                     if (key.indexOf("js") >= 0) {
	//                         addRouter(files + "/" + file + "/" + key);
	//                     }
	//                 }
	//             }
	//         }
	//     } catch (err) {
	//         console.log(err);
	//     }
	// })();

	var routeFiles = rd.readFileFilterSync(files, /\.js/);
	routeFiles.forEach(function (item) {
	    addRouter(item.replace(files, '.'));
	});

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
	    for (var _iterator = (0, _getIterator3.default)(config.limit), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var key = _step.value;

	        (0, _keys2.default)(key).forEach(function (data) {
	            if (key[data].display) {
	                if (key[data].path.length > 0) {
	                    var _iteratorNormalCompletion2 = true;
	                    var _didIteratorError2 = false;
	                    var _iteratorError2 = undefined;

	                    try {
	                        for (var _iterator2 = (0, _getIterator3.default)(key[data].path), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                            var k = _step2.value;

	                            module.exports.push(new renderApi(router, k));
	                        }
	                    } catch (err) {
	                        _didIteratorError2 = true;
	                        _iteratorError2 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                                _iterator2.return();
	                            }
	                        } finally {
	                            if (_didIteratorError2) {
	                                throw _iteratorError2;
	                            }
	                        }
	                    }
	                } else if (key[data].routers && key[data].routers.length > 0) {
	                    var _iteratorNormalCompletion3 = true;
	                    var _didIteratorError3 = false;
	                    var _iteratorError3 = undefined;

	                    try {
	                        for (var _iterator3 = (0, _getIterator3.default)(key[data].routers), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                            var k = _step3.value;

	                            module.exports.push(new renderApi(router, k));
	                        }
	                    } catch (err) {
	                        _didIteratorError3 = true;
	                        _iteratorError3 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                                _iterator3.return();
	                            }
	                        } finally {
	                            if (_didIteratorError3) {
	                                throw _iteratorError3;
	                            }
	                        }
	                    }
	                }
	            }
	        });
	    }
	} catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	} finally {
	    try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	        }
	    } finally {
	        if (_didIteratorError) {
	            throw _iteratorError;
	        }
	    }
	}

	router.get('/api/test', function (req, res, next) {
	    // console.log(222);
	    res.send('asdasd');
	});

/***/ }

};