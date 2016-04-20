/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return callback();
/******/ 		}
/******/ 		callback(null, update);
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "d2d9b74a5a3d9a5e971f"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(Object.defineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(Object.defineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals __resourceQuery */
	if(true) {
		var hotPollInterval = +(__resourceQuery.substr(1)) || (10 * 60 * 1000);

		function checkForUpdate(fromUpdate) {
			if(module.hot.status() === "idle") {
				module.hot.check(true, function(err, updatedModules) {
					if(err) {
						if(module.hot.status() in {
								abort: 1,
								fail: 1
							}) {
							console.warn("[HMR] Cannot apply update.");
							console.warn("[HMR] " + err.stack || err.message);
							console.warn("[HMR] You need to restart the application!");
						} else {
							console.warn("[HMR] Update failed: " + err.stack || err.message);
						}
						return;
					}
					if(!updatedModules) {
						if(fromUpdate) console.log("[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				});
			}
		}
		setInterval(checkForUpdate, hotPollInterval);
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}

	/* WEBPACK VAR INJECTION */}.call(exports, "?1000"))

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});

		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}

		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ },
/* 3 */
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
	    console.log(count);
	}, 1000);

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	module.exports = __webpack_require__(26).Object.keys;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(7)
	  , $keys    = __webpack_require__(9);

	__webpack_require__(24)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(8);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(10)
	  , enumBugKeys = __webpack_require__(23);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(11)
	  , toIObject    = __webpack_require__(12)
	  , arrayIndexOf = __webpack_require__(15)(false)
	  , IE_PROTO     = __webpack_require__(19)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(13)
	  , defined = __webpack_require__(8);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(14);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(12)
	  , toLength  = __webpack_require__(16)
	  , toIndex   = __webpack_require__(18);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(17)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(17)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(20)('keys')
	  , uid    = __webpack_require__(22);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(21)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 22 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(25)
	  , core    = __webpack_require__(26)
	  , fails   = __webpack_require__(35);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(21)
	  , core      = __webpack_require__(26)
	  , ctx       = __webpack_require__(27)
	  , hide      = __webpack_require__(29)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 26 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.2.1'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(28);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(30)
	  , createDesc = __webpack_require__(38);
	module.exports = __webpack_require__(34) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(31)
	  , IE8_DOM_DEFINE = __webpack_require__(33)
	  , toPrimitive    = __webpack_require__(37)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(34) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(32);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(34) && !__webpack_require__(35)(function(){
	  return Object.defineProperty(__webpack_require__(36)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(35)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(32)
	  , document = __webpack_require__(21).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(32);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = require("ejs");

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = require("cookie-session");

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = require("lactate");

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author fuqiang
	 * @date 20151128
	 * @fileoverview 全站统一配置
	 */
	var dataOverview = __webpack_require__(44),
	    usersAnalysis = __webpack_require__(45),
	    platformRebate = __webpack_require__(46),
	    businessRebate = __webpack_require__(47),
	    useAnalysis = __webpack_require__(48),
	    marketingAnalysis = __webpack_require__(49),
	    channelAnalysis = __webpack_require__(50),
	    share = __webpack_require__(51),
	    achievements = __webpack_require__(52),
	    terminal = __webpack_require__(53),
	    retainedAnalysis = __webpack_require__(54);

	module.exports = {
	    siteName: '美信数据平台',
	    pageTitle: '',
	    js: [],
	    limit: [{
	        "dataOverview": {
	            name: "数据概览",
	            id: 2,
	            display: true,
	            className: "fa fa-dashboard fa-fw",
	            href: "#",
	            path: [dataOverview.all(), dataOverview.wap()]
	        }
	    }, {
	        "userManagement": {
	            name: "用户管理",
	            id: 0,
	            display: true,
	            className: "fa fa-user fa-fw",
	            href: "#",
	            path: [{
	                name: "用户列表",
	                path: "/user/all",
	                display: true
	            }]
	        }
	    }, {
	        "userAnalysis": {
	            name: "用户分析",
	            id: 3,
	            display: true,
	            className: "fa fa-bar-chart-o fa-fw",
	            href: "#",
	            path: [usersAnalysis.newUsers(), usersAnalysis.activeAccount(), usersAnalysis.startUp(), usersAnalysis.version()]
	        }
	    }, {
	        "retainedAnalysis": {
	            name: "留存分析",
	            id: 4,
	            display: true,
	            className: "fa fa-th-list fa-fw",
	            href: "/retainedAnalysis",
	            path: [],
	            routers: [retainedAnalysis.retained()]
	        }
	    }, {
	        "channelAnalysis": {
	            name: "渠道分析",
	            id: 5,
	            display: true,
	            className: "fa  fa-laptop fa-fw",
	            href: "/channelAnalysis",
	            path: [],
	            routers: [channelAnalysis.channel()]
	        }
	    }, {
	        "useAnalysis": {
	            name: "使用分析",
	            id: 6,
	            display: true,
	            className: "fa fa-th fa-fw",
	            href: "#",
	            path: [useAnalysis.useTime(), useAnalysis.useFrequency(), useAnalysis.accessPage(), useAnalysis.accessWap(), useAnalysis.accessPageNum()]
	        }
	    }, {
	        "terminal": {
	            name: "终端属性",
	            id: 8,
	            display: true,
	            className: "fa fa-tablet fa-fw",
	            href: "#",
	            path: [terminal.model(), terminal.network(), terminal.provinces()]
	        }
	    }, {
	        "share": {
	            name: "分享数据",
	            id: 9,
	            display: true,
	            className: "fa fa-external-link fa-fw",
	            href: "#",
	            path: [share.inside(), share.outer()]
	        }
	    }, {
	        "information": {
	            name: "消息推送",
	            id: 10,
	            display: false,
	            className: "fa fa-sign-in fa-fw",
	            href: "/",
	            path: []
	        }
	    }, {
	        "search": {
	            name: "搜索转化",
	            id: 11,
	            display: false,
	            className: "fa fa-gear",
	            href: "/",
	            path: []
	        }
	    }, {
	        "topic": {
	            name: "群组话题",
	            id: 12,
	            display: false,
	            className: "fa fa-github-square fa-fw",
	            href: "/",
	            path: []
	        }
	    }, {
	        "achievements": {
	            name: "销售业绩",
	            id: 13,
	            display: false,
	            className: "fa fa-flag-checkered fa-fw",
	            href: "#",
	            path: [achievements.shop()]
	        }
	    }, {
	        "marketingAnalysis": {
	            name: "营销分析",
	            id: 14,
	            display: true,
	            className: "fa fa-bar-chart-o fa-fw fa-fw",
	            href: "#",
	            path: [marketingAnalysis.overview(), marketingAnalysis.activityFlow(), marketingAnalysis.couponInfo()]
	        }
	    }, {
	        "platformRebate": {
	            name: "平台返利汇总",
	            id: 15,
	            display: true,
	            className: "fa fa-bar-chart-o fa-fw fa-fw",
	            href: "#",
	            path: [platformRebate.platformOrder(), platformRebate.individualEvent(), platformRebate.platformPromotions(), platformRebate.platformBasis(), platformRebate.inviteBusiness(), platformRebate.inviteRegisterAndEnter()],
	            routers: []
	        }
	    }, {
	        "businessRebate": {
	            name: "商家返利汇总",
	            id: 16,
	            display: true,
	            className: "fa fa-desktop fa-fw",
	            href: "/businessRebate",
	            path: [],
	            routers: [businessRebate.all(), businessRebate.plan()]
	        }
	    }]
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author luoye
	 * @date 20160406
	 * @fileoverview 数据概览
	 */

	module.exports = {
	    all: function all() {
	        return {
	            name: "数据概览",
	            path: "/dataOverview/app",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "数据概览",
	                query_api: "/dataOverview/dataOverviewAllOne"
	            }, {
	                type: "chart",
	                title: "数据趋势",
	                query_api: "/dataOverview/dataOverviewAllTwo"
	            }, {
	                type: "table",
	                title: "地域分布 TOP10",
	                query_api: "/dataOverview/dataOverviewAllThree"
	            }, {
	                type: "table",
	                title: "访问页面 TOP10",
	                query_api: "/dataOverview/dataOverviewAllFour"
	            }]
	        };
	    },
	    wap: function wap() {
	        return {
	            name: "数据概览-WAP",
	            path: "/dataOverview/wap",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "数据概览",
	                query_api: "/dataOverview/wapOne"
	            }, {
	                type: "chart",
	                title: "数据趋势",
	                query_api: "/dataOverview/wapTwo"
	            }, {
	                type: "table",
	                title: "地域分布 TOP10",
	                query_api: "/dataOverview/wapThree"
	            }, {
	                type: "table",
	                title: "访问页面 TOP10",
	                query_api: "/dataOverview/wapFour"
	            }]
	        };
	    }
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160330
	 * @fileoverview 新增用户分析
	 */

	module.exports = {
	    newUsers: function newUsers() {
	        return {
	            path: "/userAnalysis/newUsers",
	            name: "新增用户",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "新增用户趋势",
	                query_api: "/userAnalysis/newUsersOne"
	            }, {
	                type: "table",
	                title: "新增用户明细",
	                query_api: "/userAnalysis/newUsersTwe"
	            }]
	        };
	    },
	    activeAccount: function activeAccount() {
	        return {
	            path: "/userAnalysis/activeAccount",
	            name: "活跃用户",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "活跃用户趋势",
	                query_api: "/userAnalysis/activeAccountOne"
	            }, {
	                type: "table",
	                title: "活跃用户明细",
	                query_api: "/userAnalysis/activeAccountTwe"
	            }]
	        };
	    },
	    startUp: function startUp() {
	        return {
	            path: "/userAnalysis/startUp",
	            name: "启动次数",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "启动次数趋势",
	                query_api: "/userAnalysis/startUpOne"
	            }, {
	                type: "table",
	                title: "启动次数明细",
	                query_api: "/userAnalysis/startUpTwe"
	            }]
	        };
	    },
	    version: function version() {
	        return {
	            path: "/userAnalysis/version",
	            name: "版本分布",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "TOP 10版本趋势",
	                query_api: "/userAnalysis/versionOne"
	            }, {
	                type: "table",
	                title: "版本累计用户",
	                query_api: "/userAnalysis/versionTwo"
	            }]
	        };
	    }
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160401
	 * @fileoverview 平台返利汇总
	 */

	module.exports = {
	    platformOrder: function platformOrder() {
	        return {
	            path: "/platformRebate/platformOrder",
	            name: "平台订单返利汇总",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "返利订单总览",
	                query_api: "/platformRebate/platformOrderOne"
	            }, {
	                type: "chart",
	                title: "返利订单趋势",
	                query_api: "/platformRebate/platformOrderTwe"
	            }, {
	                type: "chart",
	                title: "返利层级分布",
	                query_api: "/platformRebate/platformOrderThree"
	            }, {
	                type: "chart",
	                title: "返利类型分布",
	                query_api: "/platformRebate/platformOrderFour"
	            }, {
	                type: "table",
	                title: "返利计划汇总",
	                query_api: "/platformRebate/platformOrderFive"
	            }]
	        };
	    },
	    individualEvent: function individualEvent() {
	        return {
	            path: "/platformRebate/individualEvent",
	            name: "单项单级返利",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "单项单级返利总览",
	                query_api: "/platformRebate/individualEventOne"
	            }, {
	                type: "chart",
	                title: "返利订单趋势",
	                query_api: "/platformRebate/individualEventTwo"
	            }, {
	                type: "chart",
	                title: "返利类型分布",
	                query_api: "/platformRebate/individualEventThree"
	            }, {
	                type: "table",
	                title: "单项单级返利汇总",
	                query_api: "/platformRebate/individualEventFour"
	            }]
	        };
	    },
	    platformPromotions: function platformPromotions() {
	        return {
	            path: "/platformRebate/platformPromotions",
	            name: "平台促销返利",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "平台促销返利订单总览",
	                query_api: "/platformRebate/platformPromotionsOne"
	            }, {
	                type: "chart",
	                title: "返利订单趋势",
	                query_api: "/platformRebate/platformPromotionsTwo"
	            }, {
	                type: "chart",
	                title: "返利层级分布",
	                query_api: "/platformRebate/platformPromotionsThree"
	            }, {
	                type: "chart",
	                title: "返利类型分布",
	                query_api: "/platformRebate/platformPromotionsFour"
	            }, {
	                type: "table",
	                title: "平台促销返利汇总",
	                query_api: "/platformRebate/platformPromotionsFive"
	            }]
	        };
	    },
	    platformBasis: function platformBasis() {
	        return {
	            path: "/platformRebate/platformBasis",
	            name: "平台基础返利",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "平台基础返利总览",
	                query_api: "/platformRebate/platformBasisOne"
	            }, {
	                type: "chart",
	                title: "返利订单趋势",
	                query_api: "/platformRebate/platformBasisTwo"
	            }, {
	                type: "chart",
	                title: "返利层级分布",
	                query_api: "/platformRebate/platformBasisThree"
	            }, {
	                type: "chart",
	                title: "返利类型分布",
	                query_api: "/platformRebate/platformBasisFour"
	            }, {
	                type: "table",
	                title: "平台基础返利汇总",
	                query_api: "/platformRebate/platformBasisFive"
	            }]
	        };
	    },
	    inviteBusiness: function inviteBusiness() {
	        return {
	            path: "/platformRebate/inviteBusiness",
	            name: "邀请商户入驻",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "邀请商户入驻总览",
	                query_api: "/platformRebate/inviteBusinessOne"
	            }, {
	                type: "chart",
	                title: "返利订单趋势",
	                query_api: "/platformRebate/inviteBusinessTwo"
	            }, {
	                type: "chart",
	                title: "返利层级分布",
	                query_api: "/platformRebate/inviteBusinessThree"
	            }, {
	                type: "table",
	                title: "邀请商户入驻汇总",
	                query_api: "/platformRebate/inviteBusinessFour"
	            }]
	        };
	    },
	    inviteRegisterAndEnter: function inviteRegisterAndEnter() {
	        return {
	            path: "/platformRebate/inviteRegisterAndEnter",
	            name: "邀请注册 / 入驻",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "邀请好友注册总览",
	                query_api: "/platformRebate/inviteRegisterAndEnterOne"
	            }, {
	                type: "table",
	                title: "邀请商户入驻总览",
	                query_api: "/platformRebate/inviteRegisterAndEnterTwo"
	            }, {
	                type: "chart",
	                title: "邀请趋势",
	                query_api: "/platformRebate/inviteRegisterAndEnterThree"
	            }, {
	                type: "table",
	                title: "邀请返利汇总",
	                query_api: "/platformRebate/inviteRegisterAndEnterFour"
	            }]
	        };
	    }
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160405
	 * @fileoverview 商家返利汇总
	 */

	module.exports = {
	    all: function all() {
	        return {
	            name: "商家返利汇总",
	            path: "/businessRebate",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "商家设置返利总览",
	                query_api: "/businessRebate/businessAllOne"
	            }, {
	                type: "chart",
	                title: "返利订单趋势",
	                query_api: "/businessRebate/businessAllTwo"
	            }, {
	                type: "chart",
	                title: "返利层级分布",
	                query_api: "/businessRebate/businessAllThree"
	            }, {
	                type: "chart",
	                title: "返利类型分布",
	                query_api: "/businessRebate/businessAllFour"
	            }, {
	                type: "table",
	                title: "商家返利TOP50",
	                query_api: "/businessRebate/businessAllFive"
	            }, {
	                type: "table",
	                title: "商家返利计划TOP50",
	                query_api: "/businessRebate/businessAllSix"
	            }]
	        };
	    },
	    plan: function plan() {
	        return {
	            name: "商家返利计划",
	            path: "/businessRebate/plan",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "商家设置返利",
	                query_api: "/businessRebate/planOne"
	            }]
	        };
	    }
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 使用分析
	 */

	module.exports = {
	    useTime: function useTime() {
	        return {
	            path: "/useAnalysis/useTime",
	            name: "使用时长",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "单次使用时长分布",
	                query_api: "/useAnalysis/useTimeOne"
	            }, {
	                type: "table",
	                title: "单次使用时长分布明细",
	                query_api: "/useAnalysis/useTimeTwo"
	            }, {
	                type: "chart",
	                title: "日使用时长分布",
	                query_api: "/useAnalysis/useTimeThree"
	            }, {
	                type: "table",
	                title: "日使用时长分布明细",
	                query_api: "/useAnalysis/useTimeFour"
	            }]
	        };
	    },
	    useFrequency: function useFrequency() {
	        return {
	            path: "/useAnalysis/useFrequency",
	            name: "使用频率",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "日启动次数分布",
	                query_api: "/useAnalysis/useFrequencyOne"
	            }, {
	                type: "table",
	                title: "日启动次数分布明细",
	                query_api: "/useAnalysis/useFrequencyTwo"
	            }, {
	                type: "chart",
	                title: "周启动次数分布",
	                query_api: "/useAnalysis/useFrequencyThree"
	            }, {
	                type: "table",
	                title: "周启动次数分布明细",
	                query_api: "/useAnalysis/useFrequencyFour"
	            }, {
	                type: "chart",
	                title: "月启动次数分布",
	                query_api: "/useAnalysis/useFrequencyFive"
	            }, {
	                type: "table",
	                title: "月启动次数分布明细",
	                query_api: "/useAnalysis/useFrequencySix"
	            }]
	        };
	    },
	    accessPage: function accessPage() {
	        return {
	            path: "/useAnalysis/accessPage",
	            name: "访问页面",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "访问页面",
	                query_api: "/useAnalysis/accessPageOne"
	            }, {
	                type: "table",
	                title: "访问页面明细",
	                query_api: "/useAnalysis/accessPageTwo"
	            }]
	        };
	    },
	    accessWap: function accessWap() {
	        return {
	            path: "/useAnalysis/accessWap",
	            name: "访问页面-wap",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "受访页面",
	                query_api: "/useAnalysis/accessWapOne"
	            }, {
	                type: "table",
	                title: "访问页面明细",
	                query_api: "/useAnalysis/accessWapTwo"
	            }]
	        };
	    },
	    accessPageNum: function accessPageNum() {
	        return {
	            path: "/useAnalysis/accessNum",
	            name: "访问页面数量分布",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "访问页面分布",
	                query_api: "/useAnalysis/accessPageNumOne"
	            }, {
	                type: "table",
	                title: "访问页面数据明细",
	                query_api: "/useAnalysis/accessPageNumTwo"
	            }]
	        };
	    }
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 营销分析
	 */

	module.exports = {
	    overview: function overview() {
	        return {
	            name: "活动概览",
	            path: "/marketingAnalysis/overview",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "营销活动流量",
	                query_api: "/marketingAnalysis/overviewOne"
	            }]
	        };
	    },
	    activityFlow: function activityFlow() {
	        return {
	            name: "活动流量",
	            path: "/marketingAnalysis/activityFlow",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "营销流量趋势",
	                query_api: "/marketingAnalysis/activityFlowOne"
	            }, {
	                type: "table",
	                title: "营销流量明细表",
	                query_api: "/marketingAnalysis/activityFlowTwo"
	            }]
	        };
	    },
	    couponInfo: function couponInfo() {
	        return {
	            name: "优惠券信息",
	            path: "/marketingAnalysis/couponInfo",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "优惠券分布",
	                query_api: "/marketingAnalysis/couponInfoOne"
	            }, {
	                type: "table",
	                title: "优惠券明细",
	                query_api: "/marketingAnalysis/couponInfoTwo"
	            }]
	        };
	    }
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 渠道分析
	 */

	module.exports = {
	    channel: function channel() {
	        return {
	            name: "留存分析",
	            path: "/channelAnalysis",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "TOP 10渠道",
	                query_api: "/channelAnalysis/channelOne"
	            }, {
	                type: "table",
	                title: "各渠道数据明细",
	                query_api: "/channelAnalysis/channelTwo"
	            }]
	        };
	    }
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160415
	 * @fileoverview 分享数据
	 */

	module.exports = {
	    inside: function inside() {
	        return {
	            name: "站内分享",
	            path: "/share/inside",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "站内分享趋势",
	                query_api: "/share/insideOne"
	            }, {
	                type: "table",
	                title: "站内分享计数据详情",
	                query_api: "/share/insideTwo"
	            }]
	        };
	    },
	    outer: function outer() {
	        return {
	            name: "站外分享",
	            path: "/share/outer",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "站内分享趋势",
	                query_api: "/share/outerOne"
	            }, {
	                type: "table",
	                title: "站内分享计数据详情",
	                query_api: "/share/outerTwo"
	            }]
	        };
	    }
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160415
	 * @fileoverview 销售业绩
	 */

	module.exports = {
	    shop: function shop() {
	        return {
	            name: "店铺分析",
	            path: "/achievements/shop",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "店铺趋势分析",
	                query_api: "/achievements/shopOne"
	            }, {
	                type: "table",
	                title: "店铺趋势明细",
	                query_api: "/achievements/shopTwo"
	            }, {
	                type: "table",
	                title: "店铺流量排行TOP 50",
	                query_api: "/achievements/shopThree"
	            }, {
	                type: "table",
	                title: "店铺交易排行TOP 50",
	                query_api: "/achievements/shopFour"
	            }]
	        };
	    },
	    outer: function outer() {
	        return {
	            name: "站外分享",
	            path: "/share/outer",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "站内分享趋势",
	                query_api: "/share/outerOne"
	            }, {
	                type: "table",
	                title: "站内分享计数据详情",
	                query_api: "/share/outerTwo"
	            }]
	        };
	    }
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160418
	 * @fileoverview 终端属性
	 */

	module.exports = {
	    model: function model() {
	        return {
	            name: "设备终端",
	            path: "/terminal/model",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "TOP 10",
	                query_api: "/terminal/modelOne"
	            }, {
	                type: "table",
	                title: "明细",
	                query_api: "/terminal/modelTwo"
	            }]
	        };
	    },
	    network: function network() {
	        return {
	            name: "网络及运营商",
	            path: "/terminal/network",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "TOP 10",
	                query_api: "/terminal/networkOne"
	            }, {
	                type: "table",
	                title: "明细",
	                query_api: "/terminal/networkTwo"
	            }]
	        };
	    },
	    provinces: function provinces() {
	        return {
	            name: "地域",
	            path: "/terminal/provinces",
	            display: true,
	            defaultData: [{
	                type: "chart",
	                title: "TOP 10",
	                query_api: "/terminal/provincesOne"
	            }, {
	                type: "table",
	                title: "明细",
	                query_api: "/terminal/provincesTwo"
	            }]
	        };
	    }
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 留存分析
	 */

	module.exports = {
	    retained: function retained() {
	        return {
	            name: "留存分析",
	            path: "/retainedAnalysis",
	            display: true,
	            defaultData: [{
	                type: "table",
	                title: "留存用户情况",
	                query_api: "/retainedAnalysis/retainedOne"
	            }]
	        };
	    }
	};

/***/ },
/* 55 */
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

	router.get('/api/test', function (req, res, next) {
	    // console.log(222);
	    res.send('22211as');
	});

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

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(58);
	__webpack_require__(73);
	module.exports = __webpack_require__(75);

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(59);
	var global        = __webpack_require__(21)
	  , hide          = __webpack_require__(29)
	  , Iterators     = __webpack_require__(62)
	  , TO_STRING_TAG = __webpack_require__(71)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(60)
	  , step             = __webpack_require__(61)
	  , Iterators        = __webpack_require__(62)
	  , toIObject        = __webpack_require__(12);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(63)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(64)
	  , $export        = __webpack_require__(25)
	  , redefine       = __webpack_require__(65)
	  , hide           = __webpack_require__(29)
	  , has            = __webpack_require__(11)
	  , Iterators      = __webpack_require__(62)
	  , $iterCreate    = __webpack_require__(66)
	  , setToStringTag = __webpack_require__(70)
	  , getPrototypeOf = __webpack_require__(72)
	  , ITERATOR       = __webpack_require__(71)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(29);

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(67)
	  , descriptor     = __webpack_require__(38)
	  , setToStringTag = __webpack_require__(70)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(29)(IteratorPrototype, __webpack_require__(71)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(31)
	  , dPs         = __webpack_require__(68)
	  , enumBugKeys = __webpack_require__(23)
	  , IE_PROTO    = __webpack_require__(19)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(36)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(69).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(30)
	  , anObject = __webpack_require__(31)
	  , getKeys  = __webpack_require__(9);

	module.exports = __webpack_require__(34) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(21).document && document.documentElement;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(30).f
	  , has = __webpack_require__(11)
	  , TAG = __webpack_require__(71)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(20)('wks')
	  , uid        = __webpack_require__(22)
	  , Symbol     = __webpack_require__(21).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(11)
	  , toObject    = __webpack_require__(7)
	  , IE_PROTO    = __webpack_require__(19)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(74)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(63)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(17)
	  , defined   = __webpack_require__(8);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(31)
	  , get      = __webpack_require__(76);
	module.exports = __webpack_require__(26).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(77)
	  , ITERATOR  = __webpack_require__(71)('iterator')
	  , Iterators = __webpack_require__(62);
	module.exports = __webpack_require__(26).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(14)
	  , TAG = __webpack_require__(71)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160325
	 * @fileoverview 统一跳转页面
	 */
	var renderApi = __webpack_require__(81);

	module.exports = function (Router, options) {
	  Router = new renderApi(Router, options);
	  return Router;
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160325
	 * @fileoverview 统一跳转页面
	 */
	var utils = __webpack_require__(82),
	    _ = __webpack_require__(84),
	    cache = __webpack_require__(85),
	    cacheTime = 1;

	function renderApi(Router, options) {
	    var defaultOption = utils.mixin({
	        //路由
	        path: "",
	        //跳转页面
	        view: "main",
	        //下拉框表
	        modelName: "Configure",
	        //页面标题
	        name: "",
	        //下拉框初始化，在页面中的属性名
	        defaultRender: [{
	            key: "platform",
	            value: "platform"
	        }, {
	            key: "version",
	            value: "version"
	        }, {
	            key: "channel",
	            value: "channel"
	        }, {
	            key: "quan",
	            value: "coupon"
	        }]
	    }, options);
	    utils.mixin(this, defaultOption);
	    this.setRouter(Router);

	    return Router;
	}

	renderApi.prototype = {
	    constructor: renderApi,
	    _sendData: function _sendData(req, res, next) {
	        var _this = this;

	        cache.cacheGet(this.modelName, function (err, types) {
	            if (!err) {
	                if (types) {
	                    _this._renderData(res, {
	                        types: types
	                    });
	                } else {
	                    _this._findData(req, res, next);
	                }
	            } else {
	                next(err);
	            }
	        });
	    },
	    _findData: function _findData(req, res, next) {
	        var _this2 = this;

	        req.models[this.modelName].find({}, function (err, data) {
	            if (!err) {
	                var types = {};
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = (0, _getIterator3.default)(_this2.defaultRender), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var key = _step.value;

	                        types[key.value] = [];
	                        var _iteratorNormalCompletion2 = true;
	                        var _didIteratorError2 = false;
	                        var _iteratorError2 = undefined;

	                        try {
	                            for (var _iterator2 = (0, _getIterator3.default)(data), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                                var k = _step2.value;

	                                if (key.key === k.type) {
	                                    types[key.value].push(k.name);
	                                }
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

	                cache.cacheSet(_this2.modelName, types, cacheTime, function (err, success) {
	                    if (!err && success) {
	                        _this2._renderData(res, {
	                            types: types
	                        });
	                    } else {
	                        next(err);
	                    }
	                });
	            } else {
	                next(err);
	            }
	        });
	    },
	    _renderData: function _renderData(res, dataParams) {
	        res.render(this.view, {
	            pageTitle: this.name,
	            drop_down_default_data: dataParams.types,
	            defaultData: this.defaultData
	        });
	    },
	    setRouter: function setRouter(Router) {
	        Router.get(this.path, this._sendData.bind(this));
	        return Router;
	    }
	};

	module.exports = renderApi;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var path = __webpack_require__(79);
	var config = __webpack_require__(83);

	exports.unique = function (data) {
	    data = data || [];
	    var a = {},
	        i = 0,
	        len = data.length;
	    for (; i < len; i++) {
	        var v = data[i];
	        if ('undefined' === typeof a[v]) {
	            a[v] = 1;
	        }
	    }
	    data.length = 0;
	    for (i in a) {
	        if (a.hasOwnProperty(i)) {
	            data.push(i);
	        }
	    }
	    return data;
	};

	exports.checkFilePath = function (filepath, typelist, src) {
	    var param = filepath.match(/(^.+\?\?)|(.+$)/gi);
	    if (param) {
	        var types = new RegExp("[^\,]+\.(" + typelist + ")(?=$|[\,|\?])", "gi");
	        if (param[0]) {
	            var matched = path.normalize(param[0]).match(types);
	            if (matched) {
	                matched = exports.unique(matched);
	                var extension = matched.map(function (element) {
	                    var typeReg = new RegExp("(\)(" + typelist + ")");
	                    return element.match(typeReg)[2];
	                });
	                if (exports.unique(extension).length === 1) {
	                    var root = param[0].slice(0, -2);
	                    var files = matched.map(function (element) {
	                        var t = element.indexOf('?');
	                        element = t !== -1 ? element.slice(0, t) : element;
	                        return path.join(src + element);
	                    });
	                    return files;
	                }
	            }
	        }
	    }
	    return null;
	};

	exports.decode = function (province_code, city_code) {
	    var area = config.area,
	        province = '',
	        city = '';
	    for (var i = 0; i < area.length; i++) {
	        if (area[i].province_code === province_code) {
	            province = area[i].province;
	            for (var n = 0; n < area[i].cities.length; n++) {
	                if (area[i].cities[n].city_code === city_code) {
	                    city = area[i].cities[n].city;
	                }
	            }
	        }
	    }
	    return {
	        province: province,
	        city: city
	    };
	};

	exports.encode = function (province, city) {
	    var area = config.area,
	        province_code = '',
	        city_code = '';
	    for (var i = 0; i < area.length; i++) {
	        if (area[i].province === province) {
	            province_code = area[i].province_code;
	            for (var n = 0; n < area[i].cities.length; n++) {
	                if (area[i].cities[n].city === city) {
	                    city_code = area[i].cities[n].city_code;
	                }
	            }
	        }
	    }
	    return {
	        province_code: province_code,
	        city_code: city_code
	    };
	};

	exports.mixin = function (source, target) {
	    for (var i in target) {
	        if (target.hasOwnProperty(i)) {
	            source[i] = target[i];
	        }
	    }
	    return source;
	};

	exports.noop = function () {};

	/*更新session*/
	exports.updateSession = function (req, obj) {
	    var session = req.session;
	    if (session) {
	        for (var k in obj) {
	            if (obj.hasOwnProperty(k)) {
	                if (k in session) {
	                    session[k] = obj[k];
	                }
	            }
	        }
	    }
	};

	exports.uniq = function (dates) {
	    var result = [],
	        hash = {};
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var key = _step.value;

	            if (!hash[key]) {
	                result.push(key);
	                hash[key] = true;
	            }
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

	    return result;
	};

	exports.toTable = function (data, rows, cols) {
	    var newData = [];
	    for (var i = 0; i < data.length; i++) {
	        newData.push({
	            data: data[i],
	            rows: rows[i],
	            cols: cols[i]
	        });
	    }
	    return newData;
	};

	exports.sort = function (array, first, second) {
	    for (var i = 0; i < array.length; i++) {
	        var j = i,
	            key = array[i];
	        while (--j > -1) {
	            if (array[j][first] < key[first]) {
	                array[j + 1] = array[j];
	            } else if (array[j][first] === key[first]) {
	                if (array[j][second] < key[second]) {
	                    array[j + 1] = array[j];
	                } else {
	                    break;
	                }
	            } else {
	                break;
	            }
	        }
	        array[j + 1] = key;
	    }
	    return array;
	};

	exports.toFixed = function (one, two) {
	    return (one / (two === 0 ? 1 : two) * 100).toFixed(2) + "%";
	};

	exports.getDate = function (date) {
	    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	};

	exports.times = function (startTime, endTime) {
	    var start = new Date(startTime).getTime(),
	        end = new Date(endTime).getTime(),
	        array = [];
	    while (start <= end) {
	        array.push(exports.getDate(new Date(start)));
	        start = start + 24 * 60 * 60 * 1000;
	    }
	    return array;
	};

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = {
		"area": [
			{
				"province": "北京市",
				"cities": [
					{
						"city": "北京市",
						"city_code": "110000"
					}
				],
				"province_code": "11000"
			},
			{
				"province": "天津市",
				"cities": [
					{
						"city": "天津市",
						"city_code": "120000"
					}
				],
				"province_code": "12000"
			},
			{
				"province": "河北省",
				"cities": [
					{
						"city": "石家庄市",
						"city_code": "130100"
					},
					{
						"city": "唐山市",
						"city_code": "130200"
					},
					{
						"city": "秦皇岛市",
						"city_code": "130300"
					},
					{
						"city": "邯郸市",
						"city_code": "130400"
					},
					{
						"city": "邢台市",
						"city_code": "130500"
					},
					{
						"city": "保定市",
						"city_code": "130600"
					},
					{
						"city": "张家口市",
						"city_code": "130700"
					},
					{
						"city": "承德市",
						"city_code": "130800"
					},
					{
						"city": "沧州市",
						"city_code": "130900"
					},
					{
						"city": "廊坊市",
						"city_code": "131000"
					},
					{
						"city": "衡水市",
						"city_code": "131100"
					}
				],
				"province_code": "13000"
			},
			{
				"province": " 山西省",
				"cities": [
					{
						"city": "太原市",
						"city_code": "140100"
					},
					{
						"city": "大同市",
						"city_code": "140200"
					},
					{
						"city": "阳泉市",
						"city_code": "140300"
					},
					{
						"city": "长治市",
						"city_code": "140400"
					},
					{
						"city": "晋城市",
						"city_code": "140500"
					},
					{
						"city": "朔州市",
						"city_code": "140600"
					},
					{
						"city": "晋中市",
						"city_code": "140700"
					},
					{
						"city": "运城市",
						"city_code": "140800"
					},
					{
						"city": "忻州市",
						"city_code": "140900"
					},
					{
						"city": "临汾市",
						"city_code": "141000"
					},
					{
						"city": "吕梁市",
						"city_code": "141100"
					}
				],
				"province_code": "14000"
			},
			{
				"province": "内蒙古",
				"cities": [
					{
						"city": "呼和浩特市",
						"city_code": "150100"
					},
					{
						"city": "包头市",
						"city_code": "150200"
					},
					{
						"city": "乌海市",
						"city_code": "150300"
					},
					{
						"city": "赤峰市",
						"city_code": "150400"
					},
					{
						"city": "通辽市",
						"city_code": "150500"
					},
					{
						"city": "鄂尔多斯市",
						"city_code": "150600"
					},
					{
						"city": "呼伦贝尔市",
						"city_code": "150700"
					},
					{
						"city": "巴彦淖尔市",
						"city_code": "150800"
					},
					{
						"city": "乌兰察布市",
						"city_code": "150900"
					},
					{
						"city": "兴安盟",
						"city_code": "152200"
					},
					{
						"city": "锡林郭勒盟",
						"city_code": "152500"
					},
					{
						"city": "阿拉善盟",
						"city_code": "152900"
					}
				],
				"province_code": "15000"
			},
			{
				"province": "辽宁省",
				"cities": [
					{
						"city": "沈阳市",
						"city_code": "210100"
					},
					{
						"city": "大连市",
						"city_code": "210200"
					},
					{
						"city": "鞍山市",
						"city_code": "210300"
					},
					{
						"city": "抚顺市",
						"city_code": "210400"
					},
					{
						"city": "本溪市",
						"city_code": "210500"
					},
					{
						"city": "丹东市",
						"city_code": "210600"
					},
					{
						"city": "锦州市",
						"city_code": "210700"
					},
					{
						"city": "营口市",
						"city_code": "210800"
					},
					{
						"city": "阜新市",
						"city_code": "210900"
					},
					{
						"city": "辽阳市",
						"city_code": "211000"
					},
					{
						"city": "盘锦市",
						"city_code": "211100"
					},
					{
						"city": "铁岭市",
						"city_code": "211200"
					},
					{
						"city": "朝阳市",
						"city_code": "211300"
					},
					{
						"city": "葫芦岛市",
						"city_code": "211400"
					}
				],
				"province_code": "21000"
			},
			{
				"province": "吉林省",
				"cities": [
					{
						"city": "长春市",
						"city_code": "220100"
					},
					{
						"city": "吉林市",
						"city_code": "220200"
					},
					{
						"city": "四平市",
						"city_code": "220300"
					},
					{
						"city": "辽源市",
						"city_code": "220400"
					},
					{
						"city": "通化市",
						"city_code": "220500"
					},
					{
						"city": "白山市",
						"city_code": "220600"
					},
					{
						"city": "松原市",
						"city_code": "220700"
					},
					{
						"city": "白城市",
						"city_code": "220800"
					},
					{
						"city": "延边州",
						"city_code": "222400"
					}
				],
				"province_code": "22000"
			},
			{
				"province": "黑龙江省",
				"cities": [
					{
						"city": "哈尔滨市",
						"city_code": "230100"
					},
					{
						"city": "齐齐哈尔市",
						"city_code": "230200"
					},
					{
						"city": "鸡西市",
						"city_code": "230300"
					},
					{
						"city": "鹤岗市",
						"city_code": "230400"
					},
					{
						"city": "双鸭山市",
						"city_code": "230500"
					},
					{
						"city": "大庆市",
						"city_code": "230600"
					},
					{
						"city": "伊春市",
						"city_code": "230700"
					},
					{
						"city": "佳木斯市",
						"city_code": "230800"
					},
					{
						"city": "七台河市",
						"city_code": "230900"
					},
					{
						"city": "牡丹江市",
						"city_code": "231000"
					},
					{
						"city": "黑河市",
						"city_code": "231100"
					},
					{
						"city": "绥化市",
						"city_code": "231200"
					},
					{
						"city": "大兴安岭地区",
						"city_code": "232700"
					}
				],
				"province_code": "23000"
			},
			{
				"province": "上海市",
				"cities": [
					{
						"city": "上海市",
						"city_code": "310000"
					}
				],
				"province_code": "31000"
			},
			{
				"province": "江苏省",
				"cities": [
					{
						"city": "南京市",
						"city_code": "320100"
					},
					{
						"city": "无锡市",
						"city_code": "320200"
					},
					{
						"city": "徐州市",
						"city_code": "320300"
					},
					{
						"city": "常州市",
						"city_code": "320400"
					},
					{
						"city": "苏州市",
						"city_code": "320500"
					},
					{
						"city": "南通市",
						"city_code": "320600"
					},
					{
						"city": "连云港市",
						"city_code": "320700"
					},
					{
						"city": "淮安市",
						"city_code": "320800"
					},
					{
						"city": "盐城市",
						"city_code": "320900"
					},
					{
						"city": "扬州市",
						"city_code": "321000"
					},
					{
						"city": "镇江市",
						"city_code": "321100"
					},
					{
						"city": "泰州市",
						"city_code": "321200"
					},
					{
						"city": "宿迁市",
						"city_code": "321300"
					}
				],
				"province_code": "32000"
			},
			{
				"province": "浙江省",
				"cities": [
					{
						"city": "杭州市",
						"city_code": "330100"
					},
					{
						"city": "宁波市",
						"city_code": "330200"
					},
					{
						"city": "温州市",
						"city_code": "330300"
					},
					{
						"city": "嘉兴市",
						"city_code": "330400"
					},
					{
						"city": "湖州市",
						"city_code": "330500"
					},
					{
						"city": "绍兴市",
						"city_code": "330600"
					},
					{
						"city": "金华市",
						"city_code": "330700"
					},
					{
						"city": "衢州市",
						"city_code": "330800"
					},
					{
						"city": "舟山市",
						"city_code": "330900"
					},
					{
						"city": "台州市",
						"city_code": "331000"
					},
					{
						"city": "丽水市",
						"city_code": "331100"
					}
				],
				"province_code": "33000"
			},
			{
				"province": "安徽省",
				"cities": [
					{
						"city": "合肥市",
						"city_code": "340100"
					},
					{
						"city": "巢湖市",
						"city_code": "340181"
					},
					{
						"city": "芜湖市",
						"city_code": "340200"
					},
					{
						"city": "蚌埠市",
						"city_code": "340300"
					},
					{
						"city": "淮南市",
						"city_code": "340400"
					},
					{
						"city": "马鞍山市",
						"city_code": "340500"
					},
					{
						"city": "淮北市",
						"city_code": "340600"
					},
					{
						"city": "铜陵市",
						"city_code": "340700"
					},
					{
						"city": "安庆市",
						"city_code": "340800"
					},
					{
						"city": "黄山市",
						"city_code": "341000"
					},
					{
						"city": "滁州市",
						"city_code": "341100"
					},
					{
						"city": "阜阳市",
						"city_code": "341200"
					},
					{
						"city": "宿州市",
						"city_code": "341300"
					},
					{
						"city": "六安市",
						"city_code": "341500"
					},
					{
						"city": "亳州市",
						"city_code": "341600"
					},
					{
						"city": "池州市",
						"city_code": "341700"
					},
					{
						"city": "宣城市",
						"city_code": "341800"
					}
				],
				"province_code": "34000"
			},
			{
				"province": "福建省",
				"cities": [
					{
						"city": "福州市",
						"city_code": "350100"
					},
					{
						"city": "厦门市",
						"city_code": "350200"
					},
					{
						"city": "莆田市",
						"city_code": "350300"
					},
					{
						"city": "三明市",
						"city_code": "350400"
					},
					{
						"city": "泉州市",
						"city_code": "350500"
					},
					{
						"city": "漳州市",
						"city_code": "350600"
					},
					{
						"city": "南平市",
						"city_code": "350700"
					},
					{
						"city": "龙岩市",
						"city_code": "350800"
					},
					{
						"city": "宁德市",
						"city_code": "350900"
					}
				],
				"province_code": "35000"
			},
			{
				"province": "江西省",
				"cities": [
					{
						"city": "南昌市",
						"city_code": "360100"
					},
					{
						"city": "景德镇市",
						"city_code": "360200"
					},
					{
						"city": "萍乡市",
						"city_code": "360300"
					},
					{
						"city": "九江市",
						"city_code": "360400"
					},
					{
						"city": "新余市",
						"city_code": "360500"
					},
					{
						"city": "鹰谭市",
						"city_code": "360600"
					},
					{
						"city": "赣州市",
						"city_code": "360700"
					},
					{
						"city": "吉安市",
						"city_code": "360800"
					},
					{
						"city": "宜春市",
						"city_code": "360900"
					},
					{
						"city": "抚州市",
						"city_code": "361000"
					},
					{
						"city": "上饶市",
						"city_code": "361100"
					}
				],
				"province_code": "36000"
			},
			{
				"province": "山东省",
				"cities": [
					{
						"city": "济南市",
						"city_code": "370100"
					},
					{
						"city": "青岛市",
						"city_code": "370200"
					},
					{
						"city": "淄博市",
						"city_code": "370300"
					},
					{
						"city": "枣庄市",
						"city_code": "370400"
					},
					{
						"city": "东营市",
						"city_code": "370500"
					},
					{
						"city": "烟台市",
						"city_code": "370600"
					},
					{
						"city": "潍坊市",
						"city_code": "370700"
					},
					{
						"city": "济宁市",
						"city_code": "370800"
					},
					{
						"city": "泰安市",
						"city_code": "370900"
					},
					{
						"city": "威海市",
						"city_code": "371000"
					},
					{
						"city": "日照市",
						"city_code": "371100"
					},
					{
						"city": "莱芜市",
						"city_code": "371200"
					},
					{
						"city": "临沂市",
						"city_code": "371300"
					},
					{
						"city": "德州市",
						"city_code": "371400"
					},
					{
						"city": "聊城市",
						"city_code": "371500"
					},
					{
						"city": "滨州市",
						"city_code": "371600"
					},
					{
						"city": "菏泽市",
						"city_code": "371700"
					}
				],
				"province_code": "37000"
			},
			{
				"province": "河南省",
				"cities": [
					{
						"city": "郑州市",
						"city_code": "410100"
					},
					{
						"city": "开封市",
						"city_code": "410200"
					},
					{
						"city": "洛阳市",
						"city_code": "410300"
					},
					{
						"city": "平顶山市",
						"city_code": "410400"
					},
					{
						"city": "安阳市",
						"city_code": "410500"
					},
					{
						"city": "鹤壁市",
						"city_code": "410600"
					},
					{
						"city": "新乡市",
						"city_code": "410700"
					},
					{
						"city": "焦作市",
						"city_code": "410800"
					},
					{
						"city": "濮阳市",
						"city_code": "410900"
					},
					{
						"city": "许昌市",
						"city_code": "411000"
					},
					{
						"city": "漯河市",
						"city_code": "411100"
					},
					{
						"city": "三门峡市",
						"city_code": "411200"
					},
					{
						"city": "南阳市",
						"city_code": "411300"
					},
					{
						"city": "商丘市",
						"city_code": "411400"
					},
					{
						"city": "信阳市",
						"city_code": "411500"
					},
					{
						"city": "周口市",
						"city_code": "411600"
					},
					{
						"city": "驻马店市",
						"city_code": "411700"
					}
				],
				"province_code": "41000"
			},
			{
				"province": "湖北省",
				"cities": [
					{
						"city": "武汉市",
						"city_code": "420100"
					},
					{
						"city": "黄石市",
						"city_code": "420200"
					},
					{
						"city": "十堰市",
						"city_code": "420300"
					},
					{
						"city": "宜昌市",
						"city_code": "420500"
					},
					{
						"city": "襄樊市",
						"city_code": "420600"
					},
					{
						"city": "鄂州市",
						"city_code": "420700"
					},
					{
						"city": "荆门市",
						"city_code": "420800"
					},
					{
						"city": "孝感市",
						"city_code": "420900"
					},
					{
						"city": "荆州市",
						"city_code": "421000"
					},
					{
						"city": "黄冈市",
						"city_code": "421100"
					},
					{
						"city": "咸宁市",
						"city_code": "421200"
					},
					{
						"city": "随州市",
						"city_code": "421300"
					},
					{
						"city": "恩施州",
						"city_code": "422800"
					}
				],
				"province_code": "42000"
			},
			{
				"province": "湖南省",
				"cities": [
					{
						"city": "长沙市",
						"city_code": "430100"
					},
					{
						"city": "株州市",
						"city_code": "430200"
					},
					{
						"city": "湘潭市",
						"city_code": "430300"
					},
					{
						"city": "衡阳市",
						"city_code": "430400"
					},
					{
						"city": "邵阳市",
						"city_code": "430500"
					},
					{
						"city": "岳阳市",
						"city_code": "430600"
					},
					{
						"city": "常德市",
						"city_code": "430700"
					},
					{
						"city": "张家界市",
						"city_code": "430800"
					},
					{
						"city": "益阳市",
						"city_code": "430900"
					},
					{
						"city": "郴州市",
						"city_code": "431000"
					},
					{
						"city": "永州市",
						"city_code": "431100"
					},
					{
						"city": "怀化市",
						"city_code": "431200"
					},
					{
						"city": "娄底市",
						"city_code": "431300"
					},
					{
						"city": "吉首市",
						"city_code": "433101"
					}
				],
				"province_code": "43000"
			},
			{
				"province": "广东省",
				"cities": [
					{
						"city": "广州市",
						"city_code": "440100"
					},
					{
						"city": "韶关市",
						"city_code": "440200"
					},
					{
						"city": "深圳市",
						"city_code": "440300"
					},
					{
						"city": "珠海市",
						"city_code": "440400"
					},
					{
						"city": "汕头市",
						"city_code": "440500"
					},
					{
						"city": "佛山市",
						"city_code": "440600"
					},
					{
						"city": "江门市",
						"city_code": "440700"
					},
					{
						"city": "湛江市",
						"city_code": "440800"
					},
					{
						"city": "茂名市",
						"city_code": "440900"
					},
					{
						"city": "肇庆市",
						"city_code": "441200"
					},
					{
						"city": "惠州市",
						"city_code": "441300"
					},
					{
						"city": "梅州市",
						"city_code": "441400"
					},
					{
						"city": "汕尾市",
						"city_code": "441500"
					},
					{
						"city": "河源市",
						"city_code": "441600"
					},
					{
						"city": "阳江市",
						"city_code": "441700"
					},
					{
						"city": "清远市",
						"city_code": "441800"
					},
					{
						"city": "东莞市",
						"city_code": "441900"
					},
					{
						"city": "中山市",
						"city_code": "442000"
					},
					{
						"city": "潮州市",
						"city_code": "445100"
					},
					{
						"city": "揭阳市",
						"city_code": "445200"
					},
					{
						"city": "云浮市",
						"city_code": "445300"
					}
				],
				"province_code": "44000"
			},
			{
				"province": "广西",
				"cities": [
					{
						"city": "南宁市",
						"city_code": "450100"
					},
					{
						"city": "柳州市",
						"city_code": "450200"
					},
					{
						"city": "桂林市",
						"city_code": "450300"
					},
					{
						"city": "梧州市",
						"city_code": "450400"
					},
					{
						"city": "北海市",
						"city_code": "450500"
					},
					{
						"city": "防城港市",
						"city_code": "450600"
					},
					{
						"city": "钦州市",
						"city_code": "450700"
					},
					{
						"city": "贵港市",
						"city_code": "450800"
					},
					{
						"city": "玉林市",
						"city_code": "450900"
					},
					{
						"city": "百色市",
						"city_code": "451000"
					},
					{
						"city": "贺州市",
						"city_code": "451100"
					},
					{
						"city": "河池市",
						"city_code": "451200"
					},
					{
						"city": "来宾市",
						"city_code": "451300"
					},
					{
						"city": "崇左市",
						"city_code": "451400"
					}
				],
				"province_code": "45000"
			},
			{
				"province": "海南省",
				"cities": [
					{
						"city": "海口市",
						"city_code": "460100"
					},
					{
						"city": "三亚市",
						"city_code": "460200"
					}
				],
				"province_code": "46000"
			},
			{
				"province": "重庆市",
				"cities": [
					{
						"city": "重庆市",
						"city_code": "500000"
					},
					{
						"city": "万州市",
						"city_code": "500101"
					},
					{
						"city": "涪陵市",
						"city_code": "500102"
					},
					{
						"city": "黔江市",
						"city_code": "500114"
					}
				],
				"province_code": "50000"
			},
			{
				"province": "四川省",
				"cities": [
					{
						"city": "成都市",
						"city_code": "510100"
					},
					{
						"city": "自贡市",
						"city_code": "510300"
					},
					{
						"city": "攀枝花市",
						"city_code": "510400"
					},
					{
						"city": "泸州市",
						"city_code": "510500"
					},
					{
						"city": "德阳市",
						"city_code": "510600"
					},
					{
						"city": "绵阳市",
						"city_code": "510700"
					},
					{
						"city": "广元市",
						"city_code": "510800"
					},
					{
						"city": "遂宁市",
						"city_code": "510900"
					},
					{
						"city": "内江市",
						"city_code": "511000"
					},
					{
						"city": "乐山市",
						"city_code": "511100"
					},
					{
						"city": "南充市",
						"city_code": "511300"
					},
					{
						"city": "眉山市",
						"city_code": "511400"
					},
					{
						"city": "宜宾市",
						"city_code": "511500"
					},
					{
						"city": "广安市",
						"city_code": "511600"
					},
					{
						"city": "达州市",
						"city_code": "511700"
					},
					{
						"city": "雅安市",
						"city_code": "511800"
					},
					{
						"city": "巴中市",
						"city_code": "511900"
					},
					{
						"city": "资阳市",
						"city_code": "512000"
					},
					{
						"city": "阿坝州",
						"city_code": "513200"
					},
					{
						"city": "甘孜州",
						"city_code": "513300"
					},
					{
						"city": "凉山州",
						"city_code": "513400"
					}
				],
				"province_code": "51000"
			},
			{
				"province": "贵州省",
				"cities": [
					{
						"city": "贵阳市",
						"city_code": "520100"
					},
					{
						"city": "六盘水市",
						"city_code": "520200"
					},
					{
						"city": "遵义市",
						"city_code": "520300"
					},
					{
						"city": "安顺市",
						"city_code": "520400"
					},
					{
						"city": "毕节地区",
						"city_code": "520500"
					},
					{
						"city": "铜仁地区",
						"city_code": "520600"
					},
					{
						"city": "黔西南州",
						"city_code": "522300"
					},
					{
						"city": "黔东南州",
						"city_code": "522600"
					},
					{
						"city": "黔南州",
						"city_code": "522700"
					}
				],
				"province_code": "52000"
			},
			{
				"province": "云南省",
				"cities": [
					{
						"city": "昆明市",
						"city_code": "530100"
					},
					{
						"city": "曲靖市",
						"city_code": "530300"
					},
					{
						"city": "玉溪市",
						"city_code": "530400"
					},
					{
						"city": "保山市",
						"city_code": "530500"
					},
					{
						"city": "昭通市",
						"city_code": "530600"
					},
					{
						"city": "丽江市",
						"city_code": "530700"
					},
					{
						"city": "思茅市",
						"city_code": "530800"
					},
					{
						"city": "临沧市",
						"city_code": "530900"
					},
					{
						"city": "楚雄州",
						"city_code": "532300"
					},
					{
						"city": "红河州",
						"city_code": "532500"
					},
					{
						"city": "文山州",
						"city_code": "532600"
					},
					{
						"city": "西双版纳州",
						"city_code": "532800"
					},
					{
						"city": "大理州",
						"city_code": "532900"
					},
					{
						"city": "德宏州",
						"city_code": "533100"
					},
					{
						"city": "怒江州",
						"city_code": "533300"
					},
					{
						"city": "迪庆州",
						"city_code": "533400"
					}
				],
				"province_code": "53000"
			},
			{
				"province": "西藏",
				"cities": [
					{
						"city": "拉萨市",
						"city_code": "540100"
					},
					{
						"city": "昌都地区",
						"city_code": "542100"
					},
					{
						"city": "山南地区",
						"city_code": "542200"
					},
					{
						"city": "日喀则地区",
						"city_code": "542300"
					},
					{
						"city": "那曲地区",
						"city_code": "542400"
					},
					{
						"city": "阿里地区",
						"city_code": "542500"
					},
					{
						"city": "林芝地区",
						"city_code": "542600"
					}
				],
				"province_code": "54000"
			},
			{
				"province": "陕西省",
				"cities": [
					{
						"city": "西安市",
						"city_code": "610100"
					},
					{
						"city": "铜川市",
						"city_code": "610200"
					},
					{
						"city": "宝鸡市",
						"city_code": "610300"
					},
					{
						"city": "咸阳市",
						"city_code": "610400"
					},
					{
						"city": "渭南市",
						"city_code": "610500"
					},
					{
						"city": "延安市",
						"city_code": "610600"
					},
					{
						"city": "汉中市",
						"city_code": "610700"
					},
					{
						"city": "榆林市",
						"city_code": "610800"
					},
					{
						"city": "安康市",
						"city_code": "610900"
					},
					{
						"city": "商洛市",
						"city_code": "611000"
					}
				],
				"province_code": "61000"
			},
			{
				"province": "甘肃省",
				"cities": [
					{
						"city": "兰州市",
						"city_code": "620100"
					},
					{
						"city": "嘉峪关市",
						"city_code": "620200"
					},
					{
						"city": "金昌市",
						"city_code": "620300"
					},
					{
						"city": "白银市",
						"city_code": "620400"
					},
					{
						"city": "天水市",
						"city_code": "620500"
					},
					{
						"city": "武威市",
						"city_code": "620600"
					},
					{
						"city": "张掖市",
						"city_code": "620700"
					},
					{
						"city": "平凉市",
						"city_code": "620800"
					},
					{
						"city": "酒泉市",
						"city_code": "620900"
					},
					{
						"city": "庆阳市",
						"city_code": "621000"
					},
					{
						"city": "定西市",
						"city_code": "621100"
					},
					{
						"city": "陇南市",
						"city_code": "621200"
					},
					{
						"city": "临夏州",
						"city_code": "622900"
					},
					{
						"city": "甘南州",
						"city_code": "623000"
					}
				],
				"province_code": "62000"
			},
			{
				"province": "青海省",
				"cities": [
					{
						"city": "西宁市",
						"city_code": "630100"
					},
					{
						"city": "海东地区",
						"city_code": "632100"
					},
					{
						"city": "海北藏族自治州",
						"city_code": "632200"
					},
					{
						"city": "黄南藏族自治州",
						"city_code": "632300"
					},
					{
						"city": "海南藏族自治州",
						"city_code": "632500"
					},
					{
						"city": "果洛藏族自治州",
						"city_code": "632600"
					},
					{
						"city": "玉树藏族自治州",
						"city_code": "632700"
					},
					{
						"city": "海西蒙古族藏族自治州",
						"city_code": "632800"
					}
				],
				"province_code": "63000"
			},
			{
				"province": "宁夏",
				"cities": [
					{
						"city": "银川市",
						"city_code": "640100"
					},
					{
						"city": "石嘴山市",
						"city_code": "640200"
					},
					{
						"city": "吴忠市",
						"city_code": "640300"
					},
					{
						"city": "固原市",
						"city_code": "640400"
					},
					{
						"city": "中卫市",
						"city_code": "640500"
					}
				],
				"province_code": "64000"
			},
			{
				"province": "新疆",
				"cities": [
					{
						"city": "乌鲁木齐市",
						"city_code": "650100"
					},
					{
						"city": "克拉玛依市",
						"city_code": "650200"
					},
					{
						"city": "吐鲁番地区",
						"city_code": "652100"
					},
					{
						"city": "哈密地区",
						"city_code": "652200"
					},
					{
						"city": "昌吉回族自治州",
						"city_code": "652300"
					},
					{
						"city": "博尔塔拉蒙古自治州",
						"city_code": "652700"
					},
					{
						"city": "巴音郭楞蒙古自治州",
						"city_code": "652800"
					},
					{
						"city": "阿克苏地区",
						"city_code": "652900"
					},
					{
						"city": "克孜勒苏柯尔克孜自治州",
						"city_code": "653000"
					},
					{
						"city": "喀什地区",
						"city_code": "653100"
					},
					{
						"city": "和田地区",
						"city_code": "653200"
					},
					{
						"city": "伊犁哈萨克自治州",
						"city_code": "654000"
					},
					{
						"city": "塔城地区",
						"city_code": "654200"
					},
					{
						"city": "阿勒泰地区",
						"city_code": "654300"
					},
					{
						"city": "石河子市",
						"city_code": "659001"
					}
				],
				"province_code": "65000"
			}
		]
	};

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @author yanglei
	 * @fileoverview cache data
	 * @date 20151218
	 */

	var NodeCache = __webpack_require__(86);
	var myCache = new NodeCache();

	module.exports = {
	    //查询缓存数据
	    cacheGet: function cacheGet(key, cb) {
	        myCache.get(key, function (err, value) {
	            if (!err) {
	                cb(null, value);
	            } else {
	                cb(err);
	            }
	        });
	    },
	    //设置缓存数据
	    cacheSet: function cacheSet(key, value, ttl, cb) {
	        myCache.set(key, value, ttl, function (err, success) {
	            if (!err && success) {
	                cb(null, success);
	            } else {
	                cb(err);
	            }
	        });
	    }
	};

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = require("node-cache");

/***/ },
/* 87 */
/***/ function(module, exports) {

	module.exports = require("rd");

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./achievements/index.js": 89,
		"./businessRebate/index.js": 137,
		"./channelAnalysis/index.js": 140,
		"./dataOverview/index.js": 142,
		"./dataOverview/wap.js": 144,
		"./marketingAnalysis/activityFlow.js": 145,
		"./marketingAnalysis/couponInfo.js": 147,
		"./marketingAnalysis/index.js": 149,
		"./platformRebate/index.js": 151,
		"./platformRebate/individualEvent.js": 153,
		"./platformRebate/inviteBusiness.js": 155,
		"./platformRebate/inviteRegisterAndEnter.js": 157,
		"./platformRebate/platformBasis.js": 159,
		"./platformRebate/platformPromotions.js": 161,
		"./retainedAnalysis/index.js": 163,
		"./share/index.js": 165,
		"./share/outer.js": 167,
		"./terminal/index.js": 169,
		"./terminal/network.js": 171,
		"./terminal/provinces.js": 173,
		"./useAnalysis/accessPage.js": 175,
		"./useAnalysis/accessPageNum.js": 177,
		"./useAnalysis/accessWap.js": 179,
		"./useAnalysis/index.js": 181,
		"./useAnalysis/useFrequency.js": 183,
		"./userAnalysis/activeAccount.js": 185,
		"./userAnalysis/index.js": 187,
		"./userAnalysis/startUp.js": 188,
		"./userAnalysis/version.js": 189
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 88;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160415
	 * @fileoverview 店铺分析
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(136);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/achievements/shopOne",
	        modelName: ["ShopList"],
	        platform: false,
	        filter_select: [{
	            title: '',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'shop_new_num',
	                value: '新增注册店铺'
	            }, {
	                key: 'shop_succ_num',
	                value: '成功入驻店铺'
	            }, {
	                key: 'shop_order_succ_num',
	                value: '成功交易店铺'
	            }, {
	                key: 'shop_access_num',
	                value: '被访问店铺数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.shopOne(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/achievements/shopTwo",
	        modelName: ["ShopList"],
	        platform: false,
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.shopTwo(data, dates);
	        },

	        rows: [['date', 'shop_new_num', 'shop_succ_num', 'shop_total_num', 'shop_order_num', 'shop_order_succ_num', 'shop_access_num', 'shop_share_num']],
	        cols: [[{
	            caption: '时间',
	            type: 'string',
	            width: 20
	        }, {
	            caption: '新增注册店铺',
	            type: 'number'
	        }, {
	            caption: '成功入驻店铺',
	            type: 'number'
	        }, {
	            caption: '累计店铺数',
	            type: 'number'
	        }, {
	            caption: '生成订单店铺数',
	            type: 'number'
	        }, {
	            caption: '成功交易店铺数',
	            type: 'number'
	        }, {
	            caption: '被访问的店铺数',
	            type: 'number'
	        }, {
	            caption: '被分享的店铺数',
	            type: 'number'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/achievements/shopThree",
	        modelName: ["ShopTop"],
	        platform: false,
	        excel_export: true,
	        date_picker_data: 1,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.shopThree(data);
	        },

	        rows: [['top', 'shop_name', 'access_num', 'access_num_rate', 'access_users', 'access_users_rate', 'share_commodity_num']],
	        cols: [[{
	            caption: '排名',
	            type: 'number'
	        }, {
	            caption: '店铺名称',
	            type: 'string'
	        }, {
	            caption: '浏览量',
	            type: 'number'
	        }, {
	            caption: '浏览量占比',
	            type: 'string'
	        }, {
	            caption: '访客数',
	            type: 'number'
	        }, {
	            caption: '访客数占比',
	            type: 'string'
	        }, {
	            caption: '被分享商品数',
	            type: 'number'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/achievements/shopFour",
	        modelName: ["ShopTop"],
	        platform: false,
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.shopFour(data);
	        },

	        filter_select: [{
	            title: '',
	            filter_key: 'filter_key',
	            groups: [{
	                key: '1',
	                value: '合并SKU'
	            }, {
	                key: '2',
	                value: 'SKU'
	            }]
	        }],
	        rows: [['top', 'shop_name', 'pay_price', 'pay_price_rate', 'pay_commodity_num', 'pay_commodity_rate', 'share_commodity_num']],
	        cols: [[{
	            caption: '排名',
	            type: 'number'
	        }, {
	            caption: '店铺名称',
	            type: 'string'
	        }, {
	            caption: '支付金额',
	            type: 'number'
	        }, {
	            caption: '支付金额占比',
	            type: 'string'
	        }, {
	            caption: '支付商品数',
	            type: 'number'
	        }, {
	            caption: '支付商品数占比',
	            type: 'string'
	        }, {
	            caption: '被分享商品数',
	            type: 'number'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _promise = __webpack_require__(91);

	var _promise2 = _interopRequireDefault(_promise);

	var _regenerator = __webpack_require__(109);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _asyncToGenerator2 = __webpack_require__(131);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160324
	 * @fileoverview 统一接口
	 */
	var utils = __webpack_require__(82),
	    cache = __webpack_require__(85),
	    cacheName = "Configure",
	    excelExport = __webpack_require__(132),
	    nodeExcel = __webpack_require__(133),
	    validator = __webpack_require__(134),
	    orm = __webpack_require__(135),
	    cacheTime = 1;

	function api(Router, options) {
	    var defaultOption = utils.mixin({
	        //路由
	        router: "",
	        //数据库
	        modelName: [],
	        //固定参数
	        fixedParams: {},
	        //固定查询数据库参数
	        params: null,
	        //固定查询数据库参数
	        orderParams: null,
	        //行
	        rows: [],
	        //列
	        cols: [],
	        //初始化数据
	        default: {
	            day_type: 1
	        },
	        //是否显示平台
	        platform: true,
	        //是否显示渠道
	        channel: false,
	        //是否显示版本
	        version: false,
	        //是否显示优惠券类型
	        coupon: false,
	        //是否有导出路径
	        excel_export: false,
	        //按钮设置
	        flexible_btn: [],
	        //是否显示时间
	        date_picker: true,
	        //初始时间
	        date_picker_data: 7,
	        //联动菜单
	        level_select: false,
	        //单选
	        filter_select: [],
	        //过滤数据
	        filter: null,
	        //参数名对应字段名
	        defaultRender: [{
	            key: "platform",
	            value: "type"
	        }, {
	            key: "version",
	            value: "ver"
	        }, {
	            key: "channel",
	            value: "channel"
	        }, {
	            key: "coupon",
	            value: "coupon_type"
	        }],
	        //下拉框初始化，在页面中的属性名
	        defaultCache: [{
	            key: "platform",
	            value: "platform"
	        }, {
	            key: "version",
	            value: "version"
	        }, {
	            key: "channel",
	            value: "channel"
	        }, {
	            key: "quan",
	            value: "coupon"
	        }]
	    }, options);

	    utils.mixin(this, defaultOption);

	    this.setDefaultOptionDate(Router);
	    this.setRouter(Router);

	    return Router;
	}

	api.prototype = {
	    constructor: api,
	    setDefaultOptionDate: function setDefaultOptionDate() {
	        var now = new Date();
	        var date = new Date(now.getTime() - 7 * 24 * 60 * 1000);
	        var startTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	        var endTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
	        this.default.date = orm.between(new Date(startTime + ' 00:00:00'), new Date(endTime + ' 23:59:59'));
	        if (this.platform) {
	            this.default.type = "H5";
	        }
	        if (this.channel) {
	            this.default.channel = "百度";
	        }
	        if (this.version) {
	            this.default.ver = "1.0.0";
	        }
	        if (this.coupon) {
	            this.default.coupon_type = "平台优惠券";
	        }
	    },
	    _sendData: function _sendData(type, req, res, next) {
	        var _this = this;

	        var query = req.query,
	            params = {},
	            dates = [];
	        if (!query.startTime && !query.endTime) {
	            params = this.default;
	        } else {
	            if (this._checkDate(query.startTime, "startTime参数出错", next) && this._checkDate(query.endTime, "endTime参数出错", next)) {
	                params.date = orm.between(new Date(query.startTime + " 00:00:00"), new Date(query.endTime + " 23:59:59"));
	                dates = utils.times(query.startTime, query.endTime);
	            }
	        }
	        (0, _keys2.default)(query).forEach(function (key) {
	            if (key.indexOf("filter") > -1) {
	                _this[key] = query[key];
	                delete query[key];
	            }
	            if (key === "key_type") {
	                _this[key] = query[key];
	            }
	        });
	        (0, _keys2.default)(this.fixedParams).forEach(function (key) {
	            query[key] = _this.fixedParams[key];
	        });
	        if (this.params) {
	            params = this.params;
	        }
	        this._getCache(type, res, req, query, next, params, dates);
	    },
	    _checkDate: function _checkDate(option, errorMassage, next) {
	        if (!validator.isDate(option)) {
	            next(new Error(errorMassage));
	            return false;
	        }
	        return true;
	    },
	    _getCache: function _getCache(type, res, req, query, next, params, dates) {
	        var _this2 = this;

	        cache.cacheGet(cacheName, function (err, cacheData) {
	            if (!err) {
	                if (cacheData) {
	                    if (_this2._checkQuery(query, cacheData, next, params)) {
	                        _this2._findData(type, res, req, params, next, dates);
	                    }
	                } else {
	                    cacheData = {};
	                    (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
	                        var data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, k;

	                        return _regenerator2.default.wrap(function _callee$(_context) {
	                            while (1) {
	                                switch (_context.prev = _context.next) {
	                                    case 0:
	                                        _context.next = 2;
	                                        return _this2._findDatabase(req, cacheName, {}).catch(function (err) {
	                                            next(err);
	                                        });

	                                    case 2:
	                                        data = _context.sent;
	                                        _iteratorNormalCompletion = true;
	                                        _didIteratorError = false;
	                                        _iteratorError = undefined;
	                                        _context.prev = 6;
	                                        _iterator = (0, _getIterator3.default)(_this2.defaultCache);

	                                    case 8:
	                                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	                                            _context.next = 33;
	                                            break;
	                                        }

	                                        key = _step.value;

	                                        cacheData[key.value] = [];
	                                        _iteratorNormalCompletion2 = true;
	                                        _didIteratorError2 = false;
	                                        _iteratorError2 = undefined;
	                                        _context.prev = 14;
	                                        for (_iterator2 = (0, _getIterator3.default)(data); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                                            k = _step2.value;

	                                            if (k.type === key.key) {
	                                                cacheData[key.value].push(k.name);
	                                            }
	                                        }
	                                        _context.next = 22;
	                                        break;

	                                    case 18:
	                                        _context.prev = 18;
	                                        _context.t0 = _context["catch"](14);
	                                        _didIteratorError2 = true;
	                                        _iteratorError2 = _context.t0;

	                                    case 22:
	                                        _context.prev = 22;
	                                        _context.prev = 23;

	                                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                                            _iterator2.return();
	                                        }

	                                    case 25:
	                                        _context.prev = 25;

	                                        if (!_didIteratorError2) {
	                                            _context.next = 28;
	                                            break;
	                                        }

	                                        throw _iteratorError2;

	                                    case 28:
	                                        return _context.finish(25);

	                                    case 29:
	                                        return _context.finish(22);

	                                    case 30:
	                                        _iteratorNormalCompletion = true;
	                                        _context.next = 8;
	                                        break;

	                                    case 33:
	                                        _context.next = 39;
	                                        break;

	                                    case 35:
	                                        _context.prev = 35;
	                                        _context.t1 = _context["catch"](6);
	                                        _didIteratorError = true;
	                                        _iteratorError = _context.t1;

	                                    case 39:
	                                        _context.prev = 39;
	                                        _context.prev = 40;

	                                        if (!_iteratorNormalCompletion && _iterator.return) {
	                                            _iterator.return();
	                                        }

	                                    case 42:
	                                        _context.prev = 42;

	                                        if (!_didIteratorError) {
	                                            _context.next = 45;
	                                            break;
	                                        }

	                                        throw _iteratorError;

	                                    case 45:
	                                        return _context.finish(42);

	                                    case 46:
	                                        return _context.finish(39);

	                                    case 47:
	                                        if (_this2._checkQuery(query, cacheData, next, params)) {
	                                            _this2._setCache(type, req, res, params, cacheData, next, dates);
	                                        }

	                                    case 48:
	                                    case "end":
	                                        return _context.stop();
	                                }
	                            }
	                        }, _callee, _this2, [[6, 35, 39, 47], [14, 18, 22, 30], [23,, 25, 29], [40,, 42, 46]]);
	                    }))();
	                }
	            } else {
	                next(err);
	            }
	        });
	    },
	    _findData: function _findData(type, res, req, query, next, dates) {
	        var _this3 = this;

	        (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
	            var isErr, error, sendData, conf, result;
	            return _regenerator2.default.wrap(function _callee2$(_context2) {
	                while (1) {
	                    switch (_context2.prev = _context2.next) {
	                        case 0:
	                            isErr = false, error = "";
	                            sendData = {
	                                rows: _this3.rows,
	                                cols: _this3.cols
	                            };
	                            _context2.prev = 2;
	                            _context2.next = 5;
	                            return _this3._findDatabase(req, _this3.modelName[0], query);

	                        case 5:
	                            sendData.data = _context2.sent;

	                            if (!_this3.modelName[1]) {
	                                _context2.next = 11;
	                                break;
	                            }

	                            if (_this3.orderParams) {
	                                query = _this3.orderParams;
	                            }
	                            _context2.next = 10;
	                            return _this3._findDatabase(req, _this3.modelName[1], query);

	                        case 10:
	                            sendData.orderData = _context2.sent;

	                        case 11:
	                            _context2.next = 17;
	                            break;

	                        case 13:
	                            _context2.prev = 13;
	                            _context2.t0 = _context2["catch"](2);

	                            isErr = true;
	                            error = _context2.t0;

	                        case 17:

	                            if (_this3.filter) {
	                                sendData = _this3.filter(sendData, _this3.filter_key || _this3.key_type, dates);
	                            }

	                            if (!isErr) {
	                                _context2.next = 21;
	                                break;
	                            }

	                            next(error);
	                            return _context2.abrupt("return");

	                        case 21:
	                            if (type !== "excel") {
	                                res[type]({
	                                    code: 200,
	                                    modelData: sendData,
	                                    components: {
	                                        flexible_btn: _this3.flexible_btn,
	                                        date_picker: {
	                                            show: _this3.date_picker,
	                                            defaultData: _this3.date_picker_data
	                                        },
	                                        drop_down: {
	                                            platform: _this3.platform,
	                                            channel: _this3.channel,
	                                            version: _this3.version,
	                                            coupon: _this3.coupon
	                                        },
	                                        level_select: _this3.level_select,
	                                        filter_select: _this3.filter_select
	                                    }
	                                });
	                            } else {
	                                conf = excelExport.analysisExcel(sendData), result = nodeExcel.execute(conf);

	                                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	                                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	                                res.end(result, 'binary');
	                            }

	                        case 22:
	                        case "end":
	                            return _context2.stop();
	                    }
	                }
	            }, _callee2, _this3, [[2, 13]]);
	        }))();
	    },
	    _setCache: function _setCache(type, req, res, params, data, next, dates) {
	        var _this4 = this;

	        cache.cacheSet(cacheName, data, cacheTime, function (err, success) {
	            if (!err && success) {
	                _this4._findData(type, res, req, params, next, dates);
	            } else {
	                next(err);
	            }
	        });
	    },
	    _checkQuery: function _checkQuery(query, data, next, params) {
	        var errObj = {},
	            err = [];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(this.defaultRender), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;

	                if (this[key.key]) {
	                    if (!query[key.value]) {
	                        query[key.value] = params[key.value];
	                    }
	                    errObj[key.value] = false;
	                    var _iteratorNormalCompletion4 = true;
	                    var _didIteratorError4 = false;
	                    var _iteratorError4 = undefined;

	                    try {
	                        for (var _iterator4 = (0, _getIterator3.default)(data[key.key]), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                            var k = _step4.value;

	                            if (query[key.value] === k) {
	                                params[key.value] = query[key.value];
	                                errObj[key.value] = true;
	                            }
	                        }
	                    } catch (err) {
	                        _didIteratorError4 = true;
	                        _iteratorError4 = err;
	                    } finally {
	                        try {
	                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                                _iterator4.return();
	                            }
	                        } finally {
	                            if (_didIteratorError4) {
	                                throw _iteratorError4;
	                            }
	                        }
	                    }
	                }
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

	        (0, _keys2.default)(errObj).forEach(function (key) {
	            if (!errObj[key]) {
	                err.push(key);
	            }
	        });
	        if (err.length > 0) {
	            next(new Error(err.join("参数或者") + "参数出错"));
	            return false;
	        }
	        (0, _keys2.default)(query).forEach(function (value) {
	            if (value !== "startTime" && value !== "endTime") {
	                if (!params.hasOwnProperty(value)) {
	                    params[value] = query[value];
	                }
	            }
	        });
	        return true;
	    },

	    _findDatabase: function () {
	        var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, modelName, params) {
	            return _regenerator2.default.wrap(function _callee3$(_context3) {
	                while (1) {
	                    switch (_context3.prev = _context3.next) {
	                        case 0:
	                            return _context3.abrupt("return", new _promise2.default(function (resolve, reject) {
	                                req.models[modelName].find(params, function (err, data) {
	                                    if (err) {
	                                        reject(err);
	                                    } else {
	                                        resolve(data);
	                                    }
	                                });
	                            }));

	                        case 1:
	                        case "end":
	                            return _context3.stop();
	                    }
	                }
	            }, _callee3, undefined);
	        }));
	        return function _findDatabase(_x, _x2, _x3) {
	            return ref.apply(this, arguments);
	        };
	    }(),
	    setRouter: function setRouter(Router) {
	        Router.get(this.router + '_json', this._sendData.bind(this, 'json'));
	        Router.get(this.router + '_jsonp', this._sendData.bind(this, 'jsonp'));
	        if (this.excel_export) {
	            Router.get(this.router + '_excel', this._sendData.bind(this, 'excel'));
	        }
	        return Router;
	    }
	};

	module.exports = api;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(92), __esModule: true };

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(93);
	__webpack_require__(73);
	__webpack_require__(58);
	__webpack_require__(94);
	module.exports = __webpack_require__(26).Promise;

/***/ },
/* 93 */
/***/ function(module, exports) {

	

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY            = __webpack_require__(64)
	  , global             = __webpack_require__(21)
	  , ctx                = __webpack_require__(27)
	  , classof            = __webpack_require__(77)
	  , $export            = __webpack_require__(25)
	  , isObject           = __webpack_require__(32)
	  , anObject           = __webpack_require__(31)
	  , aFunction          = __webpack_require__(28)
	  , anInstance         = __webpack_require__(95)
	  , forOf              = __webpack_require__(96)
	  , setProto           = __webpack_require__(99).set
	  , speciesConstructor = __webpack_require__(102)
	  , task               = __webpack_require__(103).set
	  , microtask          = __webpack_require__(105)
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;

	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(71)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();

	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};

	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(106)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(70)($Promise, PROMISE);
	__webpack_require__(107)(PROMISE);
	Wrapper = __webpack_require__(26)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(108)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(27)
	  , call        = __webpack_require__(97)
	  , isArrayIter = __webpack_require__(98)
	  , anObject    = __webpack_require__(31)
	  , toLength    = __webpack_require__(16)
	  , getIterFn   = __webpack_require__(76);
	module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    call(iterator, f, step.value, entries);
	  }
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(31);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(62)
	  , ITERATOR   = __webpack_require__(71)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(32)
	  , anObject = __webpack_require__(31);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(27)(Function.call, __webpack_require__(100).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(101)
	  , createDesc     = __webpack_require__(38)
	  , toIObject      = __webpack_require__(12)
	  , toPrimitive    = __webpack_require__(37)
	  , has            = __webpack_require__(11)
	  , IE8_DOM_DEFINE = __webpack_require__(33)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(34) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 101 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(31)
	  , aFunction = __webpack_require__(28)
	  , SPECIES   = __webpack_require__(71)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(27)
	  , invoke             = __webpack_require__(104)
	  , html               = __webpack_require__(69)
	  , cel                = __webpack_require__(36)
	  , global             = __webpack_require__(21)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(14)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 104 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(21)
	  , macrotask = __webpack_require__(103).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(14)(process) == 'process'
	  , head, last, notify;

	var flush = function(){
	  var parent, fn;
	  if(isNode && (parent = process.domain))parent.exit();
	  while(head){
	    fn = head.fn;
	    fn(); // <- currently we use it only for Promise - try / catch not required
	    head = head.next;
	  } last = undefined;
	  if(parent)parent.enter();
	};

	// Node.js
	if(isNode){
	  notify = function(){
	    process.nextTick(flush);
	  };
	// browsers with MutationObserver
	} else if(Observer){
	  var toggle = true
	    , node   = document.createTextNode('');
	  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	  notify = function(){
	    node.data = toggle = !toggle;
	  };
	// environments with maybe non-completely correct, but existent Promise
	} else if(Promise && Promise.resolve){
	  notify = function(){
	    Promise.resolve().then(flush);
	  };
	// for other environments - macrotask based on:
	// - setImmediate
	// - MessageChannel
	// - window.postMessag
	// - onreadystatechange
	// - setTimeout
	} else {
	  notify = function(){
	    // strange IE + webpack dev server bug - use .call(global)
	    macrotask.call(global, flush);
	  };
	}

	module.exports = function(fn){
	  var task = {fn: fn, next: undefined};
	  if(last)last.next = task;
	  if(!head){
	    head = task;
	    notify();
	  } last = task;
	};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(29);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(21)
	  , core        = __webpack_require__(26)
	  , dP          = __webpack_require__(30)
	  , DESCRIPTORS = __webpack_require__(34)
	  , SPECIES     = __webpack_require__(71)('species');

	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(71)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	// This method of obtaining a reference to the global object needs to be
	// kept identical to the way it is obtained in runtime.js
	var g =
	  typeof global === "object" ? global :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : this;

	// Use `getOwnPropertyNames` because not all browsers support calling
	// `hasOwnProperty` on the global `self` object in a worker. See #183.
	var hadRuntime = g.regeneratorRuntime &&
	  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

	// Save the old regeneratorRuntime in case it needs to be restored later.
	var oldRuntime = hadRuntime && g.regeneratorRuntime;

	// Force reevalutation of runtime.js.
	g.regeneratorRuntime = undefined;

	module.exports = __webpack_require__(110);

	if (hadRuntime) {
	  // Restore the original runtime.
	  g.regeneratorRuntime = oldRuntime;
	} else {
	  // Remove the global property added by runtime.js.
	  try {
	    delete g.regeneratorRuntime;
	  } catch(e) {
	    g.regeneratorRuntime = undefined;
	  }
	}

	module.exports = { "default": module.exports, __esModule: true };


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	var _promise = __webpack_require__(91);

	var _promise2 = _interopRequireDefault(_promise);

	var _setPrototypeOf = __webpack_require__(112);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(115);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(118);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _iterator = __webpack_require__(119);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(121);

	var _symbol2 = _interopRequireDefault(_symbol);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	!function (global) {
	  "use strict";

	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol = typeof _symbol2.default === "function" && _iterator2.default || "@@iterator";

	  var inModule = ( false ? "undefined" : (0, _typeof3.default)(module)) === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided, then outerFn.prototype instanceof Generator.
	    var generator = (0, _create2.default)((outerFn || Generator).prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      prototype[method] = function (arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function (genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor ? ctor === GeneratorFunction ||
	    // For the native GeneratorFunction constructor, the best we can
	    // do is to check its .name property.
	    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	  };

	  runtime.mark = function (genFun) {
	    if (_setPrototypeOf2.default) {
	      (0, _setPrototypeOf2.default)(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	    }
	    genFun.prototype = (0, _create2.default)(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `value instanceof AwaitArgument` to determine if the yielded value is
	  // meant to be awaited. Some may consider the name of this method too
	  // cutesy, but they are curmudgeons.
	  runtime.awrap = function (arg) {
	    return new AwaitArgument(arg);
	  };

	  function AwaitArgument(arg) {
	    this.arg = arg;
	  }

	  function AsyncIterator(generator) {
	    // This invoke function is written in a style that assumes some
	    // calling function (or Promise) will handle exceptions.
	    function invoke(method, arg) {
	      var result = generator[method](arg);
	      var value = result.value;
	      return value instanceof AwaitArgument ? _promise2.default.resolve(value.arg).then(invokeNext, invokeThrow) : _promise2.default.resolve(value).then(function (unwrapped) {
	        // When a yielded Promise is resolved, its final value becomes
	        // the .value of the Promise<{value,done}> result for the
	        // current iteration. If the Promise is rejected, however, the
	        // result for this iteration will be rejected with the same
	        // reason. Note that rejections of yielded Promises are not
	        // thrown back into the generator function, as is the case
	        // when an awaited Promise is rejected. This difference in
	        // behavior between yield and await is important, because it
	        // allows the consumer to decide what to do with the yielded
	        // rejection (swallow it and continue, manually .throw it back
	        // into the generator, abandon iteration, whatever). With
	        // await, by contrast, there is no opportunity to examine the
	        // rejection reason outside the generator function, so the
	        // only option is to throw it from the await expression, and
	        // let the generator function handle the exception.
	        result.value = unwrapped;
	        return result;
	      });
	    }

	    if ((typeof process === "undefined" ? "undefined" : (0, _typeof3.default)(process)) === "object" && process.domain) {
	      invoke = process.domain.bind(invoke);
	    }

	    var invokeNext = invoke.bind(generator, "next");
	    var invokeThrow = invoke.bind(generator, "throw");
	    var invokeReturn = invoke.bind(generator, "return");
	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return invoke(method, arg);
	      }

	      return previousPromise =
	      // If enqueue has been called before, then we want to wait until
	      // all previous Promises have been resolved before calling invoke,
	      // so that results are always delivered in the correct order. If
	      // enqueue has not been called before, then it is important to
	      // call invoke immediately, without waiting on a callback to fire,
	      // so that the async generator function has the opportunity to do
	      // any necessary setup in a predictable way. This predictability
	      // is why the Promise constructor synchronously invokes its
	      // executor callback, and why async functions synchronously
	      // execute code before the first await. Since we implement simple
	      // async functions in terms of async generators, it is especially
	      // important to get this right, even though it requires care.
	      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
	      // Avoid propagating failures to Promises returned by later
	      // invocations of the iterator.
	      callInvokeWithMethodAndArg) : new _promise2.default(function (resolve) {
	        resolve(callInvokeWithMethodAndArg());
	      });
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

	    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	    : iter.next().then(function (result) {
	      return result.done ? result.value : iter.next();
	    });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
	            // A return or throw (when the delegate iterator has no throw
	            // method) always terminates the yield* loop.
	            context.delegate = null;

	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            var returnMethod = delegate.iterator["return"];
	            if (returnMethod) {
	              var record = tryCatch(returnMethod, delegate.iterator, arg);
	              if (record.type === "throw") {
	                // If the return method threw an exception, let that
	                // exception prevail over the original return or throw.
	                method = "throw";
	                arg = record.arg;
	                continue;
	              }
	            }

	            if (method === "return") {
	              // Continue with the outer return, now that the delegate
	              // iterator has been terminated.
	              continue;
	            }
	          }

	          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

	          if (record.type === "throw") {
	            context.delegate = null;

	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	            continue;
	          }

	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;

	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }

	          context.delegate = null;
	        }

	        if (method === "next") {
	          context._sent = arg;

	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            context.sent = undefined;
	          }
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }

	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	          var info = {
	            value: record.arg,
	            done: context.done
	          };

	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(arg) call above.
	          method = "throw";
	          arg = record.arg;
	        }
	      }
	    };
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[iteratorSymbol] = function () {
	    return this;
	  };

	  Gp.toString = function () {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function (object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1,
	            next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function reset(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function stop() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function dispatchException(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function abrupt(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }

	      return ContinueSentinel;
	    },

	    complete: function complete(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" || record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	    },

	    finish: function finish(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function _catch(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      return ContinueSentinel;
	    }
	  };
	}(
	// Among the various tricks for obtaining a reference to the global
	// object, this seems to be the most reliable technique that does not
	// use indirect eval (which violates Content Security Policy).
	(typeof global === "undefined" ? "undefined" : (0, _typeof3.default)(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : (0, _typeof3.default)(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : (0, _typeof3.default)(self)) === "object" ? self : undefined);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(111)(module)))

/***/ },
/* 111 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(113), __esModule: true };

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(114);
	module.exports = __webpack_require__(26).Object.setPrototypeOf;

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(25);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(99).set});

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(116), __esModule: true };

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(117);
	var $Object = __webpack_require__(26).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(25)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(67)});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(119);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(121);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(120), __esModule: true };

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(73);
	__webpack_require__(58);
	module.exports = __webpack_require__(71)('iterator');

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(122), __esModule: true };

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(123);
	__webpack_require__(93);
	module.exports = __webpack_require__(26).Symbol;

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(21)
	  , core           = __webpack_require__(26)
	  , has            = __webpack_require__(11)
	  , DESCRIPTORS    = __webpack_require__(34)
	  , $export        = __webpack_require__(25)
	  , redefine       = __webpack_require__(65)
	  , META           = __webpack_require__(124).KEY
	  , $fails         = __webpack_require__(35)
	  , shared         = __webpack_require__(20)
	  , setToStringTag = __webpack_require__(70)
	  , uid            = __webpack_require__(22)
	  , wks            = __webpack_require__(71)
	  , keyOf          = __webpack_require__(125)
	  , enumKeys       = __webpack_require__(126)
	  , isArray        = __webpack_require__(128)
	  , anObject       = __webpack_require__(31)
	  , toIObject      = __webpack_require__(12)
	  , toPrimitive    = __webpack_require__(37)
	  , createDesc     = __webpack_require__(38)
	  , _create        = __webpack_require__(67)
	  , gOPNExt        = __webpack_require__(129)
	  , $GOPD          = __webpack_require__(100)
	  , $DP            = __webpack_require__(30)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = gOPD(it = toIObject(it), key = toPrimitive(key, true));
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , replacer, $replacer;
	  while(arguments.length > i)args.push(arguments[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var BUGGY_JSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(130).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(101).f  = $propertyIsEnumerable
	  __webpack_require__(127).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(64)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	for(var symbols = (
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; ){
	  var key     = symbols[i++]
	    , Wrapper = core.Symbol
	    , sym     = wks(key);
	  if(!(key in Wrapper))dP(Wrapper, key, {value: USE_NATIVE ? sym : wrap(sym)});
	};

	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	if(!QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild)setter = true;

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || BUGGY_JSON), 'JSON', {stringify: $stringify});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(29)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(22)('meta')
	  , isObject = __webpack_require__(32)
	  , has      = __webpack_require__(11)
	  , setDesc  = __webpack_require__(30).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(35)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(9)
	  , toIObject = __webpack_require__(12);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(9)
	  , gOPS    = __webpack_require__(127)
	  , pIE     = __webpack_require__(101);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 127 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(14);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(12)
	  , gOPN      = __webpack_require__(130).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(10)
	  , hiddenKeys = __webpack_require__(23).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _promise = __webpack_require__(91);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (fn) {
	  return function () {
	    var gen = fn.apply(this, arguments);
	    return new _promise2.default(function (resolve, reject) {
	      function step(key, arg) {
	        try {
	          var info = gen[key](arg);
	          var value = info.value;
	        } catch (error) {
	          reject(error);
	          return;
	        }

	        if (info.done) {
	          resolve(value);
	        } else {
	          return _promise2.default.resolve(value).then(function (value) {
	            return step("next", value);
	          }, function (err) {
	            return step("throw", err);
	          });
	        }
	      }

	      return step("next");
	    });
	  };
	};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20151216
	 * @fileoverview 导出excel
	 */
	var path = __webpack_require__(79);
	module.exports = {
	    analysisExcel: function analysisExcel(array) {
	        var conf = {};
	        conf.stylesXmlFile = path.join(__dirname, '../styles.xml');
	        conf.cols = [];
	        conf.rows = [];
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(array[0].cols), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                if (key.type) {
	                    conf.cols.push(key);
	                }
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

	        var object = [];
	        array[0].data.forEach(function (data) {
	            array[0].rows.forEach(function (row) {
	                if (row !== "operating") {
	                    object.push(data[row]);
	                }
	            });
	            conf.rows.push(object);
	            object = [];
	        });
	        return conf;
	    }
	};

/***/ },
/* 133 */
/***/ function(module, exports) {

	module.exports = require("excel-export");

/***/ },
/* 134 */
/***/ function(module, exports) {

	module.exports = require("validator");

/***/ },
/* 135 */
/***/ function(module, exports) {

	module.exports = require("orm");

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160415
	 * @fileoverview 店铺分析
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84);

	module.exports = {
	    shopOne: function shopOne(data, filter_key, dates) {
	        var source = data.data,
	            filter_name = {
	            shop_new_num: "新增注册店铺",
	            shop_succ_num: "成功入驻店铺",
	            shop_order_succ_num: "成功交易店铺",
	            shop_access_num: "被访问店铺数"
	        },
	            type = "line",
	            map = {
	            value: filter_name[filter_key]
	        },
	            newData = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var date = _step.value;

	                newData[date] = {
	                    value: 0
	                };
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                newData[util.getDate(key.date)].value += key[filter_key];
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    shopTwo: function shopTwo(data, dates) {
	        var source = data.data,
	            obj = {},
	            newData = [];
	        dates.sort(function (a, b) {
	            return new Date(b) - new Date(a);
	        });
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                obj[date] = {
	                    shop_new_num: 0,
	                    shop_succ_num: 0,
	                    shop_total_num: 0,
	                    shop_order_num: 0,
	                    shop_order_succ_num: 0,
	                    shop_access_num: 0,
	                    shop_share_num: 0
	                };
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                obj[util.getDate(key.date)].shop_new_num += key.shop_new_num;
	                obj[util.getDate(key.date)].shop_succ_num += key.shop_succ_num;
	                obj[util.getDate(key.date)].shop_total_num += key.shop_total_num;
	                obj[util.getDate(key.date)].shop_order_num += key.shop_order_num;
	                obj[util.getDate(key.date)].shop_order_succ_num += key.shop_order_succ_num;
	                obj[util.getDate(key.date)].shop_access_num += key.shop_access_num;
	                obj[util.getDate(key.date)].shop_share_num += key.shop_share_num;
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(dates), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var date = _step5.value;

	                newData.push({
	                    date: date,
	                    shop_new_num: obj[date].shop_new_num,
	                    shop_succ_num: obj[date].shop_succ_num,
	                    shop_total_num: obj[date].shop_total_num,
	                    shop_order_num: obj[date].shop_order_num,
	                    shop_order_succ_num: obj[date].shop_order_succ_num,
	                    shop_access_num: obj[date].shop_access_num,
	                    shop_share_num: obj[date].shop_share_num
	                });
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    },
	    shopThree: function shopThree(data) {
	        var source = data.data,
	            ids = util.uniq(_.pluck(source, "shop_id")),
	            newData = [],
	            oldData = [],
	            total_access_num = 0,
	            total_access_users = 0;
	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(ids), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var id = _step6.value;

	                var obj = {
	                    shop_id: id,
	                    shop_name: "",
	                    access_num: 0,
	                    access_users: 0,
	                    share_commodity_num: 0
	                };
	                var _iteratorNormalCompletion7 = true;
	                var _didIteratorError7 = false;
	                var _iteratorError7 = undefined;

	                try {
	                    for (var _iterator7 = (0, _getIterator3.default)(source), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                        var key = _step7.value;

	                        if (id === key.shop_id) {
	                            total_access_num += key.access_num;
	                            total_access_users += key.access_users;
	                            obj.shop_name = key.shop_name;
	                            obj.access_num += key.access_num;
	                            obj.access_users += key.access_users;
	                            obj.share_commodity_num += key.share_commodity_num;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError7 = true;
	                    _iteratorError7 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                            _iterator7.return();
	                        }
	                    } finally {
	                        if (_didIteratorError7) {
	                            throw _iteratorError7;
	                        }
	                    }
	                }

	                oldData.push(obj);
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        oldData.sort(function (a, b) {
	            return b.access_num - a.access_num;
	        });
	        var top = oldData.length > 50 ? 50 : oldData.length;
	        for (var i = 0; i < top; i++) {
	            newData.push({
	                top: i + 1,
	                shop_name: oldData[i].shop_name,
	                access_num: oldData[i].access_num,
	                access_users: oldData[i].access_users,
	                share_commodity_num: oldData[i].share_commodity_num,
	                access_num_rate: util.toFixed(oldData[i].access_num, total_access_num),
	                access_users_rate: util.toFixed(oldData[i].access_users, total_access_users)
	            });
	        }
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    shopFour: function shopFour(data) {
	        var source = data.data,
	            ids = util.uniq(_.pluck(source, "shop_id")),
	            newData = [],
	            oldData = [],
	            total_pay_price = 0,
	            total_pay_commodity_num = 0;
	        var _iteratorNormalCompletion8 = true;
	        var _didIteratorError8 = false;
	        var _iteratorError8 = undefined;

	        try {
	            for (var _iterator8 = (0, _getIterator3.default)(ids), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                var id = _step8.value;

	                var obj = {
	                    shop_id: id,
	                    shop_name: "",
	                    pay_price: 0,
	                    pay_commodity_num: 0,
	                    share_commodity_num: 0
	                };
	                var _iteratorNormalCompletion9 = true;
	                var _didIteratorError9 = false;
	                var _iteratorError9 = undefined;

	                try {
	                    for (var _iterator9 = (0, _getIterator3.default)(source), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                        var key = _step9.value;

	                        if (id === key.shop_id) {
	                            total_pay_price += key.pay_price;
	                            total_pay_commodity_num += key.pay_commodity_num;
	                            obj.shop_name = key.shop_name;
	                            obj.pay_price += key.pay_price;
	                            obj.pay_commodity_num += key.pay_commodity_num;
	                            obj.share_commodity_num += key.share_commodity_num;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError9 = true;
	                    _iteratorError9 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                            _iterator9.return();
	                        }
	                    } finally {
	                        if (_didIteratorError9) {
	                            throw _iteratorError9;
	                        }
	                    }
	                }

	                oldData.push(obj);
	            }
	        } catch (err) {
	            _didIteratorError8 = true;
	            _iteratorError8 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                    _iterator8.return();
	                }
	            } finally {
	                if (_didIteratorError8) {
	                    throw _iteratorError8;
	                }
	            }
	        }

	        oldData.sort(function (a, b) {
	            return b.pay_price - a.pay_price;
	        });
	        var top = oldData.length > 50 ? 50 : oldData.length;
	        for (var i = 0; i < top; i++) {
	            newData.push({
	                top: i + 1,
	                shop_name: oldData[i].shop_name,
	                pay_price: oldData[i].pay_price.toFixed(2),
	                pay_commodity_num: oldData[i].pay_commodity_num,
	                share_commodity_num: oldData[i].share_commodity_num,
	                pay_price_rate: util.toFixed(oldData[i].pay_price, total_pay_price),
	                pay_commodity_rate: util.toFixed(oldData[i].share_commodity_num, total_pay_commodity_num)
	            });
	        }
	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 201600405
	 * @fileoverview 商家返利汇总
	 */
	var api = __webpack_require__(90),
	    moment = __webpack_require__(138),
	    businessRebate = __webpack_require__(139);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/businessRebate/businessAllOne",
	        modelName: ["RebateShopOverview", "RebateShopRefund"],
	        date_picker_data: 1,
	        platform: false,
	        filter: function filter(data, filter_key, dates) {
	            return businessRebate.businessAllOne(data);
	        },

	        rows: [["name", "order_num", "order_amount", "shop_num", "user_num", "product_sku_num"], ["rebate_order_num", "rebate_amount_total", "rebate_amount_actual", "rebate_amount", "rate", "platform_amount"], ["name", "spu_num", "sku_num", "user_num", "amount", "amount_actual"]],
	        cols: [[{
	            caption: "",
	            type: "string"
	        }, {
	            caption: "订单数",
	            type: "string"
	        }, {
	            caption: "订单总金额",
	            type: "string"
	        }, {
	            caption: "商家数",
	            type: "string"
	        }, {
	            caption: "用户数",
	            type: "string"
	        }, {
	            caption: "商品件数",
	            type: "string"
	        }], [{
	            caption: "返利到账订单数",
	            type: "string"
	        }, {
	            caption: "返利到账订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账订单实付金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "string"
	        }, {
	            caption: "返利比率",
	            type: "string"
	        }, {
	            caption: "平台到账金额",
	            type: "string"
	        }], [{
	            caption: "",
	            type: "string"
	        }, {
	            caption: "退货商品数",
	            type: "string"
	        }, {
	            caption: "退货商品件数",
	            type: "string"
	        }, {
	            caption: "退货用户数",
	            type: "string"
	        }, {
	            caption: "退货商品总金额",
	            type: "string"
	        }, {
	            caption: "实际退货金额",
	            type: "string"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/businessRebate/businessAllTwo",
	        modelName: ["RebateShopTredencyDetails"],
	        level_select: true,
	        platform: false,
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'order_num',
	                value: '订单数'
	            }, {
	                key: 'order_amount',
	                value: '订单总金额'
	            }, {
	                key: 'product_sku_num',
	                value: '商品件数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return businessRebate.businessAllTwe(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/businessRebate/businessAllThree",
	        modelName: ["RebateShopTredencyDetails"],
	        level_select: true,
	        platform: false,
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'product_sku_num',
	                value: '商品件数'
	            }, {
	                key: 'item_amount',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return businessRebate.businessAllThree(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/businessRebate/businessAllFour",
	        modelName: ["RebateShopTredencyDetails"],
	        level_select: true,
	        platform: false,
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'product_sku_num',
	                value: '商品件数'
	            }, {
	                key: 'item_amount',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return businessRebate.businessAllFour(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/businessRebate/businessAllFive",
	        modelName: ["RebateShopTop"],
	        date_picker_data: 1,
	        platform: false,
	        filter: function filter(data, filter_key, dates) {
	            return businessRebate.businessAllFive(data);
	        },

	        rows: [["id", "shop_name", "plan_num", "spu_num", "user_num", "pay_rate", "pay_price_rate", "plan_rebate_amount", "rebate_amount", "platform_amount"]],
	        cols: [[{
	            caption: "排名",
	            type: "number"
	        }, {
	            caption: "商家名称",
	            type: "string"
	        }, {
	            caption: "计划数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "新增订单数/订单总数",
	            type: "string"
	        }, {
	            caption: "新增订单金额/订单总金额",
	            type: "string"
	        }, {
	            caption: "预计返利金额",
	            type: "number"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }, {
	            caption: "平台到账金额",
	            type: "number"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/businessRebate/businessAllSix",
	        modelName: ["RebateShopPlanTop"],
	        date_picker_data: 1,
	        platform: false,
	        flexible_btn: [{
	            content: '<a href="/businessRebate/plan" target="_blank">更多</a>',
	            preMethods: [],
	            customMethods: ''
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return businessRebate.businessAllSix(data);
	        },

	        rows: [["id", "plan_name", "shop_name", "deadline", "related_flow", "level", "spu_num", "user_num", "pay_rate", "pay_price_rate", "rebate_amount", "refund_rate"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "返利计划名称",
	            type: "string"
	        }, {
	            caption: "商家名称",
	            type: "string"
	        }, {
	            caption: "有效期",
	            type: "string"
	        }, {
	            caption: "相关流程",
	            type: "string"
	        }, {
	            caption: "层级",
	            type: "string"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "新增订单数/订单总数",
	            type: "string"
	        }, {
	            caption: "新增订单金额/订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }, {
	            caption: "退出率",
	            type: "string"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/businessRebate/planOne",
	        modelName: ["RebateShopPlanTop"],
	        excel_export: true,
	        platform: false,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        date_picker_data: 1,
	        filter: function filter(data, filter_key, dates) {
	            return businessRebate.planOne(data);
	        },

	        rows: [["id", "plan_name", "shop_name", "deadline", "related_flow", "level", "spu_num", "user_num", "pay_rate", "pay_price_rate", "rebate_amount", "refund_rate"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "返利计划名称",
	            type: "string"
	        }, {
	            caption: "商家名称",
	            type: "string"
	        }, {
	            caption: "有效期",
	            type: "string"
	        }, {
	            caption: "相关流程",
	            type: "string"
	        }, {
	            caption: "层级",
	            type: "string"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "新增订单数/订单总数",
	            type: "string"
	        }, {
	            caption: "新增订单金额/订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }, {
	            caption: "退出率",
	            type: "string"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 138 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160405
	 * @fileoverview 商家返利汇总
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84);

	module.exports = {
	    businessAllOne: function businessAllOne(data) {
	        var source = data.data,
	            orderSource = data.orderData,
	            total_order_num = 0,
	            total_order_amount = 0,
	            total_shop_num = 0,
	            total_user_num = 0,
	            total_product_sku_num = 0,
	            one = [],
	            twe = [],
	            three = [],
	            objOne = {
	            name: "返利订单",
	            order_num: 0,
	            order_amount: 0,
	            shop_num: 0,
	            user_num: 0,
	            product_sku_num: 0
	        },
	            objTwe = {
	            rebate_order_num: 0,
	            rebate_amount_total: 0,
	            rebate_amount_actual: 0,
	            rebate_amount: 0,
	            platform_amount: 0
	        },
	            objThree = {
	            name: "返利订单",
	            spu_num: 0,
	            total_spu_num: 0,
	            sku_num: 0,
	            total_sku_num: 0,
	            user_num: 0,
	            total_user_num: 0,
	            amount: 0,
	            total_amount: 0,
	            amount_actual: 0,
	            total_amount_actual: 0
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                total_order_num = key.total_order_num;
	                total_order_amount = key.total_order_amount;
	                total_shop_num = key.total_shop_num;
	                total_user_num = key.total_user_num;
	                total_product_sku_num = key.total_product_sku_num;
	                objOne.order_num += key.order_num;
	                objOne.order_amount += key.order_amount;
	                objOne.shop_num += key.shop_num;
	                objOne.user_num += key.user_num;
	                objOne.product_sku_num += key.product_sku_num;
	                objTwe.rebate_order_num += key.rebate_order_num;
	                objTwe.rebate_amount_total += key.rebate_amount_total;
	                objTwe.rebate_amount_actual += key.rebate_amount_actual;
	                objTwe.rebate_amount += key.rebate_amount;
	                objTwe.platform_amount += key.platform_amount;
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(orderSource), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                objThree.spu_num += key.spu_num;
	                objThree.total_spu_num += key.total_spu_num;
	                objThree.sku_num += key.sku_num;
	                objThree.total_sku_num += key.total_sku_num;
	                objThree.user_num += key.user_num;
	                objThree.total_user_num += key.total_user_num;
	                objThree.amount += key.amount;
	                objThree.total_amount += key.total_amount;
	                objThree.amount_actual += key.amount_actual;
	                objThree.total_amount_actual += key.total_amount_actual;
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

	        one.push(objOne);
	        one.push({
	            name: "总占比",
	            order_num: util.toFixed(objOne.order_num, total_order_num),
	            order_amount: util.toFixed(objOne.order_amount, total_order_amount),
	            shop_num: util.toFixed(objOne.shop_num, total_shop_num),
	            user_num: util.toFixed(objOne.user_num, total_user_num),
	            product_sku_num: util.toFixed(objOne.product_sku_num, total_product_sku_num)
	        });
	        objTwe.rate = util.toFixed(objTwe.rebate_amount, objTwe.rebate_amount_actual);
	        twe.push(objTwe);
	        three.push(objThree);
	        three.push({
	            name: "返利退货订单占比",
	            spu_num: util.toFixed(objThree.spu_num, objThree.total_spu_num),
	            sku_num: util.toFixed(objThree.sku_num, objThree.total_sku_num),
	            user_num: util.toFixed(objThree.user_num, objThree.total_user_num),
	            amount: util.toFixed(objThree.amount, objThree.total_amount),
	            amount_actual: util.toFixed(objThree.amount_actual, objThree.total_amount_actual)
	        });
	        return util.toTable([one, twe, three], data.rows, data.cols);
	    },
	    businessAllTwe: function businessAllTwe(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            array = ["分销购买", "分享购买", "组合返利"],
	            map = {},
	            newDate = {};
	        map[filter_key + "_0"] = "分销购买";
	        map[filter_key + "_1"] = "分享购买";
	        map[filter_key + "_2"] = "组合返利";
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                var obj = {};
	                for (var i = 0; i < array.length; i++) {
	                    obj[filter_key + "_" + i] = 0;
	                }
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (date === util.getDate(key.date)) {
	                            for (var i = 0; i < array.length; i++) {
	                                if (key.rebate_type === array[i]) {
	                                    obj[filter_key + "_" + i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newDate[util.getDate(new Date(date))] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            config: {
	                stack: false
	            },
	            data: newDate
	        }];
	    },
	    businessAllThree: function businessAllThree(data, filter_key) {
	        var source = data.data,
	            newDataPie = {},
	            newDataBar = {},
	            mapPie = {},
	            mapBar = {},
	            filter_name = {
	            product_sku_num: "商品件数",
	            item_amount: "商品总金额",
	            rebate_amount: "返利到账金额"
	        },
	            typePie = "pie",
	            typeBar = "bar",
	            XPie = ["1级", "2级", "3级", "4级"],
	            XBar = ["层级1", "层级2", "层级3", "层级4"];
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(XPie), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var level = _step5.value;

	                var obj = {};
	                obj.value = 0;
	                var _iteratorNormalCompletion7 = true;
	                var _didIteratorError7 = false;
	                var _iteratorError7 = undefined;

	                try {
	                    for (var _iterator7 = (0, _getIterator3.default)(source), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                        var key = _step7.value;

	                        if (level === key.grade) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError7 = true;
	                    _iteratorError7 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                            _iterator7.return();
	                        }
	                    } finally {
	                        if (_didIteratorError7) {
	                            throw _iteratorError7;
	                        }
	                    }
	                }

	                newDataPie[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(XPie), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var level = _step6.value;

	                var obj = {};
	                for (var i = 0; i < XBar.length; i++) {
	                    obj[i] = 0;
	                }
	                var _iteratorNormalCompletion8 = true;
	                var _didIteratorError8 = false;
	                var _iteratorError8 = undefined;

	                try {
	                    for (var _iterator8 = (0, _getIterator3.default)(source), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                        var key = _step8.value;

	                        if (key.level === level) {
	                            for (var i = 0; i < XBar.length; i++) {
	                                if (key.grade === XBar[i]) {
	                                    obj[i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError8 = true;
	                    _iteratorError8 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                            _iterator8.return();
	                        }
	                    } finally {
	                        if (_didIteratorError8) {
	                            throw _iteratorError8;
	                        }
	                    }
	                }

	                newDataBar[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        for (var i = 0; i < XBar.length; i++) {
	            mapBar[i] = XBar[i];
	        }
	        mapPie.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: mapPie,
	            data: newDataPie,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: mapBar,
	            data: newDataBar,
	            config: {
	                stack: true
	            }
	        }];
	    },
	    businessAllFour: function businessAllFour(data, filter_key) {
	        var source = data.data,
	            newData = {},
	            map = {},
	            typePie = "pie",
	            typeBar = "bar",
	            filter_name = {
	            product_sku_num: "商品件数",
	            item_amount: "商品总金额",
	            rebate_amount: "返利到账金额"
	        },
	            XData = ["分销购买", "分享购买"];
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;

	        try {
	            for (var _iterator9 = (0, _getIterator3.default)(XData), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                var x = _step9.value;

	                var obj = {
	                    value: 0
	                };
	                var _iteratorNormalCompletion10 = true;
	                var _didIteratorError10 = false;
	                var _iteratorError10 = undefined;

	                try {
	                    for (var _iterator10 = (0, _getIterator3.default)(source), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                        var key = _step10.value;

	                        if (x === key.rebate_type) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError10 = true;
	                    _iteratorError10 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                            _iterator10.return();
	                        }
	                    } finally {
	                        if (_didIteratorError10) {
	                            throw _iteratorError10;
	                        }
	                    }
	                }

	                newData[x] = obj;
	            }
	        } catch (err) {
	            _didIteratorError9 = true;
	            _iteratorError9 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                    _iterator9.return();
	                }
	            } finally {
	                if (_didIteratorError9) {
	                    throw _iteratorError9;
	                }
	            }
	        }

	        map.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }];
	    },
	    businessAllFive: function businessAllFive(data) {
	        var source = data.data,
	            newData = [],
	            length = source.length,
	            top = length > 50 ? 50 : length;
	        source = util.sort(source, "order_num", "pay_order_num");
	        for (var i = 0; i < top; i++) {
	            var obj = {
	                id: i + 1,
	                shop_name: source[i].shop_name,
	                plan_num: source[i].plan_num,
	                spu_num: source[i].spu_num,
	                user_num: source[i].user_num,
	                pay_rate: source[i].order_num + "/" + source[i].total_order_num,
	                pay_price_rate: source[i].order_amount + "/" + source[i].total_order_amount,
	                plan_rebate_amount: source[i].plan_rebate_amount,
	                rebate_amount: source[i].rebate_amount,
	                platform_amount: source[i].platform_amount
	            };
	            newData.push(obj);
	        }
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    businessAllSix: function businessAllSix(data) {
	        var source = data.data,
	            newData = [],
	            length = source.length,
	            top = length > 50 ? 50 : length;
	        source = util.sort(source, "order_num", "pay_order_num");
	        for (var i = 0; i < top; i++) {
	            var obj = {
	                id: i + 1,
	                plan_name: source[i].plan_name,
	                shop_name: source[i].shop_name,
	                deadline: source[i].deadline,
	                related_flow: source[i].related_flow,
	                level: source[i].level,
	                spu_num: source[i].spu_num,
	                user_num: source[i].user_num,
	                pay_rate: source[i].order_num + "/" + source[i].total_order_num,
	                pay_price_rate: source[i].order_amount + "/" + source[i].total_order_amount,
	                rebate_amount: source[i].rebate_amount,
	                refund_rate: util.toFixed(source[i].refund_sku_num, source[i].sku_num)
	            };
	            newData.push(obj);
	        }
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    planOne: function planOne(data) {
	        var source = data.data;
	        for (var i = 0; i < source.length; i++) {
	            source[i].id = i + 1;
	            source[i].pay_rate = source[i].order_num + "/" + source[i].total_order_num;
	            source[i].pay_price_rate = source[i].order_amount + "/" + source[i].total_order_amount;
	            source[i].refund_rate = util.toFixed(source[i].refund_sku_num, source[i].sku_num);
	        }
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 渠道分析
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(141);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/channelAnalysis/channelOne",
	        modelName: ["NewAccount"],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.channelOne(data, filter_key, dates);
	        },

	        filter_select: [{
	            title: '',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'new_users',
	                value: '新增用户'
	            }, {
	                key: 'active_users',
	                value: '活跃用户'
	            }, {
	                key: 'start_up',
	                value: '启动次数'
	            }]
	        }]
	    });

	    Router = new api(Router, {
	        router: "/channelAnalysis/channelTwo",
	        modelName: ["NewAccount"],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.channelTwo(data);
	        },

	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        rows: [['channel', 'new_users', 'active_users', 'start_up', 'new_users_rate']],
	        cols: [[{
	            caption: '渠道',
	            type: 'string'
	        }, {
	            caption: '新增用户',
	            type: 'number'
	        }, {
	            caption: '活跃用户',
	            type: 'number'
	        }, {
	            caption: '启动次数',
	            type: 'number'
	        }, {
	            caption: '新增用户占比',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 渠道分析
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84);

	module.exports = {
	    channelOne: function channelOne(data, filter_key, dates) {
	        var source = data.data,
	            channels = util.uniq(_.pluck(source, "channel")),
	            array = [],
	            type = "line",
	            map = {},
	            newData = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(channels), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var channel = _step.value;

	                var obj = {
	                    channel: channel,
	                    value: 0
	                };
	                var _iteratorNormalCompletion3 = true;
	                var _didIteratorError3 = false;
	                var _iteratorError3 = undefined;

	                try {
	                    for (var _iterator3 = (0, _getIterator3.default)(source), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                        var key = _step3.value;

	                        if (channel === key.channel) {
	                            obj.value += key[filter_key];
	                        }
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

	                array.push(obj);
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

	        array.sort(function (a, b) {
	            return b.value - a.value;
	        });
	        var top = array.length > 10 ? 10 : array.length;
	        for (var i = 0; i < top; i++) {
	            map[array[i].channel] = array[i].channel;
	        }
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(dates), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var date = _step2.value;

	                var obj = {};
	                for (var i = 0; i < top; i++) {
	                    obj[array[i].channel] = 0;
	                }
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (date === util.getDate(key.date)) {
	                            obj[key.channel] += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newData[date] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    channelTwo: function channelTwo(data) {
	        var source = data.data,
	            channels = util.uniq(_.pluck(source, "channel")),
	            total_new_users = 0,
	            obj = {},
	            newData = [];
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(channels), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var channel = _step5.value;

	                obj[channel] = {
	                    new_users: 0,
	                    active_users: 0,
	                    start_up: 0
	                };
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(source), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var key = _step6.value;

	                total_new_users += key.new_users;
	                obj[key.channel].new_users += key.new_users;
	                obj[key.channel].active_users += key.active_users;
	                obj[key.channel].start_up += key.start_up;
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;

	        try {
	            for (var _iterator7 = (0, _getIterator3.default)(channels), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                var channel = _step7.value;

	                newData.push({
	                    channel: channel,
	                    new_users: obj[channel].new_users,
	                    active_users: obj[channel].active_users,
	                    start_up: obj[channel].start_up,
	                    new_users_rate: util.toFixed(obj[channel].new_users, total_new_users)
	                });
	            }
	        } catch (err) {
	            _didIteratorError7 = true;
	            _iteratorError7 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                    _iterator7.return();
	                }
	            } finally {
	                if (_didIteratorError7) {
	                    throw _iteratorError7;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160329
	 * @fileoverview 数据概览
	 */

	var api = __webpack_require__(90),
	    moment = __webpack_require__(138),
	    util = __webpack_require__(82),
	    orm = __webpack_require__(135),
	    dataOverview = __webpack_require__(143);

	module.exports = function (Router) {
	    var now = new Date(),
	        ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
	        qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
	    Router = new api(Router, {
	        router: "/dataOverview/dataOverviewAllOne",
	        modelName: ['OverviewPlatf', "KpiValue"],
	        date_picker: false,
	        platform: false,
	        params: {
	            date: orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
	            region: "ALL",
	            day_type: 1
	        },
	        orderParams: {
	            date: orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
	            day_type: 1
	        },
	        filter: function filter(data, filter_key, dates) {
	            return dataOverview.dataOverviewAllOne(data, "H5");
	        },

	        rows: [['name', 'open_total', 'open_user_total', 'open_user_avg', 'new_user', 'new_user_rate', 'new_account', 'register_rate', 'stay_time_avg', 'using_time_avg', "pv1", "create"]],
	        cols: [[{
	            caption: ' ',
	            type: 'string'
	        }, {
	            caption: '启动次数',
	            type: 'number'
	        }, {
	            caption: '启动用户',
	            type: 'number'
	        }, {
	            caption: '人均启动次数',
	            type: 'string'
	        }, {
	            caption: '新用户',
	            type: 'number'
	        }, {
	            caption: '新用户占比',
	            type: 'string'
	        }, {
	            caption: '新增账户',
	            type: 'number'
	        }, {
	            caption: '注册转化率',
	            type: 'string'
	        }, {
	            caption: '每人使用时长(s)',
	            type: 'string'
	        }, {
	            caption: '每次使用时长(s)',
	            type: 'string'
	        }, {
	            caption: '累计访问用户数',
	            type: 'string'
	        }, {
	            caption: '累计注册用户数',
	            type: 'string'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/dataOverview/dataOverviewAllTwo",
	        modelName: ["OverviewPlatf"],
	        platform: false,
	        fixedParams: {
	            region: "ALL"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'open_user_total',
	                value: '启动用户'
	            }, {
	                key: 'open_total',
	                value: '启动次数'
	            }, {
	                key: 'new_user',
	                value: '新用户'
	            }, {
	                key: 'new_account',
	                value: '新增账户'
	            }, {
	                key: 'register_rate',
	                value: '注册转化率'
	            }, {
	                key: 'using_time_avg',
	                value: '每次使用时长'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return dataOverview.dataOverviewAllTwo(data, filter_key, {
	                open_user_total: "启动用户",
	                open_total: "启动次数",
	                new_user: "新用户",
	                new_account: "新增账户",
	                register_rate: "注册转化率(%)",
	                using_time_avg: "每次使用时长(s)"
	            }, dates, "H5");
	        }
	    });

	    Router = new api(Router, {
	        router: "/dataOverview/dataOverviewAllThree",
	        modelName: ["OverviewPlatf"],
	        platform: false,
	        date_picker: false,
	        params: {
	            date: orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
	            day_type: 1
	        },
	        flexible_btn: [{
	            content: '<a href="/terminal/provinces" target="_blank">查看全部</a>',
	            preMethods: [],
	            customMethods: ''
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return dataOverview.dataOverviewAllThree(data);
	        },

	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "地区",
	            type: "number"
	        }, {
	            caption: "访客数",
	            type: "number"
	        }, {
	            caption: "浏览量",
	            type: "number"
	        }, {
	            caption: "浏览量占比",
	            type: "number"
	        }]],
	        rows: [["id", "region", "uv", "pv", "pv_rate"]]
	    });

	    Router = new api(Router, {
	        router: "/dataOverview/dataOverviewAllFour",
	        modelName: ["OverviewPage"],
	        platform: false,
	        date_picker: false,
	        params: {
	            date: orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
	            day_type: 1
	        },
	        flexible_btn: [{
	            content: '<a href="/useAnalysis/accessPage" target="_blank">查看全部</a>',
	            preMethods: [],
	            customMethods: ''
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return dataOverview.dataOverviewAllFour(data);
	        },

	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "访问页面",
	            type: "number"
	        }, {
	            caption: "访问页面备注名称",
	            type: "number"
	        }, {
	            caption: "访问次数",
	            type: "number"
	        }, {
	            caption: "访问次数占比",
	            type: "number"
	        }]],
	        rows: [["id", "page_url", "page_describe", "pv", "pv_rate"]]
	    });

	    return Router;
	};

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author luoye
	 * @date 20160407
	 * @fileoverview 数据概览
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84);

	module.exports = {
	    dataOverviewAllOne: function dataOverviewAllOne(data, type) {
	        var source = data.data,
	            orderData = data.orderData,
	            newData = [],
	            now = new Date(),
	            zdate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
	            qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
	            dates = [zdate, qdate];
	        var obj = {
	            name: '对比效果'
	        },
	            total_new_users = 0;
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var date = _step.value;

	                var zObj = {
	                    name: "",
	                    open_total: 0,
	                    open_user_total: 0,
	                    open_user_avg: 0,
	                    new_user: 0,
	                    new_user_rate: "",
	                    new_account: 0,
	                    register_rate: 0,
	                    using_time_avg: 0,
	                    uv: 0,
	                    pv: 0,
	                    ip_count: 0,
	                    jump_loss_rate: 0,
	                    visit_time_avg: 0,
	                    stay_time_avg: 0,
	                    pv1: 0,
	                    create: 0
	                };
	                var _iteratorNormalCompletion3 = true;
	                var _didIteratorError3 = false;
	                var _iteratorError3 = undefined;

	                try {
	                    for (var _iterator3 = (0, _getIterator3.default)(orderData), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                        var key = _step3.value;

	                        if (new Date(date + " 00:00:00").getTime() < key.date.getTime() && key.date.getTime() < new Date(date + " 23:59:59")) {
	                            if (key.kpi_type === 1) {
	                                zObj.pv1 += key.kpi_value;
	                            }
	                            if (key.kpi_type === 2) {
	                                zObj.create += key.kpi_value;
	                            }
	                        }
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

	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (type && key.type === type) {
	                            continue;
	                        }
	                        if (new Date(date + " 00:00:00").getTime() < key.date.getTime() && key.date.getTime() < new Date(date + " 23:59:59")) {
	                            total_new_users += key.new_user;
	                            zObj.open_total += key.open_total;
	                            zObj.open_user_total += key.open_user_total;
	                            zObj.new_user += key.new_user;
	                            zObj.new_account += key.new_account;
	                            zObj.stay_time_avg += Math.round(key.stay_time_avg);
	                            zObj.using_time_avg += Math.round(key.using_time_avg);
	                            zObj.uv += key.uv;
	                            zObj.pv += key.pv;
	                            zObj.ip_count += key.ip_count;
	                            zObj.jump_loss_rate += key.jump_loss_rate;
	                            zObj.visit_time_avg += Math.round(key.visit_time_avg);
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newData.push(zObj);
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(newData), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                key.new_user_rate = util.toFixed(key.new_user, total_new_users);
	                key.open_user_avg = (key.open_user_total / (key.open_total === 0 ? 1 : key.open_total) * 100).toFixed(2);
	                key.register_rate = util.toFixed(key.new_account, key.new_user);
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

	        newData[0].name = "昨天";
	        newData[1].name = "前天";
	        obj.open_total = ((newData[0].open_total - newData[1].open_total) / (newData[0].open_total === 0 ? 1 : newData[0].open_total) * 100).toFixed(2) + "%";
	        obj.jump_loss_rate = ((newData[0].jump_loss_rate - newData[1].jump_loss_rate) / (newData[0].jump_loss_rate === 0 ? 1 : newData[0].jump_loss_rate) * 100).toFixed(2) + "%";
	        obj.open_user_total = ((newData[0].open_user_total - newData[1].open_user_total) / (newData[0].open_user_total === 0 ? 1 : newData[0].open_user_total) * 100).toFixed(2) + "%";
	        obj.new_user = ((newData[0].new_user - newData[1].new_user) / (newData[0].new_user === 0 ? 1 : newData[0].new_user) * 100).toFixed(2) + "%";
	        obj.new_account = ((newData[0].new_account - newData[1].new_account) / (newData[0].new_account === 0 ? 1 : newData[0].new_account) * 100).toFixed(2) + "%";
	        obj.stay_time_avg = ((newData[0].stay_time_avg - newData[1].stay_time_avg) / (newData[0].stay_time_avg === 0 ? 1 : newData[0].stay_time_avg) * 100).toFixed(2) + "%";
	        obj.using_time_avg = ((newData[0].using_time_avg - newData[1].using_time_avg) / (newData[0].using_time_avg === 0 ? 1 : newData[0].using_time_avg) * 100).toFixed(2) + "%";
	        obj.uv = ((newData[0].uv - newData[1].uv) / (newData[0].uv === 0 ? 1 : newData[0].uv) * 100).toFixed(2) + "%";
	        obj.pv = ((newData[0].pv - newData[1].pv) / (newData[0].pv === 0 ? 1 : newData[0].pv) * 100).toFixed(2) + "%";
	        obj.ip_count = ((newData[0].ip_count - newData[1].ip_count) / (newData[0].ip_count === 0 ? 1 : newData[0].ip_count) * 100).toFixed(2) + "%";
	        obj.visit_time_avg = ((newData[0].visit_time_avg - newData[1].visit_time_avg) / (newData[0].visit_time_avg === 0 ? 1 : newData[0].visit_time_avg) * 100).toFixed(2) + "%";
	        obj.open_user_avg = ((newData[0].open_user_avg - newData[1].open_user_avg) / (newData[0].open_user_avg === "0.00" ? 1 : newData[0].open_user_avg) * 100).toFixed(2) + "%";
	        obj.register_rate = (newData[0].register_rate.replace("%", "") - newData[1].register_rate.replace("%", "")).toFixed(2) + "%";
	        obj.new_user_rate = (newData[0].new_user_rate.replace("%", "") - newData[1].new_user_rate.replace("%", "")).toFixed(2) + "%";
	        obj.pv1 = ((newData[0].pv1 - newData[1].pv1) / (newData[0].pv1 === 0 ? 1 : newData[0].pv1) * 100).toFixed(2) + "%";
	        obj.create = ((newData[0].create - newData[1].create) / (newData[0].create === 0 ? 1 : newData[0].create) * 100).toFixed(2) + "%";
	        newData.push(obj);
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    dataOverviewAllTwo: function dataOverviewAllTwo(data, filter_key, filter_name, dates, type_key) {
	        var source = data.data,
	            newData = {},
	            type = "line",
	            map = {
	            value: filter_name[filter_key]
	        };
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(dates), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var date = _step5.value;

	                newData[date] = {
	                    value: 0
	                };
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(source), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var key = _step6.value;

	                if (type_key && key.type === type_key) {
	                    continue;
	                }
	                if (filter_key === "register_rate") {
	                    newData[util.getDate(key.date)].value += key.new_account / (key.new_user === 0 ? 1 : key.new_user) * 100;
	                } else {
	                    newData[util.getDate(key.date)].value += key[filter_key];
	                }
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        if (filter_key === "register_rate") {
	            (0, _keys2.default)(newData).forEach(function (key) {
	                newData[key].value = newData[key].value.toFixed(2);
	            });
	        }
	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }];
	    },
	    dataOverviewAllThree: function dataOverviewAllThree(data) {
	        var source = data.data,
	            newData = [],
	            total_pv = 0,
	            length = source.length,
	            top = length > 10 ? 10 : length;
	        source.sort(function (a, b) {
	            return b.pv - a.pv;
	        });
	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;

	        try {
	            for (var _iterator7 = (0, _getIterator3.default)(source), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                var key = _step7.value;

	                if (key.region === "ALL") {
	                    continue;
	                }
	                total_pv += key.pv;
	            }
	        } catch (err) {
	            _didIteratorError7 = true;
	            _iteratorError7 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                    _iterator7.return();
	                }
	            } finally {
	                if (_didIteratorError7) {
	                    throw _iteratorError7;
	                }
	            }
	        }

	        for (var i = 0; i < top; i++) {
	            if (source[i]) {
	                if (source[i].region === "ALL") {
	                    top++;
	                } else {
	                    newData.push(source[i]);
	                }
	            }
	        }
	        for (var i = 0; i < newData.length; i++) {
	            newData[i].id = i + 1;
	            newData[i].pv_rate = util.toFixed(newData[i].pv, total_pv);
	        }
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    dataOverviewAllFour: function dataOverviewAllFour(data) {
	        var source = data.data,
	            top = source.length > 10 ? 10 : source.length,
	            total_pv = 0,
	            newData = [];
	        source.sort(function (a, b) {
	            return b.pv - a.pv;
	        });
	        var _iteratorNormalCompletion8 = true;
	        var _didIteratorError8 = false;
	        var _iteratorError8 = undefined;

	        try {
	            for (var _iterator8 = (0, _getIterator3.default)(source), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                var key = _step8.value;

	                total_pv += key.pv;
	            }
	        } catch (err) {
	            _didIteratorError8 = true;
	            _iteratorError8 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                    _iterator8.return();
	                }
	            } finally {
	                if (_didIteratorError8) {
	                    throw _iteratorError8;
	                }
	            }
	        }

	        for (var i = 0; i < top; i++) {
	            source[i].id = i + 1;
	            newData.push(source[i]);
	        }
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;

	        try {
	            for (var _iterator9 = (0, _getIterator3.default)(newData), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                var key = _step9.value;

	                key.pv_rate = util.toFixed(key.pv, total_pv);
	            }
	        } catch (err) {
	            _didIteratorError9 = true;
	            _iteratorError9 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                    _iterator9.return();
	                }
	            } finally {
	                if (_didIteratorError9) {
	                    throw _iteratorError9;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160412
	 * @fileoverview 数据概览
	 */

	var api = __webpack_require__(90),
	    moment = __webpack_require__(138),
	    util = __webpack_require__(82),
	    orm = __webpack_require__(135),
	    dataOverview = __webpack_require__(143);

	module.exports = function (Router) {
	    var now = new Date(),
	        ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
	        qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
	    Router = new api(Router, {
	        router: "/dataOverview/wapOne",
	        modelName: ['OverviewPlatf', "KpiValue"],
	        date_picker: false,
	        platform: false,
	        params: {
	            date: orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
	            region: "ALL",
	            type: "H5",
	            day_type: 1
	        },
	        orderParams: {
	            date: orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
	            day_type: 1
	        },
	        filter: function filter(data, filter_key, dates) {
	            return dataOverview.dataOverviewAllOne(data, "");
	        },

	        rows: [['name', 'uv', 'pv', 'ip_count', 'jump_loss_rate', 'new_user', 'new_user_rate', 'new_account', 'register_rate', 'visit_time_avg', "pv1", "create"]],
	        cols: [[{
	            caption: ' ',
	            type: 'string'
	        }, {
	            caption: '访客数',
	            type: 'number'
	        }, {
	            caption: '浏览量',
	            type: 'number'
	        }, {
	            caption: 'IP数',
	            type: 'number'
	        }, {
	            caption: '跳出率',
	            type: 'number'
	        }, {
	            caption: '新用户',
	            type: 'number'
	        }, {
	            caption: '新用户占比',
	            type: 'string'
	        }, {
	            caption: '新增账户',
	            type: 'number'
	        }, {
	            caption: '注册转化率',
	            type: 'string'
	        }, {
	            caption: '平均访问时长(s)',
	            type: 'string'
	        }, {
	            caption: '累计访问用户数',
	            type: 'string'
	        }, {
	            caption: '累计注册用户数',
	            type: 'string'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/dataOverview/wapTwo",
	        modelName: ["OverviewPlatf"],
	        fixedParams: {
	            region: "ALL",
	            type: "H5"
	        },
	        platform: false,
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'uv',
	                value: '访客数'
	            }, {
	                key: 'pv',
	                value: '浏览量'
	            }, {
	                key: 'ip_count',
	                value: 'IP数'
	            }, {
	                key: 'new_user',
	                value: '新用户'
	            }, {
	                key: 'new_account',
	                value: '新增账户'
	            }, {
	                key: 'visit_time_avg',
	                value: '平均访问时长'
	            }, {
	                key: 'register_rate',
	                value: '注册转化率'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return dataOverview.dataOverviewAllTwo(data, filter_key, {
	                uv: "访客数",
	                pv: "浏览量",
	                ip_count: "IP数",
	                new_user: "新用户",
	                new_account: "新增账户",
	                visit_time_avg: "平均访问时长(s)",
	                register_rate: "注册转化率(%)"
	            }, dates, "");
	        }
	    });

	    Router = new api(Router, {
	        router: "/dataOverview/wapThree",
	        modelName: ["OverviewPlatf"],
	        date_picker: false,
	        platform: false,
	        params: {
	            date: orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
	            day_type: 1
	        },
	        flexible_btn: [{
	            content: '<a href="/terminal/provinces" target="_blank">查看全部</a>',
	            preMethods: [],
	            customMethods: ''
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return dataOverview.dataOverviewAllThree(data);
	        },

	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "地区",
	            type: "number"
	        }, {
	            caption: "访客数",
	            type: "number"
	        }, {
	            caption: "浏览量",
	            type: "number"
	        }, {
	            caption: "浏览量占比",
	            type: "number"
	        }]],
	        rows: [["id", "region", "uv", "pv", "pv_rate"]]
	    });

	    Router = new api(Router, {
	        router: "/dataOverview/wapFour",
	        modelName: ["OverviewPage"],
	        date_picker: false,
	        platform: false,
	        params: {
	            date: orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
	            day_type: 1
	        },
	        flexible_btn: [{
	            content: '<a href="/useAnalysis/accessPage" target="_blank">查看全部</a>',
	            preMethods: [],
	            customMethods: ''
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return dataOverview.dataOverviewAllFour(data);
	        },

	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "访问页面",
	            type: "number"
	        }, {
	            caption: "访问页面备注名称",
	            type: "number"
	        }, {
	            caption: "访问次数",
	            type: "number"
	        }, {
	            caption: "访问次数占比",
	            type: "number"
	        }]],
	        rows: [["id", "page_url", "page_describe", "pv", "pv_rate"]]
	    });

	    return Router;
	};

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 活动流量
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(146);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/marketingAnalysis/activityFlowOne",
	        modelName: ["MarketingFlow"],
	        platform: false,
	        filter_select: [{
	            title: '',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'visitor_cut',
	                value: '访问用户数'
	            }, {
	                key: 'pv',
	                value: '访问次数'
	            }, {
	                key: 'stay_time_avg',
	                value: '平均停留时长'
	            }, {
	                key: 'jump_loss_rate',
	                value: '页面跳失率'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.activityFlowOne(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/marketingAnalysis/activityFlowTwo",
	        modelName: ["MarketingFlow"],
	        platform: false,
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.activityFlowTwo(data);
	        },

	        rows: [['id', 'page_url', 'page_name', 'visitor_cut', 'pv', 'stay_time_avg', 'jump_loss_rate', 'h5_conversion_rate', 'operating']],
	        cols: [[{
	            caption: '序号',
	            type: 'number'
	        }, {
	            caption: '页面地址',
	            type: 'string'
	        }, {
	            caption: '页面名称',
	            type: 'string'
	        }, {
	            caption: '访问用户数',
	            type: 'number'
	        }, {
	            caption: '访问次数',
	            type: 'number'
	        }, {
	            caption: '平均停留时长(s)',
	            type: 'string'
	        }, {
	            caption: '页面跳失率',
	            type: 'string'
	        }, {
	            caption: '进入商品页转化率',
	            type: 'string'
	        }, {
	            caption: '操作'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/marketingAnalysis/activityFlowThree",
	        modelName: ["MarketingFlow"],
	        platform: false,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.activityFlowThree(data);
	        },

	        rows: [['date', 'page_url', 'page_name', 'visitor_cut', 'pv', 'stay_time_avg', 'jump_loss_rate', 'h5_conversion_rate']],
	        cols: [[{
	            caption: '时间',
	            type: 'number'
	        }, {
	            caption: '页面地址',
	            type: 'string'
	        }, {
	            caption: '页面名称',
	            type: 'string'
	        }, {
	            caption: '访问用户数',
	            type: 'number'
	        }, {
	            caption: '访问次数',
	            type: 'number'
	        }, {
	            caption: '平均停留时长',
	            type: 'string'
	        }, {
	            caption: '页面跳失率',
	            type: 'string'
	        }, {
	            caption: '进入商品页转化率',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 活动流量
	 */
	var util = __webpack_require__(82),
	    moment = __webpack_require__(138),
	    _ = __webpack_require__(84);

	module.exports = {
	    activityFlowOne: function activityFlowOne(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            filter_name = {
	            visitor_cut: "访问用户数",
	            pv: "访问次数",
	            stay_time_avg: "平均停留时长(s)",
	            jump_loss_rate: "页面跳失率(%)"
	        },
	            map = {
	            value: filter_name[filter_key]
	        },
	            newData = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var date = _step.value;

	                newData[date] = {
	                    value: 0
	                };
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                newData[util.getDate(key.date)].value += key[filter_key];
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

	        if (filter_key === "stay_time_avg") {
	            (0, _keys2.default)(newData).forEach(function (key) {
	                newData[key].value = Math.round(newData[key].value);
	            });
	        }
	        if (filter_key === "jump_loss_rate") {
	            (0, _keys2.default)(newData).forEach(function (key) {
	                newData[key].value = newData[key].value.toFixed(2);
	            });
	        }
	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    activityFlowTwo: function activityFlowTwo(data) {
	        var source = data.data,
	            urls = util.uniq(_.pluck(source, "page_url")),
	            obj = {},
	            newData = [];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(urls), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var url = _step3.value;

	                obj[url] = {
	                    page_url: url,
	                    page_name: "",
	                    visitor_cut: 0,
	                    pv: 0,
	                    stay_time_avg: 0,
	                    jump_loss_rate: 0,
	                    h5_conversion_rate: 0,
	                    operating: ""
	                };
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

	        for (var i = 0; i < source.length; i++) {
	            obj[source[i].page_url].page_name = source[i].page_name;
	            obj[source[i].page_url].visitor_cut += source[i].visitor_cut;
	            obj[source[i].page_url].pv += source[i].pv;
	            obj[source[i].page_url].stay_time_avg += source[i].stay_time_avg;
	            obj[source[i].page_url].jump_loss_rate += source[i].jump_loss_rate;
	            obj[source[i].page_url].h5_conversion_rate += source[i].h5_conversion_rate;
	            obj[source[i].page_url].operating = "<button class='btn btn-default' url_detail='/marketingAnalysis/activityFlowThree'>详情>></button>";
	        }
	        for (var i = 0; i < urls.length; i++) {
	            newData.push({
	                id: i + 1,
	                page_url: urls[i],
	                page_name: obj[urls[i]].page_name,
	                visitor_cut: obj[urls[i]].visitor_cut,
	                pv: obj[urls[i]].pv,
	                stay_time_avg: Math.round(obj[urls[i]].stay_time_avg),
	                jump_loss_rate: obj[urls[i]].jump_loss_rate.toFixed(2) + "%",
	                h5_conversion_rate: obj[urls[i]].h5_conversion_rate.toFixed(2) + "%",
	                operating: obj[urls[i]].operating
	            });
	        }
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    activityFlowThree: function activityFlowThree(data) {
	        var source = data.data;
	        source.sort(function (a, b) {
	            return b.date - a.date;
	        });
	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                key.date = moment(key.date).format("YYYY-MM-DD");
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 优惠券信息
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(148);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/marketingAnalysis/couponInfoOne",
	        modelName: ["MarketingCoupon"],
	        platform: false,
	        coupon: true,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.couponInfoOne(data);
	        }
	    });

	    Router = new api(Router, {
	        router: "/marketingAnalysis/couponInfoTwo",
	        modelName: ["MarketingCouponDetails"],
	        platform: false,
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.couponInfoTwo(data);
	        },

	        rows: [['date', 'coupon_id', 'coupon_type', 'shop_name', 'coupon_scope', 'coupon_facevalue', 'coupon_describe', 'coupon_status']],
	        cols: [[{
	            caption: '时间',
	            type: 'string',
	            width: 20
	        }, {
	            caption: '优惠券ID',
	            type: 'string'
	        }, {
	            caption: '优惠券类型',
	            type: 'string'
	        }, {
	            caption: '商家名称',
	            type: 'string'
	        }, {
	            caption: '使用范围',
	            type: 'string'
	        }, {
	            caption: '优惠券面值',
	            type: 'string'
	        }, {
	            caption: '优惠活动',
	            type: 'string'
	        }, {
	            caption: '优惠券状态',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 优惠券信息
	 */
	var _ = __webpack_require__(84),
	    util = __webpack_require__(82);

	module.exports = {
	    couponInfoOne: function couponInfoOne(data) {
	        var source = data.data,
	            type = "bar",
	            map = {
	            get_coupon_cut: "领取数量",
	            used_coupon_cut: "使用数量",
	            users_rate: "优惠券使用率"
	        },
	            newData = {},
	            coupons = util.uniq(_.pluck(source, "coupon_facevalue")),
	            length = coupons.length;
	        coupons.sort(function (a, b) {
	            return a - b;
	        });
	        for (var i = 0; i < length; i++) {
	            if (isNaN(new Number(coupons[i]))) {
	                var obj = coupons[i];
	                for (var x = i; x < length; x++) {
	                    coupons[x] = coupons[x + 1];
	                }
	                coupons[length - 1] = obj;
	            }
	        }
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(coupons), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var coupon = _step.value;

	                var obj = {
	                    get_coupon_cut: 0,
	                    used_coupon_cut: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var key = _step2.value;

	                        if (coupon === key.coupon_facevalue) {
	                            obj.get_coupon_cut += key.get_coupon_cut;
	                            obj.used_coupon_cut += key.used_coupon_cut;
	                        }
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

	                newData[coupon] = obj;
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

	        (0, _keys2.default)(newData).forEach(function (key) {
	            newData[key].users_rate = newData[key].used_coupon_cut / (newData[key].get_coupon_cut === 0 ? 1 : newData[key].get_coupon_cut) * 100;
	        });
	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    couponInfoTwo: function couponInfoTwo(data) {
	        var source = data.data;
	        source.sort(function (a, b) {
	            return b.date - a.date;
	        });
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 活动总览
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(150);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/marketingAnalysis/overviewOne",
	        modelName: ["MarketingFlow"],
	        platform: false,
	        date_picker_data: 1,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.overviewOne(data);
	        },

	        rows: [['visitor_cut', 'pv', 'jump_loss_rate', 'h5_conversion_rate']],
	        cols: [[{
	            caption: '访客数',
	            type: 'number'
	        }, {
	            caption: '浏览量',
	            type: 'number'
	        }, {
	            caption: '跳失率',
	            type: 'number'
	        }, {
	            caption: '活动页H5转化率',
	            type: 'number'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 活动总览
	 */
	var util = __webpack_require__(82);

	module.exports = {
	    overviewOne: function overviewOne(data) {
	        var source = data.data,
	            newData = [],
	            obj = {
	            visitor_cut: 0,
	            pv: 0,
	            jump_loss_rate: 0,
	            h5_conversion_rate: 0
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                obj.visitor_cut += key.visitor_cut;
	                obj.pv += key.pv;
	                obj.jump_loss_rate += key.jump_loss_rate;
	                obj.h5_conversion_rate += key.h5_conversion_rate;
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

	        obj.jump_loss_rate = obj.jump_loss_rate.toFixed(2) + "%";
	        obj.h5_conversion_rate = obj.h5_conversion_rate.toFixed(2) + "%";
	        newData.push(obj);
	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160401
	 * @fileoverview 平台返利汇总
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(152);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/platformRebate/platformOrderOne",
	        modelName: ["Rebate", "RebateRefund"],
	        level_select: true,
	        platform: false,
	        date_picker_data: 1,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformOrderOne(data);
	        },

	        rows: [["name", "order_count", "rebate_order_amount_count", "participate_seller_count", "participate_user_count", "participate_goods_count"], ["rebate_order_count", "rebate_order_amount_count", "rebate_order_amount_actual_count", "rebate_amount_count", "rate"], ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count", "refund_goods_amount_actual_count"]],
	        cols: [[{
	            caption: "",
	            type: "string"
	        }, {
	            caption: "订单数",
	            type: "string"
	        }, {
	            caption: "订单总金额",
	            type: "string"
	        }, {
	            caption: "商家数",
	            type: "string"
	        }, {
	            caption: "用户数",
	            type: "string"
	        }, {
	            caption: "商品件数",
	            type: "string"
	        }], [{
	            caption: "返利到账订单数",
	            type: "string"
	        }, {
	            caption: "返利到账订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账订单实付金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "string"
	        }, {
	            caption: "返利比率",
	            type: "string"
	        }], [{
	            caption: "",
	            type: "string"
	        }, {
	            caption: "退货商品数",
	            type: "string"
	        }, {
	            caption: "退货商品件数",
	            type: "string"
	        }, {
	            caption: "退货用户数",
	            type: "string"
	        }, {
	            caption: "退货商品总金额",
	            type: "string"
	        }, {
	            caption: "实际退货金额",
	            type: "string"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformOrderTwe",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'order_count',
	                value: '订单数'
	            }, {
	                key: 'order_amount_count',
	                value: '订单总金额'
	            }, {
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformOrderTwe(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformOrderThree",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }, {
	                key: 'goods_amount_count',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformOrderThree(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformOrderFour",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }, {
	                key: 'goods_amount_count',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformOrderFour(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformOrderFive",
	        modelName: ["RebatetSheduleDetails"],
	        excel_export: true,
	        platform: false,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter_select: [{
	            title: '使用方',
	            filter_key: 'user_party',
	            groups: [{
	                key: '单项单级返利',
	                value: '单项单级返利',
	                cell: {
	                    title: '关联流程',
	                    filter_key: 'correlate_flow',
	                    groups: [{
	                        key: '固定返利',
	                        value: '固定返利'
	                    }, {
	                        key: '比例返利',
	                        value: '比例返利'
	                    }]
	                }
	            }, {
	                key: '平台基础返利',
	                value: '平台基础返利',
	                cell: {
	                    title: '关联流程',
	                    filter_key: 'correlate_flow',
	                    groups: [{
	                        key: '分享购买',
	                        value: '分享购买'
	                    }, {
	                        key: '邀请好友-购买返利',
	                        value: '邀请好友-购买返利'
	                    }, {
	                        key: '邀请好友-固定返利',
	                        value: '邀请好友-固定返利'
	                    }]
	                }
	            }, {
	                key: '平台促销返利',
	                value: '平台促销返利',
	                cell: {
	                    title: '关联流程',
	                    filter_key: 'correlate_flow',
	                    groups: [{
	                        key: '分享购买',
	                        value: '分享购买'
	                    }, {
	                        key: '邀请好友-购买返利',
	                        value: '邀请好友-购买返利'
	                    }, {
	                        key: '邀请好友-固定返利',
	                        value: '邀请好友-固定返利'
	                    }]
	                }
	            }, {
	                key: '邀请商家入驻返利',
	                value: '邀请商家入驻返利',
	                cell: {
	                    title: '关联流程',
	                    filter_key: 'correlate_flow',
	                    groups: [{
	                        key: '固定返利',
	                        value: '固定返利'
	                    }, {
	                        key: '分享购买',
	                        value: '分享购买'
	                    }]
	                }
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformOrderFive(data);
	        },

	        rows: [["id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "level", "participate_seller_count", "participate_goods_count", "participate_user_count", "order_rate", "price_rate", "rebate_amount"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "返利计划名称",
	            type: "string"
	        }, {
	            caption: "使用方",
	            type: "string"
	        }, {
	            caption: "有效期",
	            type: "string"
	        }, {
	            caption: "相关流程",
	            type: "string"
	        }, {
	            caption: "层级",
	            type: "string"
	        }, {
	            caption: "参与商家数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "新增订单数/订单总数",
	            type: "string"
	        }, {
	            caption: "新增订单金额/订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160407
	 * @fileoverview 平台返利汇总
	 */
	var _ = __webpack_require__(84),
	    util = __webpack_require__(82);

	module.exports = {
	    platformOrderOne: function platformOrderOne(data) {
	        var source = data.data,
	            orderSource = data.orderData,
	            oneOne = 0,
	            oneTwo = 0,
	            oneThree = 0,
	            oneFour = 0,
	            oneFive = 0,
	            one = [],
	            two = [],
	            three = [],
	            objOne = {
	            name: "返利订单",
	            order_count: 0,
	            rebate_order_amount_count: 0,
	            participate_seller_count: 0,
	            participate_user_count: 0,
	            participate_goods_count: 0
	        },
	            objTwo = {
	            rebate_order_count: 0,
	            rebate_order_amount_count: 0,
	            rebate_order_amount_actual_count: 0,
	            rebate_amount_count: 0
	        },
	            objThree = {
	            name: "返利订单",
	            spu_count: 0,
	            total_spu_num: 0,
	            sku_count: 0,
	            total_sku_num: 0,
	            refund_user_count: 0,
	            total_user_num: 0,
	            refund_goods_amount_count: 0,
	            total_amount: 0,
	            refund_goods_amount_actual_count: 0,
	            total_amount_actual: 0
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                oneOne += key.total_order_num;
	                oneTwo += key.total_order_amount;
	                oneThree += key.total_shop_num;
	                oneFour += key.participate_user_count;
	                oneFive += key.total_product_sku_num;
	                objOne.order_count += key.order_count;
	                objOne.rebate_order_amount_count += key.rebate_order_amount_count;
	                objOne.participate_seller_count += key.participate_seller_count;
	                objOne.participate_user_count += key.participate_user_count;
	                objOne.participate_goods_count += key.participate_goods_count;
	                objTwo.rebate_order_count += key.rebate_order_count;
	                objTwo.rebate_order_amount_count += key.rebate_order_amount_count;
	                objTwo.rebate_order_amount_actual_count += key.rebate_order_amount_actual_count;
	                objTwo.rebate_amount_count += key.rebate_amount_count;
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(orderSource), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                objThree.spu_count += key.spu_count;
	                objThree.sku_count += key.sku_count;
	                objThree.refund_user_count += key.refund_user_count;
	                objThree.refund_goods_amount_count += key.refund_goods_amount_count;
	                objThree.refund_goods_amount_actual_count += key.refund_goods_amount_actual_count;
	                objThree.total_spu_num = key.total_spu_num;
	                objThree.total_sku_num = key.total_sku_num;
	                objThree.total_user_num = key.total_user_num;
	                objThree.total_amount = key.total_amount;
	                objThree.total_amount_actual = key.total_amount_actual;
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

	        one.push(objOne);
	        one.push({
	            name: "总占比",
	            order_count: util.toFixed(objOne.order_count, oneOne),
	            rebate_order_amount_count: util.toFixed(objOne.rebate_order_amount_count, oneTwo),
	            participate_seller_count: util.toFixed(objOne.participate_seller_count, oneThree),
	            participate_user_count: util.toFixed(objOne.participate_user_count, oneFour),
	            participate_goods_count: util.toFixed(objOne.participate_goods_count, oneFive)
	        });
	        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
	        two.push(objTwo);
	        three.push(objThree);
	        three.push({
	            name: "返利退货订单占比",
	            spu_count: util.toFixed(objThree.spu_count, objThree.total_spu_num),
	            sku_count: util.toFixed(objThree.sku_count, objThree.total_sku_num),
	            refund_user_count: util.toFixed(objThree.refund_user_count, objThree.total_user_num),
	            refund_goods_amount_count: util.toFixed(objThree.refund_goods_amount_count, objThree.total_amount),
	            refund_goods_amount_actual_count: util.toFixed(objThree.refund_goods_amount_actual_count, objThree.total_amount_actual)
	        });
	        return util.toTable([one, two, three], data.rows, data.cols);
	    },
	    platformOrderTwe: function platformOrderTwe(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            array = ["单项单级返利", "平台基础返利", "平台促销返利", "邀请商家入驻返利"],
	            newData = {},
	            map = {};
	        map[filter_key + "_0"] = array[0];
	        map[filter_key + "_1"] = array[1];
	        map[filter_key + "_2"] = array[2];
	        map[filter_key + "_3"] = array[3];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                var obj = {};
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (date === util.getDate(key.date)) {
	                            for (var i = 0; i < array.length; i++) {
	                                if (key.rebate_type === array[i]) {
	                                    obj[filter_key + "_" + i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newData[date] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            config: {
	                stack: false
	            },
	            data: newData
	        }];
	    },
	    platformOrderThree: function platformOrderThree(data, filter_key) {
	        var source = data.data,
	            typePie = "pie",
	            typeBar = "bar",
	            mapPie = {},
	            mapBar = {},
	            newDataPie = {},
	            newDataBar = {},
	            filter_name = {
	            goods_sku_count: "商品件数",
	            goods_amount_count: "商品总金额",
	            rebate_amount_count: "返利到账金额"
	        },
	            XPie = ["1级", "2级", "3级", "4级"],
	            XBar = ["层级1", "层级2", "层级3", "层级4"];
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(XPie), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var level = _step5.value;

	                var obj = {};
	                obj.value = 0;
	                var _iteratorNormalCompletion7 = true;
	                var _didIteratorError7 = false;
	                var _iteratorError7 = undefined;

	                try {
	                    for (var _iterator7 = (0, _getIterator3.default)(source), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                        var key = _step7.value;

	                        if (level === key.grade) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError7 = true;
	                    _iteratorError7 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                            _iterator7.return();
	                        }
	                    } finally {
	                        if (_didIteratorError7) {
	                            throw _iteratorError7;
	                        }
	                    }
	                }

	                newDataPie[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(XPie), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var level = _step6.value;

	                var obj = {};
	                for (var i = 0; i < XBar.length; i++) {
	                    obj[i] = 0;
	                }
	                var _iteratorNormalCompletion8 = true;
	                var _didIteratorError8 = false;
	                var _iteratorError8 = undefined;

	                try {
	                    for (var _iterator8 = (0, _getIterator3.default)(source), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                        var key = _step8.value;

	                        if (key.level === level) {
	                            for (var i = 0; i < XBar.length; i++) {
	                                if (key.grade === XBar[i]) {
	                                    obj[i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError8 = true;
	                    _iteratorError8 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                            _iterator8.return();
	                        }
	                    } finally {
	                        if (_didIteratorError8) {
	                            throw _iteratorError8;
	                        }
	                    }
	                }

	                newDataBar[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        for (var i = 0; i < XBar.length; i++) {
	            mapBar[i] = XBar[i];
	        }
	        mapPie.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: mapPie,
	            data: newDataPie,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: mapBar,
	            data: newDataBar,
	            config: {
	                stack: true
	            }
	        }];
	    },
	    platformOrderFour: function platformOrderFour(data, filter_key) {
	        var source = data.data,
	            newData = {},
	            map = {},
	            typePie = "pie",
	            typeBar = "bar",
	            filter_name = {
	            goods_sku_count: "商品件数",
	            goods_amount_count: "商品总金额",
	            rebate_amount_count: "返利到账金额"
	        },
	            XData = ["单项单级返利", "平台基础返利", "平台促销返利", "邀请商家入驻返利"];
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;

	        try {
	            for (var _iterator9 = (0, _getIterator3.default)(XData), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                var x = _step9.value;

	                var obj = {
	                    value: 0
	                };
	                var _iteratorNormalCompletion10 = true;
	                var _didIteratorError10 = false;
	                var _iteratorError10 = undefined;

	                try {
	                    for (var _iterator10 = (0, _getIterator3.default)(source), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                        var key = _step10.value;

	                        if (x === key.rebate_type) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError10 = true;
	                    _iteratorError10 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                            _iterator10.return();
	                        }
	                    } finally {
	                        if (_didIteratorError10) {
	                            throw _iteratorError10;
	                        }
	                    }
	                }

	                newData[x] = obj;
	            }
	        } catch (err) {
	            _didIteratorError9 = true;
	            _iteratorError9 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                    _iterator9.return();
	                }
	            } finally {
	                if (_didIteratorError9) {
	                    throw _iteratorError9;
	                }
	            }
	        }

	        map.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }];
	    },
	    platformOrderFive: function platformOrderFive(data) {
	        var source = data.data;
	        source.forEach(function (key, value) {
	            key.id = value + 1;
	            key.order_rate = key.new_order_count + "/" + key.order_all_count;
	            key.price_rate = key.new_order_amount + "/" + key.order_all_amount;
	        });
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160408
	 * @fileoverview 单项单级返利
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(154);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/platformRebate/individualEventOne",
	        modelName: ["Rebate", "RebateRefund"],
	        fixedParams: {
	            user_party: "单项单级返利"
	        },
	        platform: false,
	        date_picker_data: 1,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.individualEventOne(data);
	        },

	        rows: [["defate_plan_count", "participate_seller_count", "participate_goods_count", "order_count", "participate_user_count"], ["rebate_order_count", "rebate_order_amount_count", "rebate_order_amount_actual_count", "rebate_amount_count", "rate"], ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count", "refund_goods_amount_actual_count"]],
	        cols: [[{
	            caption: "返利计划书",
	            type: "string"
	        }, {
	            caption: "参与商户数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "订单数",
	            type: "number"
	        }, {
	            caption: "用户数",
	            type: "number"
	        }], [{
	            caption: "返利到账订单数",
	            type: "string"
	        }, {
	            caption: "返利订单总金额",
	            type: "string"
	        }, {
	            caption: "返利订单实付金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "string"
	        }, {
	            caption: "返利比率",
	            type: "string"
	        }], [{
	            caption: "",
	            type: "string"
	        }, {
	            caption: "退货商品数",
	            type: "string"
	        }, {
	            caption: "退货商品件数",
	            type: "string"
	        }, {
	            caption: "退货用户数",
	            type: "string"
	        }, {
	            caption: "退货商品总金额",
	            type: "string"
	        }, {
	            caption: "实际退货金额",
	            type: "string"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/individualEventTwo",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        fixedParams: {
	            user_party: "单项单级返利"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'order_count',
	                value: '订单数'
	            }, {
	                key: 'order_amount_count',
	                value: '订单总金额'
	            }, {
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.individualEventTwo(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/individualEventThree",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        fixedParams: {
	            user_party: "单项单级返利"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }, {
	                key: 'goods_amount_count',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.individualEventThree(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/individualEventFour",
	        modelName: ["RebatetSheduleDetails"],
	        fixedParams: {
	            user_party: "单项单级返利"
	        },
	        platform: false,
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.individualEventFour(data);
	        },

	        rows: [["id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "level", "participate_seller_count", "participate_goods_count", "participate_user_count", "order_rate", "price_rate", "rebate_amount"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "返利计划名称",
	            type: "string"
	        }, {
	            caption: "使用方",
	            type: "string"
	        }, {
	            caption: "有效期",
	            type: "string"
	        }, {
	            caption: "相关流程",
	            type: "string"
	        }, {
	            caption: "层级",
	            type: "string"
	        }, {
	            caption: "参与商家数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "新增订单数/订单总数",
	            type: "string"
	        }, {
	            caption: "新增订单金额/订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160408
	 * @fileoverview 单项单级返利
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84);

	module.exports = {
	    individualEventOne: function individualEventOne(data) {
	        var source = data.data,
	            orderSource = data.orderData,
	            one = [],
	            two = [],
	            three = [],
	            objOne = {
	            defate_plan_count: 0,
	            participate_seller_count: 0,
	            participate_goods_count: 0,
	            order_count: 0,
	            participate_user_count: 0
	        },
	            objTwo = {
	            rebate_order_count: 0,
	            rebate_order_amount_count: 0,
	            rebate_order_amount_actual_count: 0,
	            rebate_amount_count: 0
	        },
	            objThree = {
	            name: "返利订单",
	            spu_count: 0,
	            total_spu_num: 0,
	            sku_count: 0,
	            total_sku_num: 0,
	            refund_user_count: 0,
	            total_user_num: 0,
	            refund_goods_amount_count: 0,
	            total_amount: 0,
	            refund_goods_amount_actual_count: 0,
	            total_amount_actual: 0
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                objOne.defate_plan_count += key.defate_plan_count;
	                objOne.participate_seller_count += key.participate_seller_count;
	                objOne.participate_goods_count += key.participate_goods_count;
	                objOne.order_count += key.order_count;
	                objOne.participate_user_count += key.participate_user_count;
	                objTwo.rebate_order_count += key.rebate_order_count;
	                objTwo.rebate_order_amount_count += key.rebate_order_amount_count;
	                objTwo.rebate_order_amount_actual_count += key.rebate_order_amount_actual_count;
	                objTwo.rebate_amount_count += key.rebate_amount_count;
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(orderSource), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                objThree.spu_count += key.spu_count;
	                objThree.sku_count += key.sku_count;
	                objThree.refund_user_count += key.refund_user_count;
	                objThree.refund_goods_amount_count += key.refund_goods_amount_count;
	                objThree.refund_goods_amount_actual_count += key.refund_goods_amount_actual_count;
	                objThree.total_spu_num = key.total_spu_num;
	                objThree.total_sku_num = key.total_sku_num;
	                objThree.total_user_num = key.total_user_num;
	                objThree.total_amount = key.total_amount;
	                objThree.total_amount_actual = key.total_amount_actual;
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

	        one.push(objOne);
	        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
	        two.push(objTwo);
	        three.push(objThree);
	        three.push({
	            name: "返利退货订单占比",
	            spu_count: util.toFixed(objThree.spu_count, objThree.total_spu_num),
	            sku_count: util.toFixed(objThree.sku_count, objThree.total_sku_num),
	            refund_user_count: util.toFixed(objThree.refund_user_count, objThree.total_user_num),
	            refund_goods_amount_count: util.toFixed(objThree.refund_goods_amount_count, objThree.total_amount),
	            refund_goods_amount_actual_count: util.toFixed(objThree.refund_goods_amount_actual_count, objThree.total_amount_actual)
	        });
	        return util.toTable([one, two, three], data.rows, data.cols);
	    },
	    individualEventTwo: function individualEventTwo(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            array = ["分享购买", "邀请好友-购买返利"],
	            newData = {},
	            map = {};
	        map[filter_key + "_0"] = array[0];
	        map[filter_key + "_1"] = array[1];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                var obj = {};
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (date === util.getDate(key.date)) {
	                            for (var i = 0; i < array.length; i++) {
	                                if (key.rebate_type === array[i]) {
	                                    obj[filter_key + "_" + i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newData[date] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            config: {
	                stack: false
	            },
	            data: newData
	        }];
	    },
	    individualEventThree: function individualEventThree(data, filter_key) {
	        var source = data.data,
	            newData = {},
	            map = {},
	            typePie = "pie",
	            typeBar = "bar",
	            filter_name = {
	            goods_sku_count: "商品件数",
	            goods_amount_count: "商品总金额",
	            rebate_amount_count: "返利到账金额"
	        },
	            XData = ["比例返利", "固定返利"];
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(XData), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var x = _step5.value;

	                var obj = {
	                    value: 0
	                };
	                var _iteratorNormalCompletion6 = true;
	                var _didIteratorError6 = false;
	                var _iteratorError6 = undefined;

	                try {
	                    for (var _iterator6 = (0, _getIterator3.default)(source), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                        var key = _step6.value;

	                        if (x === key.rebate_type) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError6 = true;
	                    _iteratorError6 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                            _iterator6.return();
	                        }
	                    } finally {
	                        if (_didIteratorError6) {
	                            throw _iteratorError6;
	                        }
	                    }
	                }

	                newData[x] = obj;
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        map.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }];
	    },
	    individualEventFour: function individualEventFour(data) {
	        var source = data.data;
	        source.forEach(function (key, value) {
	            key.id = value + 1;
	            key.order_rate = key.new_order_count + "/" + key.order_all_count;
	            key.price_rate = key.new_order_amount + "/" + key.order_all_amount;
	        });
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160408
	 * @fileoverview 邀请商户入驻
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(156);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/platformRebate/inviteBusinessOne",
	        modelName: ["Rebate", "RebateRefund"],
	        fixedParams: {
	            user_party: "邀请商户入驻"
	        },
	        platform: false,
	        date_picker_data: 1,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.inviteBusinessOne(data);
	        },

	        rows: [["defate_plan_count", "participate_seller_count", "participate_goods_count", "order_count", "participate_user_count"], ["rebate_order_count", "rebate_order_amount_count", "rebate_order_amount_actual_count", "rebate_amount_count", "rate"], ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count", "refund_goods_amount_actual_count"]],
	        cols: [[{
	            caption: "返利计划书",
	            type: "string"
	        }, {
	            caption: "参与商户数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "订单数",
	            type: "number"
	        }, {
	            caption: "用户数",
	            type: "number"
	        }], [{
	            caption: "返利到账订单数",
	            type: "string"
	        }, {
	            caption: "返利订单总金额",
	            type: "string"
	        }, {
	            caption: "返利订单实付金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "string"
	        }, {
	            caption: "返利比率",
	            type: "string"
	        }], [{
	            caption: "",
	            type: "string"
	        }, {
	            caption: "退货商品数",
	            type: "string"
	        }, {
	            caption: "退货商品件数",
	            type: "string"
	        }, {
	            caption: "退货用户数",
	            type: "string"
	        }, {
	            caption: "退货商品总金额",
	            type: "string"
	        }, {
	            caption: "实际退货金额",
	            type: "string"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/inviteBusinessTwo",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        fixedParams: {
	            user_party: "邀请商户入驻"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'order_count',
	                value: '订单数'
	            }, {
	                key: 'order_amount_count',
	                value: '订单总金额'
	            }, {
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.inviteBusinessTwo(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/inviteBusinessThree",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        fixedParams: {
	            user_party: "邀请商户入驻"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }, {
	                key: 'goods_amount_count',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.inviteBusinessThree(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/inviteBusinessFour",
	        modelName: ["RebatetSheduleDetails"],
	        platform: false,
	        fixedParams: {
	            user_party: "邀请商户入驻"
	        },
	        excel_export: true,
	        //flexible_btn : [{
	        //    content: '<a href="javascript:void(0)">导出</a>',
	        //    preMethods: ['excel_export']
	        //}],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.inviteBusinessFour(data);
	        },

	        rows: [["id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "level", "participate_seller_count", "participate_goods_count", "participate_user_count", "order_rate", "price_rate", "rebate_amount"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "返利计划名称",
	            type: "string"
	        }, {
	            caption: "使用方",
	            type: "string"
	        }, {
	            caption: "有效期",
	            type: "string"
	        }, {
	            caption: "相关流程",
	            type: "string"
	        }, {
	            caption: "层级",
	            type: "string"
	        }, {
	            caption: "参与商家数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "新增订单数/订单总数",
	            type: "string"
	        }, {
	            caption: "新增订单金额/订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160408
	 * @fileoverview 邀请商户入驻
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84);

	module.exports = {
	    inviteBusinessOne: function inviteBusinessOne(data) {
	        var source = data.data,
	            orderSource = data.orderData,
	            one = [],
	            two = [],
	            three = [],
	            objOne = {
	            defate_plan_count: 0,
	            participate_seller_count: 0,
	            participate_goods_count: 0,
	            order_count: 0,
	            participate_user_count: 0
	        },
	            objTwo = {
	            rebate_order_count: 0,
	            rebate_order_amount_count: 0,
	            rebate_order_amount_actual_count: 0,
	            rebate_amount_count: 0
	        },
	            objThree = {
	            name: "返利订单",
	            spu_count: 0,
	            total_spu_num: 0,
	            sku_count: 0,
	            total_sku_num: 0,
	            refund_user_count: 0,
	            total_user_num: 0,
	            refund_goods_amount_count: 0,
	            total_amount: 0,
	            refund_goods_amount_actual_count: 0,
	            total_amount_actual: 0
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                objOne.defate_plan_count += key.defate_plan_count;
	                objOne.participate_seller_count += key.participate_seller_count;
	                objOne.participate_goods_count += key.participate_goods_count;
	                objOne.order_count += key.order_count;
	                objOne.participate_user_count += key.participate_user_count;
	                objTwo.rebate_order_count += key.rebate_order_count;
	                objTwo.rebate_order_amount_count += key.rebate_order_amount_count;
	                objTwo.rebate_order_amount_actual_count += key.rebate_order_amount_actual_count;
	                objTwo.rebate_amount_count += key.rebate_amount_count;
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(orderSource), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                objThree.spu_count += key.spu_count;
	                objThree.sku_count += key.sku_count;
	                objThree.refund_user_count += key.refund_user_count;
	                objThree.refund_goods_amount_count += key.refund_goods_amount_count;
	                objThree.refund_goods_amount_actual_count += key.refund_goods_amount_actual_count;
	                objThree.total_spu_num = key.total_spu_num;
	                objThree.total_sku_num = key.total_sku_num;
	                objThree.total_user_num = key.total_user_num;
	                objThree.total_amount = key.total_amount;
	                objThree.total_amount_actual = key.total_amount_actual;
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

	        one.push(objOne);
	        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
	        two.push(objTwo);
	        three.push(objThree);
	        three.push({
	            name: "返利退货订单占比",
	            spu_count: util.toFixed(objThree.spu_count, objThree.total_spu_num),
	            sku_count: util.toFixed(objThree.sku_count, objThree.total_sku_num),
	            refund_user_count: util.toFixed(objThree.refund_user_count, objThree.total_user_num),
	            refund_goods_amount_count: util.toFixed(objThree.refund_goods_amount_count, objThree.total_amount),
	            refund_goods_amount_actual_count: util.toFixed(objThree.refund_goods_amount_actual_count, objThree.total_amount_actual)
	        });
	        return util.toTable([one, two, three], data.rows, data.cols);
	    },
	    inviteBusinessTwo: function inviteBusinessTwo(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            array = ["分享返利"],
	            newData = {},
	            map = {};
	        map[filter_key + "_0"] = array[0];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                var obj = {};
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (date === util.getDate(key.date)) {
	                            for (var i = 0; i < array.length; i++) {
	                                if (key.rebate_type === array[i]) {
	                                    obj[filter_key + "_" + i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newData[date] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            config: {
	                stack: false
	            },
	            data: newData
	        }];
	    },
	    inviteBusinessThree: function inviteBusinessThree(data, filter_key) {
	        var source = data.data,
	            typePie = "pie",
	            typeBar = "bar",
	            mapPie = {},
	            mapBar = {},
	            newDataPie = {},
	            newDataBar = {},
	            filter_name = {
	            goods_sku_count: "商品件数",
	            goods_amount_count: "商品总金额",
	            rebate_amount_count: "返利到账金额"
	        },
	            XPie = ["1级", "2级", "3级", "4级"],
	            XBar = ["层级1", "层级2", "层级3", "层级4"];
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(XPie), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var level = _step5.value;

	                var obj = {};
	                obj.value = 0;
	                var _iteratorNormalCompletion7 = true;
	                var _didIteratorError7 = false;
	                var _iteratorError7 = undefined;

	                try {
	                    for (var _iterator7 = (0, _getIterator3.default)(source), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                        var key = _step7.value;

	                        if (level === key.grade) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError7 = true;
	                    _iteratorError7 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                            _iterator7.return();
	                        }
	                    } finally {
	                        if (_didIteratorError7) {
	                            throw _iteratorError7;
	                        }
	                    }
	                }

	                newDataPie[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(XPie), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var level = _step6.value;

	                var obj = {};
	                for (var i = 0; i < XBar.length; i++) {
	                    obj[i] = 0;
	                }
	                var _iteratorNormalCompletion8 = true;
	                var _didIteratorError8 = false;
	                var _iteratorError8 = undefined;

	                try {
	                    for (var _iterator8 = (0, _getIterator3.default)(source), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                        var key = _step8.value;

	                        if (key.level === level) {
	                            for (var i = 0; i < XBar.length; i++) {
	                                if (key.grade === XBar[i]) {
	                                    obj[i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError8 = true;
	                    _iteratorError8 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                            _iterator8.return();
	                        }
	                    } finally {
	                        if (_didIteratorError8) {
	                            throw _iteratorError8;
	                        }
	                    }
	                }

	                newDataBar[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        for (var i = 0; i < XBar.length; i++) {
	            mapBar[i] = XBar[i];
	        }
	        mapPie.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: mapPie,
	            data: newDataPie,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: mapBar,
	            data: newDataBar,
	            config: {
	                stack: true
	            }
	        }];
	    },
	    inviteBusinessFour: function inviteBusinessFour(data) {
	        var source = data.data;
	        source.forEach(function (key, value) {
	            key.id = value + 1;
	            key.order_rate = key.new_order_count + "/" + key.order_all_count;
	            key.price_rate = key.new_order_amount + "/" + key.order_all_amount;
	        });
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author luoye
	 * @date 20160407
	 * @fileoverview 邀请注册 / 入驻
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(158);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/platformRebate/inviteRegisterAndEnterOne",
	        modelName: ["RebateInvitepartner"],
	        date_picker_data: 1,
	        platform: false,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.inviteRegisterAndEnterOne(data);
	        },

	        rows: ["rebate_plan_count", "participate_user_count", "registered_count", "registered_rate", "rebate_amount_count"],
	        cols: [{
	            "caption": "返利计划数",
	            "type": "string"
	        }, {
	            "caption": "参与用户数",
	            "type": "number"
	        }, {
	            "caption": "注册成功数",
	            "type": "number"
	        }, {
	            "caption": "注册成功占比",
	            "type": "number"
	        }, {
	            "caption": "返利到账金额",
	            "type": "number"
	        }]
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/inviteRegisterAndEnterTwo",
	        date_picker_data: 1,
	        platform: false,
	        modelName: ["RebatetInviteseller"],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.inviteRegisterAndEnterTwo(data);
	        },

	        rows: [["rebate_plan_count", "participate_user_count", "registered_count", "registered_rate", "rebate_amount_count"]],
	        cols: [[{
	            "caption": "返利计划数",
	            "type": "string"
	        }, {
	            "caption": "参与用户数",
	            "type": "number"
	        }, {
	            "caption": "入驻成功数",
	            "type": "number"
	        }, {
	            "caption": "入驻成功占比",
	            "type": "number"
	        }, {
	            "caption": "返利到账金额",
	            "type": "number"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/inviteRegisterAndEnterThree",
	        platform: false,
	        modelName: ["RebatetRegisterTrendency"],
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'registered_count',
	                value: '邀请成功'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.inviteRegisterAndEnterThree(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/inviteRegisterAndEnterFour",
	        platform: false,
	        modelName: ["RebatetRegisterSheduleDetails"],
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter_select: [{
	            title: '使用方',
	            filter_key: 'user_party',
	            groups: [{
	                key: '单项单级返利',
	                value: '单项单级返利',
	                cell: {
	                    title: '关联流程',
	                    filter_key: 'correlate_flow',
	                    groups: [{
	                        key: '固定返利',
	                        value: '固定返利'
	                    }, {
	                        key: '比例返利',
	                        value: '比例返利'
	                    }]
	                }
	            }, {
	                key: '平台基础返利',
	                value: '平台基础返利',
	                cell: {
	                    title: '关联流程',
	                    filter_key: 'correlate_flow',
	                    groups: [{
	                        key: '分享购买',
	                        value: '分享购买'
	                    }, {
	                        key: '邀请好友-购买返利',
	                        value: '邀请好友-购买返利'
	                    }, {
	                        key: '邀请好友-固定返利',
	                        value: '邀请好友-固定返利'
	                    }]
	                }
	            }, {
	                key: '平台促销返利',
	                value: '平台促销返利',
	                cell: {
	                    title: '关联流程',
	                    filter_key: 'correlate_flow',
	                    groups: [{
	                        key: '分享购买',
	                        value: '分享购买'
	                    }, {
	                        key: '邀请好友-购买返利',
	                        value: '邀请好友-购买返利'
	                    }, {
	                        key: '邀请好友-固定返利',
	                        value: '邀请好友-固定返利'
	                    }]
	                }
	            }, {
	                key: '邀请商家入驻返利',
	                value: '邀请商家入驻返利',
	                cell: {
	                    title: '关联流程',
	                    filter_key: 'correlate_flow',
	                    groups: [{
	                        key: '固定返利',
	                        value: '固定返利'
	                    }, {
	                        key: '分享购买',
	                        value: '分享购买'
	                    }]
	                }
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.inviteRegisterAndEnterFour(data);
	        },

	        rows: [["id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "participate_user_count", "registered_count", "rebate_amount_count"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "返利计划名称",
	            type: "string"
	        }, {
	            caption: "使用方",
	            type: "string"
	        }, {
	            caption: "有效期",
	            type: "string"
	        }, {
	            caption: "相关流程",
	            type: "string"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "用户注册成功数(商户入驻成功数)",
	            type: "number"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160407
	 * @fileoverview 平台返利汇总
	 */
	var _ = __webpack_require__(84),
	    util = __webpack_require__(82);

	module.exports = {
	    inviteRegisterAndEnterOne: function inviteRegisterAndEnterOne(data) {
	        var source = data.data;
	        var resultData = [];
	        var _current = {};
	        _current.rows = data.rows;
	        _current.cols = data.cols;
	        _current.data = [];
	        var one = {
	            "rebate_plan_count": 0,
	            "participate_user_count": 0,
	            "registered_count": 0,
	            "rebate_amount_count": 0
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var item = _step.value;

	                one.rebate_plan_count += item.rebate_plan_count;
	                one.participate_user_count += item.participate_user_count;
	                one.registered_count += item.registered_count;
	                one.rebate_amount_count += item.rebate_amount_count;
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

	        _current.data.push({
	            "rebate_plan_count": one.rebate_plan_count,
	            "participate_user_count": one.participate_user_count,
	            "registered_count": one.registered_count,
	            "registered_rate": util.toFixed(one.registered_count, one.participate_user_count),
	            "rebate_amount_count": one.rebate_amount_count
	        });
	        resultData.push(_current);
	        return resultData;
	    },
	    inviteRegisterAndEnterTwo: function inviteRegisterAndEnterTwo(data) {
	        var source = data.data,
	            registered_all_count = 0,
	            newData = [],
	            obj = {
	            rebate_plan_count: 0,
	            participate_user_count: 0,
	            registered_count: 0,
	            rebate_amount_count: 0
	        };
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                registered_all_count = key.registered_all_count;
	                obj.rebate_plan_count += key.rebate_plan_count;
	                obj.participate_user_count += key.participate_user_count;
	                obj.registered_count += key.registered_count;
	                obj.rebate_amount_count += key.rebate_amount_count;
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

	        obj.registered_rate = util.toFixed(obj.registered_count, registered_all_count);
	        newData.push(obj);
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    inviteRegisterAndEnterThree: function inviteRegisterAndEnterThree(data, filter_key, dates) {
	        var source = data.data,
	            array = ["邀请好友-平台基础返利", "邀请好友-平台促销返利", "邀请商家入驻返利"],
	            type = "line",
	            map = {
	            value_0: "邀请好友-平台基础返利",
	            value_1: "邀请好友-平台促销返利",
	            value_2: "邀请商家入驻返利"
	        },
	            newData = {};
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                var obj = {
	                    value_0: 0,
	                    value_1: 0,
	                    value_2: 0
	                };
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (date === util.getDate(key.date)) {
	                            for (var i = 0; i < array.length; i++) {
	                                if (array[i] === key.user_party) {
	                                    obj["value_" + i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newData[date] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }];
	    },
	    inviteRegisterAndEnterFour: function inviteRegisterAndEnterFour(data) {
	        var source = data.data;
	        for (var i = 0; i < source.length; i++) {
	            source[i].id = i + 1;
	        }
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160408
	 * @fileoverview 平台基础返利
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(160);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/platformRebate/platformBasisOne",
	        modelName: ["Rebate", "RebateRefund"],
	        platform: false,
	        fixedParams: {
	            user_party: "平台基础返利"
	        },
	        date_picker_data: 1,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformBasisOne(data);
	        },

	        rows: [["defate_plan_count", "participate_seller_count", "participate_goods_count", "order_count", "participate_user_count"], ["rebate_order_count", "rebate_order_amount_count", "rebate_order_amount_actual_count", "rebate_amount_count", "rate"], ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count", "refund_goods_amount_actual_count"]],
	        cols: [[{
	            caption: "返利计划书",
	            type: "string"
	        }, {
	            caption: "参与商户数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "订单数",
	            type: "number"
	        }, {
	            caption: "用户数",
	            type: "number"
	        }], [{
	            caption: "返利到账订单数",
	            type: "string"
	        }, {
	            caption: "返利订单总金额",
	            type: "string"
	        }, {
	            caption: "返利订单实付金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "string"
	        }, {
	            caption: "返利比率",
	            type: "string"
	        }], [{
	            caption: "",
	            type: "string"
	        }, {
	            caption: "退货商品数",
	            type: "string"
	        }, {
	            caption: "退货商品件数",
	            type: "string"
	        }, {
	            caption: "退货用户数",
	            type: "string"
	        }, {
	            caption: "退货商品总金额",
	            type: "string"
	        }, {
	            caption: "实际退货金额",
	            type: "string"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformBasisTwo",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        fixedParams: {
	            user_party: "平台基础返利"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'order_count',
	                value: '订单数'
	            }, {
	                key: 'order_amount_count',
	                value: '订单总金额'
	            }, {
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformBasisTwo(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformBasisThree",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        fixedParams: {
	            user_party: "平台基础返利"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }, {
	                key: 'goods_amount_count',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformBasisThree(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformBasisFour",
	        modelName: ["RebatetRedencyDetails"],
	        level_select: true,
	        platform: false,
	        fixedParams: {
	            user_party: "平台基础返利"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }, {
	                key: 'goods_amount_count',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformBasisFour(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformBasisFive",
	        modelName: ["RebatetSheduleDetails"],
	        fixedParams: {
	            user_party: "平台基础返利"
	        },
	        platform: false,
	        excel_export: true,
	        //flexible_btn : [{
	        //    content: '<a href="javascript:void(0)">导出</a>',
	        //    preMethods: ['excel_export']
	        //}],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformBasisFive(data);
	        },

	        rows: [["id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "level", "participate_seller_count", "participate_goods_count", "participate_user_count", "order_rate", "price_rate", "rebate_amount"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "返利计划名称",
	            type: "string"
	        }, {
	            caption: "使用方",
	            type: "string"
	        }, {
	            caption: "有效期",
	            type: "string"
	        }, {
	            caption: "相关流程",
	            type: "string"
	        }, {
	            caption: "层级",
	            type: "string"
	        }, {
	            caption: "参与商家数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "新增订单数/订单总数",
	            type: "string"
	        }, {
	            caption: "新增订单金额/订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160408
	 * @fileoverview 平台基础返利
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84);

	module.exports = {
	    platformBasisOne: function platformBasisOne(data) {
	        var source = data.data,
	            orderSource = data.orderData,
	            one = [],
	            two = [],
	            three = [],
	            objOne = {
	            defate_plan_count: 0,
	            participate_seller_count: 0,
	            participate_goods_count: 0,
	            order_count: 0,
	            participate_user_count: 0
	        },
	            objTwo = {
	            rebate_order_count: 0,
	            rebate_order_amount_count: 0,
	            rebate_order_amount_actual_count: 0,
	            rebate_amount_count: 0
	        },
	            objThree = {
	            name: "返利订单",
	            spu_count: 0,
	            total_spu_num: 0,
	            sku_count: 0,
	            total_sku_num: 0,
	            refund_user_count: 0,
	            total_user_num: 0,
	            refund_goods_amount_count: 0,
	            total_amount: 0,
	            refund_goods_amount_actual_count: 0,
	            total_amount_actual: 0
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                objOne.defate_plan_count += key.defate_plan_count;
	                objOne.participate_seller_count += key.participate_seller_count;
	                objOne.participate_goods_count += key.participate_goods_count;
	                objOne.order_count += key.order_count;
	                objOne.participate_user_count += key.participate_user_count;
	                objTwo.rebate_order_count += key.rebate_order_count;
	                objTwo.rebate_order_amount_count += key.rebate_order_amount_count;
	                objTwo.rebate_order_amount_actual_count += key.rebate_order_amount_actual_count;
	                objTwo.rebate_amount_count += key.rebate_amount_count;
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(orderSource), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                objThree.spu_count += key.spu_count;
	                objThree.sku_count += key.sku_count;
	                objThree.refund_user_count += key.refund_user_count;
	                objThree.refund_goods_amount_count += key.refund_goods_amount_count;
	                objThree.refund_goods_amount_actual_count += key.refund_goods_amount_actual_count;
	                objThree.total_spu_num = key.total_spu_num;
	                objThree.total_sku_num = key.total_sku_num;
	                objThree.total_user_num = key.total_user_num;
	                objThree.total_amount = key.total_amount;
	                objThree.total_amount_actual = key.total_amount_actual;
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

	        one.push(objOne);
	        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
	        two.push(objTwo);
	        three.push(objThree);
	        three.push({
	            name: "返利退货订单占比",
	            spu_count: util.toFixed(objThree.spu_count, objThree.total_spu_num),
	            sku_count: util.toFixed(objThree.sku_count, objThree.total_sku_num),
	            refund_user_count: util.toFixed(objThree.refund_user_count, objThree.total_user_num),
	            refund_goods_amount_count: util.toFixed(objThree.refund_goods_amount_count, objThree.total_amount),
	            refund_goods_amount_actual_count: util.toFixed(objThree.refund_goods_amount_actual_count, objThree.total_amount_actual)
	        });
	        return util.toTable([one, two, three], data.rows, data.cols);
	    },
	    platformBasisTwo: function platformBasisTwo(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            array = ["分享购买", "邀请好友-购买返利"],
	            newData = {},
	            map = {};
	        map[filter_key + "_0"] = array[0];
	        map[filter_key + "_1"] = array[1];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                var obj = {};
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (date === util.getDate(key.date)) {
	                            for (var i = 0; i < array.length; i++) {
	                                if (key.rebate_type === array[i]) {
	                                    obj[filter_key + "_" + i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newData[date] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            config: {
	                stack: false
	            },
	            data: newData
	        }];
	    },
	    platformBasisThree: function platformBasisThree(data, filter_key) {
	        var source = data.data,
	            typePie = "pie",
	            typeBar = "bar",
	            mapPie = {},
	            mapBar = {},
	            newDataPie = {},
	            newDataBar = {},
	            filter_name = {
	            goods_sku_count: "商品件数",
	            goods_amount_count: "商品总金额",
	            rebate_amount_count: "返利到账金额"
	        },
	            XPie = ["1级", "2级", "3级", "4级"],
	            XBar = ["层级1", "层级2", "层级3", "层级4"];
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(XPie), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var level = _step5.value;

	                var obj = {};
	                obj.value = 0;
	                var _iteratorNormalCompletion7 = true;
	                var _didIteratorError7 = false;
	                var _iteratorError7 = undefined;

	                try {
	                    for (var _iterator7 = (0, _getIterator3.default)(source), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                        var key = _step7.value;

	                        if (level === key.grade) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError7 = true;
	                    _iteratorError7 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                            _iterator7.return();
	                        }
	                    } finally {
	                        if (_didIteratorError7) {
	                            throw _iteratorError7;
	                        }
	                    }
	                }

	                newDataPie[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(XPie), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var level = _step6.value;

	                var obj = {};
	                for (var i = 0; i < XBar.length; i++) {
	                    obj[i] = 0;
	                }
	                var _iteratorNormalCompletion8 = true;
	                var _didIteratorError8 = false;
	                var _iteratorError8 = undefined;

	                try {
	                    for (var _iterator8 = (0, _getIterator3.default)(source), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                        var key = _step8.value;

	                        if (key.level === level) {
	                            for (var i = 0; i < XBar.length; i++) {
	                                if (key.grade === XBar[i]) {
	                                    obj[i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError8 = true;
	                    _iteratorError8 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                            _iterator8.return();
	                        }
	                    } finally {
	                        if (_didIteratorError8) {
	                            throw _iteratorError8;
	                        }
	                    }
	                }

	                newDataBar[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        for (var i = 0; i < XBar.length; i++) {
	            mapBar[i] = XBar[i];
	        }
	        mapPie.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: mapPie,
	            data: newDataPie,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: mapBar,
	            data: newDataBar,
	            config: {
	                stack: true
	            }
	        }];
	    },
	    platformBasisFour: function platformBasisFour(data, filter_key) {
	        var source = data.data,
	            newData = {},
	            map = {},
	            typePie = "pie",
	            typeBar = "bar",
	            filter_name = {
	            goods_sku_count: "商品件数",
	            goods_amount_count: "商品总金额",
	            rebate_amount_count: "返利到账金额"
	        },
	            XData = ["分享购买", "邀请好友-购买返利"];
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;

	        try {
	            for (var _iterator9 = (0, _getIterator3.default)(XData), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                var x = _step9.value;

	                var obj = {
	                    value: 0
	                };
	                var _iteratorNormalCompletion10 = true;
	                var _didIteratorError10 = false;
	                var _iteratorError10 = undefined;

	                try {
	                    for (var _iterator10 = (0, _getIterator3.default)(source), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                        var key = _step10.value;

	                        if (x === key.rebate_type) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError10 = true;
	                    _iteratorError10 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                            _iterator10.return();
	                        }
	                    } finally {
	                        if (_didIteratorError10) {
	                            throw _iteratorError10;
	                        }
	                    }
	                }

	                newData[x] = obj;
	            }
	        } catch (err) {
	            _didIteratorError9 = true;
	            _iteratorError9 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                    _iterator9.return();
	                }
	            } finally {
	                if (_didIteratorError9) {
	                    throw _iteratorError9;
	                }
	            }
	        }

	        map.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }];
	    },
	    platformBasisFive: function platformBasisFive(data) {
	        var source = data.data;
	        source.forEach(function (key, value) {
	            key.id = value + 1;
	            key.order_rate = key.new_order_count + "/" + key.order_all_count;
	            key.price_rate = key.new_order_amount + "/" + key.order_all_amount;
	        });
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160408
	 * @fileoverview 平台促销返利
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(162);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/platformRebate/platformPromotionsOne",
	        modelName: ["Rebate", "RebateRefund"],
	        platform: false,
	        fixedParams: {
	            user_party: "平台促销返利"
	        },
	        date_picker_data: 1,
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformPromotionsOne(data);
	        },

	        rows: [["defate_plan_count", "participate_seller_count", "participate_goods_count", "order_count", "participate_user_count"], ["rebate_order_count", "rebate_order_amount_count", "rebate_order_amount_actual_count", "rebate_amount_count", "rate"], ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count", "refund_goods_amount_actual_count"]],
	        cols: [[{
	            caption: "返利计划书",
	            type: "string"
	        }, {
	            caption: "参与商户数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "订单数",
	            type: "number"
	        }, {
	            caption: "用户数",
	            type: "number"
	        }], [{
	            caption: "返利到账订单数",
	            type: "string"
	        }, {
	            caption: "返利订单总金额",
	            type: "string"
	        }, {
	            caption: "返利订单实付金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "string"
	        }, {
	            caption: "返利比率",
	            type: "string"
	        }], [{
	            caption: "",
	            type: "string"
	        }, {
	            caption: "退货商品数",
	            type: "string"
	        }, {
	            caption: "退货商品件数",
	            type: "string"
	        }, {
	            caption: "退货用户数",
	            type: "string"
	        }, {
	            caption: "退货商品总金额",
	            type: "string"
	        }, {
	            caption: "实际退货金额",
	            type: "string"
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformPromotionsTwo",
	        modelName: ["RebatetRedencyDetails"],
	        platform: false,
	        level_select: true,
	        fixedParams: {
	            user_party: "平台促销返利"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'order_count',
	                value: '订单数'
	            }, {
	                key: 'order_amount_count',
	                value: '订单总金额'
	            }, {
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformPromotionsTwo(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformPromotionsThree",
	        modelName: ["RebatetRedencyDetails"],
	        platform: false,
	        level_select: true,
	        fixedParams: {
	            user_party: "平台促销返利"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }, {
	                key: 'goods_amount_count',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformPromotionsThree(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformPromotionsFour",
	        modelName: ["RebatetRedencyDetails"],
	        platform: false,
	        level_select: true,
	        fixedParams: {
	            user_party: "平台促销返利"
	        },
	        filter_select: [{
	            title: '指标选择',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'goods_sku_count',
	                value: '商品件数'
	            }, {
	                key: 'goods_amount_count',
	                value: '商品总金额'
	            }, {
	                key: 'rebate_amount_count',
	                value: '返利到账金额'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformPromotionsFour(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/platformRebate/platformPromotionsFive",
	        modelName: ["RebatetSheduleDetails"],
	        platform: false,
	        fixedParams: {
	            user_party: "平台促销返利"
	        },
	        excel_export: true,
	        //flexible_btn : [{
	        //    content: '<a href="javascript:void(0)">导出</a>',
	        //    preMethods: ['excel_export']
	        //}],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.platformPromotionsFive(data);
	        },

	        rows: [["id", "rebate_plan_name", "user_party", "deadline", "correlate_flow", "level", "participate_seller_count", "participate_goods_count", "participate_user_count", "order_rate", "price_rate", "rebate_amount"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "返利计划名称",
	            type: "string"
	        }, {
	            caption: "使用方",
	            type: "string"
	        }, {
	            caption: "有效期",
	            type: "string"
	        }, {
	            caption: "相关流程",
	            type: "string"
	        }, {
	            caption: "层级",
	            type: "string"
	        }, {
	            caption: "参与商家数",
	            type: "number"
	        }, {
	            caption: "参与商品数",
	            type: "number"
	        }, {
	            caption: "参与用户数",
	            type: "number"
	        }, {
	            caption: "新增订单数/订单总数",
	            type: "string"
	        }, {
	            caption: "新增订单金额/订单总金额",
	            type: "string"
	        }, {
	            caption: "返利到账金额",
	            type: "number"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160408
	 * @fileoverview 平台促销返利
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84),
	    moment = __webpack_require__(138);

	module.exports = {
	    platformPromotionsOne: function platformPromotionsOne(data) {
	        var source = data.data,
	            orderSource = data.orderData,
	            one = [],
	            two = [],
	            three = [],
	            objOne = {
	            defate_plan_count: 0,
	            participate_seller_count: 0,
	            participate_goods_count: 0,
	            order_count: 0,
	            participate_user_count: 0
	        },
	            objTwo = {
	            rebate_order_count: 0,
	            rebate_order_amount_count: 0,
	            rebate_order_amount_actual_count: 0,
	            rebate_amount_count: 0
	        },
	            objThree = {
	            name: "返利订单",
	            spu_count: 0,
	            total_spu_num: 0,
	            sku_count: 0,
	            total_sku_num: 0,
	            refund_user_count: 0,
	            total_user_num: 0,
	            refund_goods_amount_count: 0,
	            total_amount: 0,
	            refund_goods_amount_actual_count: 0,
	            total_amount_actual: 0
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(source), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                objOne.defate_plan_count += key.defate_plan_count;
	                objOne.participate_seller_count += key.participate_seller_count;
	                objOne.participate_goods_count += key.participate_goods_count;
	                objOne.order_count += key.order_count;
	                objOne.participate_user_count += key.participate_user_count;
	                objTwo.rebate_order_count += key.rebate_order_count;
	                objTwo.rebate_order_amount_count += key.rebate_order_amount_count;
	                objTwo.rebate_order_amount_actual_count += key.rebate_order_amount_actual_count;
	                objTwo.rebate_amount_count += key.rebate_amount_count;
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(orderSource), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                objThree.spu_count += key.spu_count;
	                objThree.sku_count += key.sku_count;
	                objThree.refund_user_count += key.refund_user_count;
	                objThree.refund_goods_amount_count += key.refund_goods_amount_count;
	                objThree.refund_goods_amount_actual_count += key.refund_goods_amount_actual_count;
	                objThree.total_spu_num = key.total_spu_num;
	                objThree.total_sku_num = key.total_sku_num;
	                objThree.total_user_num = key.total_user_num;
	                objThree.total_amount = key.total_amount;
	                objThree.total_amount_actual = key.total_amount_actual;
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

	        one.push(objOne);
	        objTwo.rate = util.toFixed(objTwo.rebate_amount_count, objTwo.rebate_order_amount_actual_count);
	        two.push(objTwo);
	        three.push(objThree);
	        three.push({
	            name: "返利退货订单占比",
	            spu_count: util.toFixed(objThree.spu_count, objThree.total_spu_num),
	            sku_count: util.toFixed(objThree.sku_count, objThree.total_sku_num),
	            refund_user_count: util.toFixed(objThree.refund_user_count, objThree.total_user_num),
	            refund_goods_amount_count: util.toFixed(objThree.refund_goods_amount_count, objThree.total_amount),
	            refund_goods_amount_actual_count: util.toFixed(objThree.refund_goods_amount_actual_count, objThree.total_amount_actual)
	        });
	        return util.toTable([one, two, three], data.rows, data.cols);
	    },
	    platformPromotionsTwo: function platformPromotionsTwo(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            array = ["分享购买", "邀请好友-购买返利"],
	            newData = {},
	            map = {};
	        map[filter_key + "_0"] = array[0];
	        map[filter_key + "_1"] = array[1];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                var obj = {};
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var key = _step4.value;

	                        if (date === util.getDate(key.date)) {
	                            for (var i = 0; i < array.length; i++) {
	                                if (key.rebate_type === array[i]) {
	                                    obj[filter_key + "_" + i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }

	                newData[date] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            config: {
	                stack: false
	            },
	            data: newData
	        }];
	    },
	    platformPromotionsThree: function platformPromotionsThree(data, filter_key) {
	        var source = data.data,
	            typePie = "pie",
	            typeBar = "bar",
	            mapPie = {},
	            mapBar = {},
	            newDataPie = {},
	            newDataBar = {},
	            filter_name = {
	            goods_sku_count: "商品件数",
	            goods_amount_count: "商品总金额",
	            rebate_amount_count: "返利到账金额"
	        },
	            XPie = ["1级", "2级", "3级", "4级"],
	            XBar = ["层级1", "层级2", "层级3", "层级4"];
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(XPie), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var level = _step5.value;

	                var obj = {};
	                obj.value = 0;
	                var _iteratorNormalCompletion7 = true;
	                var _didIteratorError7 = false;
	                var _iteratorError7 = undefined;

	                try {
	                    for (var _iterator7 = (0, _getIterator3.default)(source), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                        var key = _step7.value;

	                        if (level === key.grade) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError7 = true;
	                    _iteratorError7 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                            _iterator7.return();
	                        }
	                    } finally {
	                        if (_didIteratorError7) {
	                            throw _iteratorError7;
	                        }
	                    }
	                }

	                newDataPie[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(XPie), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var level = _step6.value;

	                var obj = {};
	                for (var i = 0; i < XBar.length; i++) {
	                    obj[i] = 0;
	                }
	                var _iteratorNormalCompletion8 = true;
	                var _didIteratorError8 = false;
	                var _iteratorError8 = undefined;

	                try {
	                    for (var _iterator8 = (0, _getIterator3.default)(source), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                        var key = _step8.value;

	                        if (key.level === level) {
	                            for (var i = 0; i < XBar.length; i++) {
	                                if (key.grade === XBar[i]) {
	                                    obj[i] += key[filter_key];
	                                }
	                            }
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError8 = true;
	                    _iteratorError8 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                            _iterator8.return();
	                        }
	                    } finally {
	                        if (_didIteratorError8) {
	                            throw _iteratorError8;
	                        }
	                    }
	                }

	                newDataBar[level] = obj;
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        for (var i = 0; i < XBar.length; i++) {
	            mapBar[i] = XBar[i];
	        }
	        mapPie.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: mapPie,
	            data: newDataPie,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: mapBar,
	            data: newDataBar,
	            config: {
	                stack: true
	            }
	        }];
	    },
	    platformPromotionsFour: function platformPromotionsFour(data, filter_key) {
	        var source = data.data,
	            newData = {},
	            map = {},
	            typePie = "pie",
	            typeBar = "bar",
	            filter_name = {
	            goods_sku_count: "商品件数",
	            goods_amount_count: "商品总金额",
	            rebate_amount_count: "返利到账金额"
	        },
	            XData = ["分享购买", "邀请好友-购买返利"];
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;

	        try {
	            for (var _iterator9 = (0, _getIterator3.default)(XData), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                var x = _step9.value;

	                var obj = {
	                    value: 0
	                };
	                var _iteratorNormalCompletion10 = true;
	                var _didIteratorError10 = false;
	                var _iteratorError10 = undefined;

	                try {
	                    for (var _iterator10 = (0, _getIterator3.default)(source), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                        var key = _step10.value;

	                        if (x === key.rebate_type) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError10 = true;
	                    _iteratorError10 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                            _iterator10.return();
	                        }
	                    } finally {
	                        if (_didIteratorError10) {
	                            throw _iteratorError10;
	                        }
	                    }
	                }

	                newData[x] = obj;
	            }
	        } catch (err) {
	            _didIteratorError9 = true;
	            _iteratorError9 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                    _iterator9.return();
	                }
	            } finally {
	                if (_didIteratorError9) {
	                    throw _iteratorError9;
	                }
	            }
	        }

	        map.value = filter_name[filter_key];
	        return [{
	            type: typePie,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }, {
	            type: typeBar,
	            map: map,
	            data: newData,
	            config: {
	                stack: false
	            }
	        }];
	    },
	    platformPromotionsFive: function platformPromotionsFive(data) {
	        var source = data.data;
	        source.forEach(function (key, value) {
	            key.id = value + 1;
	            key.order_rate = key.new_order_count + "/" + key.order_all_count;
	            key.price_rate = key.new_order_amount + "/" + key.order_all_amount;
	        });
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 留存分析
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(164);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/retainedAnalysis/retainedOne",
	        modelName: ["UserKeep"],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.retainedOne(data, dates);
	        },

	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        rows: [['date', 'new_user', 't1', 't7', 't14', 't30']],
	        cols: [[{
	            caption: '时间',
	            type: 'string',
	            width: 20
	        }, {
	            caption: '新增用户',
	            type: 'number'
	        }, {
	            caption: '次日留存率',
	            type: 'string'
	        }, {
	            caption: '7日后留存率',
	            type: 'string'
	        }, {
	            caption: '14日后留存率',
	            type: 'string'
	        }, {
	            caption: '30日后留存率',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160414
	 * @fileoverview 留存分析
	 */
	var util = __webpack_require__(82);

	module.exports = {
	    retainedOne: function retainedOne(data, dates) {
	        var source = data.data,
	            newData = [];
	        dates.sort(function (a, b) {
	            return new Date(b) - new Date(a);
	        });
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var date = _step.value;

	                var obj = {
	                    date: date,
	                    new_user: 0,
	                    t1: "0.00%",
	                    t7: "0.00%",
	                    t14: "0.00%",
	                    t30: "0.00%"
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var key = _step2.value;

	                        if (date === util.getDate(key.date)) {
	                            obj.new_user = key.new_user;
	                            if (key.keep_type === "0") {
	                                obj.t1 = (key.keep_num / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(2) + "%";
	                            } else if (key.keep_type === "1") {
	                                obj.t7 = (key.keep_num / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(2) + "%";
	                            } else if (key.keep_type === "2") {
	                                obj.t14 = (key.keep_num / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(2) + "%";
	                            } else if (key.keep_type === "3") {
	                                obj.t30 = (key.keep_num / (key.new_user === 0 ? 1 : key.new_user) * 100).toFixed(2) + "%";
	                            }
	                        }
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

	                newData.push(obj);
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

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160415
	 * @fileoverview 分享数据
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(166);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/share/insideOne",
	        modelName: ["ShareAnalysis"],
	        filter_select: [{
	            title: '',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'product',
	                value: '商品'
	            }, {
	                key: 'shop',
	                value: '店铺'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.insideOne(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/share/insideTwo",
	        modelName: ["ShareAnalysis"],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.insideTwo(data, dates);
	        },

	        rows: [['date', 'share_num', 'open_num']],
	        cols: [[{
	            caption: '时间',
	            type: 'string',
	            width: 20
	        }, {
	            caption: '分享次数',
	            type: 'number'
	        }, {
	            caption: '打开次数',
	            type: 'number'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160415
	 * @fileoverview 分享数据
	 */
	var util = __webpack_require__(82);

	module.exports = {
	    insideOne: function insideOne(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            map = {
	            share_num: "分享次数",
	            open_num: "打开次数"
	        },
	            filter_name = {
	            product: "商品",
	            shop: "店铺"
	        },
	            newData = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var date = _step.value;

	                var obj = {
	                    share_num: 0,
	                    open_num: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var key = _step2.value;

	                        if (date === util.getDate(key.date)) {
	                            obj.share_num += key.share_num;
	                            obj.open_num += key.open_num;
	                        }
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

	                newData[date] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    insideTwo: function insideTwo(data, dates) {
	        var source = data.data,
	            obj = {},
	            newData = [];
	        dates.sort(function (a, b) {
	            return new Date(b) - new Date(a);
	        });
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                obj[date] = {
	                    share_num: 0,
	                    open_num: 0
	                };
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                obj[util.getDate(key.date)].share_num += key.share_num;
	                obj[util.getDate(key.date)].open_num += key.open_num;
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(dates), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var date = _step5.value;

	                newData.push({
	                    date: date,
	                    share_num: obj[date].share_num,
	                    open_num: obj[date].open_num
	                });
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160415
	 * @fileoverview 分享数据
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(168);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/share/outerOne",
	        modelName: ["ShareAnalysis"],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.outerOne(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/share/outerTwo",
	        modelName: ["ShareAnalysis"],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.outerTwo(data);
	        },

	        rows: [['channel', 'open_num', 'open_num_rate']],
	        cols: [[{
	            caption: '分享平台',
	            type: 'string'
	        }, {
	            caption: '累计打开次数',
	            type: 'number'
	        }, {
	            caption: '打开次数占比',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160415
	 * @fileoverview 分享数据
	 */
	var util = __webpack_require__(82),
	    _ = __webpack_require__(84);

	module.exports = {
	    outerOne: function outerOne(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            map = {},
	            channels = util.uniq(_.pluck(source, "channel")),
	            newData = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(channels), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var channel = _step.value;

	                map[channel] = channel;
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(dates), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var date = _step2.value;

	                newData[date] = {};
	                var _iteratorNormalCompletion4 = true;
	                var _didIteratorError4 = false;
	                var _iteratorError4 = undefined;

	                try {
	                    for (var _iterator4 = (0, _getIterator3.default)(channels), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                        var channel = _step4.value;

	                        newData[date][channel] = 0;
	                    }
	                } catch (err) {
	                    _didIteratorError4 = true;
	                    _iteratorError4 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                            _iterator4.return();
	                        }
	                    } finally {
	                        if (_didIteratorError4) {
	                            throw _iteratorError4;
	                        }
	                    }
	                }
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

	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(source), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;

	                newData[util.getDate(key.date)][key.channel] += key.open_num;
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    outerTwo: function outerTwo(data) {
	        var source = data.data,
	            obj = {},
	            total_open_num = 0,
	            newData = [],
	            channels = util.uniq(_.pluck(source, "channel"));
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(channels), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var channel = _step5.value;

	                obj[channel] = {
	                    open_num: 0
	                };
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(source), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var key = _step6.value;

	                total_open_num += key.open_num;
	                obj[channel].open_num += key.open_num;
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;

	        try {
	            for (var _iterator7 = (0, _getIterator3.default)(channels), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                var channel = _step7.value;

	                newData.push({
	                    channel: channel,
	                    open_num: obj[channel].open_num,
	                    open_num_rate: util.toFixed(obj[(channel.open_num, total_open_num)])
	                });
	            }
	        } catch (err) {
	            _didIteratorError7 = true;
	            _iteratorError7 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                    _iterator7.return();
	                }
	            } finally {
	                if (_didIteratorError7) {
	                    throw _iteratorError7;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160418
	 * @fileoverview 设备终端
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(170);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/terminal/modelOne",
	        modelName: ["KeyValue"],
	        filter_select: [{
	            title: '',
	            filter_key: 'key_type',
	            groups: [{
	                key: 'terminal_model',
	                value: '机型',
	                cell: {
	                    title: '',
	                    filter_key: 'filter_key',
	                    groups: [{
	                        key: 'value',
	                        value: '新增用户'
	                    }, {
	                        key: 'value3',
	                        value: '启动次数'
	                    }]
	                }
	            }, {
	                key: 'terminal_resolution',
	                value: '分辨率',
	                cell: {
	                    title: '',
	                    filter_key: 'filter_key',
	                    groups: [{
	                        key: 'value',
	                        value: '新增用户'
	                    }, {
	                        key: 'value3',
	                        value: '启动次数'
	                    }]
	                }
	            }, {
	                key: 'terminal_os',
	                value: '操作系统',
	                cell: {
	                    title: '',
	                    filter_key: 'filter_key',
	                    groups: [{
	                        key: 'value',
	                        value: '新增用户'
	                    }, {
	                        key: 'value3',
	                        value: '启动次数'
	                    }]
	                }
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.modelOne(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/terminal/modelTwo",
	        modelName: ["KeyValue"],
	        filter_select: [{
	            title: '',
	            filter_key: 'key_type',
	            groups: [{
	                key: 'terminal_model',
	                value: '机型'
	            }, {
	                key: 'terminal_resolution',
	                value: '分辨率'
	            }, {
	                key: 'terminal_os',
	                value: '操作系统'
	            }]
	        }],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.modelTwo(data, filter_key);
	        },

	        rows: [['name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate']],
	        cols: [[{
	            caption: "",
	            type: 'string'
	        }, {
	            caption: '新增用户',
	            type: 'number'
	        }, {
	            caption: '新增用户占比',
	            type: 'string'
	        }, {
	            caption: '启动次数',
	            type: 'number'
	        }, {
	            caption: '启动次数占比',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160418
	 * @fileoverview 设备终端
	 */
	var _ = __webpack_require__(84),
	    util = __webpack_require__(82);

	module.exports = {
	    modelOne: function modelOne(data, filter_key) {
	        var source = data.data,
	            newData = {},
	            tArray = [],
	            array = util.uniq(_.pluck(source, "key_name")),
	            filter_name = {
	            value: "新增用户",
	            value3: "启动次数"
	        },
	            type = "bar",
	            map = {
	            value: filter_name[filter_key]
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var model = _step.value;

	                var obj = {
	                    model: model,
	                    value: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var key = _step2.value;

	                        if (model === key.key_name) {
	                            obj.value += key[filter_key];
	                        }
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

	                tArray.push(obj);
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

	        tArray.sort(function (a, b) {
	            return b.value - a.value;
	        });
	        var top = tArray.length > 10 ? 10 : tArray.length;
	        for (var i = 0; i < top; i++) {
	            newData[tArray[top - 1 - i].model] = {
	                value: tArray[top - 1 - i].value
	            };
	        }
	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false, // 图的堆叠
	                categoryY: true //柱状图竖着
	            }
	        }];
	    },
	    modelTwo: function modelTwo(data, filter_key) {
	        var source = data.data,
	            newData = [],
	            obj = {},
	            cols = [],
	            cols_name = "",
	            total_new_users = 0,
	            total_start_up = 0,
	            array = util.uniq(_.pluck(source, "key_name"));
	        if (filter_key === "terminal_model") {
	            cols_name = "机型";
	        } else if (filter_key === "terminal_resolution") {
	            cols_name = "分辨率";
	        } else {
	            cols_name = "操作系统";
	        }
	        data.cols[0][0].caption = cols_name;
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(array), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;

	                obj[key] = {
	                    new_users: 0,
	                    start_up: 0
	                };
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                total_new_users += key.value;
	                total_start_up += key.value3;
	                obj[key.key_name].new_users += key.value;
	                obj[key.key_name].start_up += key.value3;
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(array), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var key = _step5.value;

	                newData.push({
	                    name: key,
	                    new_users: obj[key].new_users,
	                    start_up: obj[key].start_up,
	                    new_users_rate: util.toFixed(obj[key].new_users, total_new_users),
	                    start_up_rate: util.toFixed(obj[key].start_up, total_start_up)
	                });
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160418
	 * @fileoverview 网络及运营商
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(172);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/terminal/networkOne",
	        modelName: ["KeyValue"],
	        filter_select: [{
	            title: '',
	            filter_key: 'key_type',
	            groups: [{
	                key: 'terminal_network',
	                value: '联网方式',
	                cell: {
	                    title: '',
	                    filter_key: 'filter_key',
	                    groups: [{
	                        key: 'value',
	                        value: '新增用户'
	                    }, {
	                        key: 'value3',
	                        value: '启动次数'
	                    }]
	                }
	            }, {
	                key: 'terminal_isp',
	                value: '运营商',
	                cell: {
	                    title: '',
	                    filter_key: 'filter_key',
	                    groups: [{
	                        key: 'value',
	                        value: '新增用户'
	                    }, {
	                        key: 'value3',
	                        value: '启动次数'
	                    }]
	                }
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.networkOne(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/terminal/networkTwo",
	        modelName: ["KeyValue"],
	        filter_select: [{
	            title: '',
	            filter_key: 'key_type',
	            groups: [{
	                key: 'terminal_network',
	                value: '联网方式'
	            }, {
	                key: 'terminal_isp',
	                value: '运营商'
	            }]
	        }],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.networkTwo(data, filter_key);
	        },

	        rows: [['name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate']],
	        cols: [[{
	            caption: '',
	            type: 'string'
	        }, {
	            caption: '新增用户',
	            type: 'number'
	        }, {
	            caption: '新增用户占比',
	            type: 'string'
	        }, {
	            caption: '启动次数',
	            type: 'number'
	        }, {
	            caption: '启动次数占比',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160418
	 * @fileoverview 网络及运营商
	 */
	var _ = __webpack_require__(84),
	    util = __webpack_require__(82);

	module.exports = {
	    networkOne: function networkOne(data, filter_key) {
	        var source = data.data,
	            newData = {},
	            tArray = [],
	            array = util.uniq(_.pluck(source, "key_name")),
	            filter_name = {
	            value: "新增用户",
	            value3: "启动次数"
	        },
	            type = "bar",
	            map = {
	            value: filter_name[filter_key]
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var model = _step.value;

	                var obj = {
	                    model: model,
	                    value: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var key = _step2.value;

	                        if (model === key.key_name) {
	                            obj.value += key[filter_key];
	                        }
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

	                tArray.push(obj);
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

	        tArray.sort(function (a, b) {
	            return b.value - a.value;
	        });
	        var top = tArray.length > 10 ? 10 : tArray.length;
	        for (var i = 0; i < top; i++) {
	            newData[tArray[top - 1 - i].model] = {
	                value: tArray[top - 1 - i].value
	            };
	        }
	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false, // 图的堆叠
	                categoryY: true //柱状图竖着
	            }
	        }];
	    },
	    networkTwo: function networkTwo(data, filter_key) {
	        var source = data.data,
	            newData = [],
	            obj = {},
	            cols_name = "",
	            total_new_users = 0,
	            total_start_up = 0,
	            array = util.uniq(_.pluck(source, "key_name"));
	        if (filter_key === "terminal_network") {
	            cols_name = "联网方式";
	        } else {
	            cols_name = "运营商";
	        }
	        data.cols[0][0].caption = cols_name;
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(array), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;

	                obj[key] = {
	                    new_users: 0,
	                    start_up: 0
	                };
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                total_new_users += key.value;
	                total_start_up += key.value3;
	                obj[key.key_name].new_users += key.value;
	                obj[key.key_name].start_up += key.value3;
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(array), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var key = _step5.value;

	                newData.push({
	                    name: key,
	                    new_users: obj[key].new_users,
	                    start_up: obj[key].start_up,
	                    new_users_rate: util.toFixed(obj[key].new_users, total_new_users),
	                    start_up_rate: util.toFixed(obj[key].start_up, total_start_up)
	                });
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160418
	 * @fileoverview 网络及运营商
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(174);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/terminal/provincesOne",
	        modelName: ["KeyValue"],
	        filter_select: [{
	            title: '',
	            filter_key: 'key_type',
	            groups: [{
	                key: 'terminal_province',
	                value: '省市',
	                cell: {
	                    title: '',
	                    filter_key: 'filter_key',
	                    groups: [{
	                        key: 'value',
	                        value: '新增用户'
	                    }, {
	                        key: 'value3',
	                        value: '启动次数'
	                    }]
	                }
	            }, {
	                key: 'terminal_country',
	                value: '国家',
	                cell: {
	                    title: '',
	                    filter_key: 'filter_key',
	                    groups: [{
	                        key: 'value',
	                        value: '新增用户'
	                    }, {
	                        key: 'value3',
	                        value: '启动次数'
	                    }]
	                }
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.provincesOne(data, filter_key);
	        }
	    });

	    Router = new api(Router, {
	        router: "/terminal/provincesTwo",
	        modelName: ["KeyValue"],
	        filter_select: [{
	            title: '',
	            filter_key: 'key_type',
	            groups: [{
	                key: 'terminal_province',
	                value: '省市'
	            }, {
	                key: 'terminal_country',
	                value: '国家'
	            }]
	        }],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.provincesTwo(data, filter_key);
	        },

	        rows: [['name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate']],
	        cols: [[{
	            caption: '机型',
	            type: 'string'
	        }, {
	            caption: '新增用户',
	            type: 'number'
	        }, {
	            caption: '新增用户占比',
	            type: 'string'
	        }, {
	            caption: '启动次数',
	            type: 'number'
	        }, {
	            caption: '启动次数占比',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160418
	 * @fileoverview 网络及运营商
	 */
	var _ = __webpack_require__(84),
	    util = __webpack_require__(82);

	module.exports = {
	    provincesOne: function provincesOne(data, filter_key) {
	        var source = data.data,
	            newData = {},
	            tArray = [],
	            array = util.uniq(_.pluck(source, "key_name")),
	            filter_name = {
	            value: "新增用户",
	            value3: "启动次数"
	        },
	            type = "bar",
	            map = {
	            value: filter_name[filter_key]
	        };
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var model = _step.value;

	                var obj = {
	                    model: model,
	                    value: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var key = _step2.value;

	                        if (model === key.key_name) {
	                            obj.value += key[filter_key];
	                        }
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

	                tArray.push(obj);
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

	        tArray.sort(function (a, b) {
	            return b.value - a.value;
	        });
	        var top = tArray.length > 10 ? 10 : tArray.length;
	        for (var i = 0; i < top; i++) {
	            newData[tArray[top - 1 - i].model] = {
	                value: tArray[top - 1 - i].value
	            };
	        }
	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false, // 图的堆叠
	                categoryY: true //柱状图竖着
	            }
	        }];
	    },
	    provincesTwo: function provincesTwo(data, filter_key) {
	        var source = data.data,
	            newData = [],
	            obj = {},
	            cols_name = "",
	            total_new_users = 0,
	            total_start_up = 0,
	            array = util.uniq(_.pluck(source, "key_name"));
	        if (filter_key === "terminal_province") {
	            cols_name = "省市";
	        } else {
	            cols_name = "国家";
	        }
	        data.cols[0][0].caption = cols_name;
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(array), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;

	                obj[key] = {
	                    new_users: 0,
	                    start_up: 0
	                };
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                total_new_users += key.value;
	                total_start_up += key.value3;
	                obj[key.key_name].new_users += key.value;
	                obj[key.key_name].start_up += key.value3;
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;

	        try {
	            for (var _iterator5 = (0, _getIterator3.default)(array), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                var key = _step5.value;

	                newData.push({
	                    name: key,
	                    new_users: obj[key].new_users,
	                    start_up: obj[key].start_up,
	                    new_users_rate: util.toFixed(obj[key].new_users, total_new_users),
	                    start_up_rate: util.toFixed(obj[key].start_up, total_start_up)
	                });
	            }
	        } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                    _iterator5.return();
	                }
	            } finally {
	                if (_didIteratorError5) {
	                    throw _iteratorError5;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 访问页面
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(176);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/useAnalysis/accessPageOne",
	        modelName: ["UsersAccess"],
	        filter_select: [{
	            title: '',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'acc_num',
	                value: '访问次数'
	            }, {
	                key: 'acc_time',
	                value: '平均停留时长'
	            }, {
	                key: 'bounce_rate',
	                value: '跳出率'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.accessPageOne(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/accessPageTwo",
	        modelName: ["UsersAccess"],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.accessPageTwo(data);
	        },

	        rows: [['id', 'url', 'url_comment', 'acc_num', 'acc_num_rate', 'acc_time', 'acc_time_rate', 'bounce_rate', "operating"]],
	        cols: [[{
	            caption: '序号',
	            type: 'number'
	        }, {
	            caption: '访问页面名称',
	            type: 'string'
	        }, {
	            caption: '访问页面备注名称',
	            type: 'string'
	        }, {
	            caption: '访问次数',
	            type: 'number'
	        }, {
	            caption: '访问次数占比',
	            type: 'string'
	        }, {
	            caption: '平均停留时间(s)',
	            type: 'number'
	        }, {
	            caption: '停留时间占比',
	            type: 'string'
	        }, {
	            caption: '页面跳出率',
	            type: 'string'
	        }, {
	            caption: '趋势'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/page",
	        modelName: ["UsersAccess"],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.page(data);
	        },

	        rows: [["id", "date", "acc_num", "acc_time", "bounce_rate"]],
	        cols: [[{
	            caption: "序号",
	            type: "number"
	        }, {
	            caption: "日期",
	            type: "number"
	        }, {
	            caption: "访问次数",
	            type: "number"
	        }, {
	            caption: "平均停留时间",
	            type: "number"
	        }, {
	            caption: "页面跳出率",
	            type: "number"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 访问页面
	 */
	var util = __webpack_require__(82),
	    moment = __webpack_require__(138),
	    _ = __webpack_require__(84);

	module.exports = {
	    accessPageOne: function accessPageOne(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            filter_name = {
	            acc_num: "访问次数",
	            acc_time: "平均停留时间(s)",
	            bounce_rate: "跳出率(%)"
	        },
	            map = {
	            value: filter_name[filter_key]
	        },
	            newData = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var date = _step.value;

	                newData[date] = {
	                    value: 0
	                };
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                newData[util.getDate(key.date)].value += key[filter_key];
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

	        if (filter_key === "bounce_rate") {
	            (0, _keys2.default)(newData).forEach(function (key) {
	                newData[key].value = newData[key].value.toFixed(2);
	            });
	        }
	        if (filter_key === "acc_time") {
	            (0, _keys2.default)(newData).forEach(function (key) {
	                newData[key].value = Math.round(newData[key].value);
	            });
	        }
	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    accessPageTwo: function accessPageTwo(data) {
	        var source = data.data,
	            newData = [],
	            total_num = 0,
	            total_time = 0,
	            obj = {},
	            urls = util.uniq(_.pluck(source, "url"));
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(urls), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var url = _step3.value;

	                obj[url] = {
	                    url: urls,
	                    url_comment: "",
	                    acc_num: 0,
	                    acc_num_rate: "",
	                    acc_time: 0,
	                    acc_time_rate: "",
	                    bounce_rate: 0
	                };
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(source), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                total_num += key.acc_num;
	                total_time += key.acc_time;
	                obj[key.url].acc_num += key.acc_num;
	                obj[key.url].acc_time += key.acc_time;
	                obj[key.url].bounce_rate += key.bounce_rate;
	                obj[key.url].url_comment = key.url_comment;
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        for (var i = 0; i < urls.length; i++) {
	            newData.push({
	                id: i + 1,
	                url: urls[i],
	                url_comment: obj[urls[i]].url_comment,
	                acc_num: obj[urls[i]].acc_num,
	                acc_time: Math.round(obj[urls[i]].acc_time),
	                bounce_rate: obj[urls[i]].bounce_rate.toFixed(2) + "%",
	                acc_num_rate: util.toFixed(obj[urls[i]].acc_num, total_num),
	                acc_time_rate: util.toFixed(obj[urls[i]].acc_time, total_time),
	                operating: "<button class='btn btn-default' url_detail='/useAnalysis/page'>详情>></button>"
	            });
	        }
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    page: function page(data) {
	        var source = data.data;
	        for (var i = 0; i < source.length; i++) {
	            source[i].id = i + 1;
	            source[i].date = moment(source[i].date).format("YYYY-MM-DD");
	        }
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 访问页面数量分布
	 */
	var api = __webpack_require__(90),
	    num = ['1-2个', '3-5个', '6-9个', '10-19个', '20-30个', '30-99个', '100+个'],
	    _filter = __webpack_require__(178);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/useAnalysis/accessPageNumOne",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 3
	        },
	        filter: function filter(data, filter_key, dates) {
	            return _filter.accessPageNumOne(data, num);
	        }
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/accessPageNumTwo",
	        modelName: ["UserCompose"],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.accessPageNumTwo(data, num);
	        },

	        rows: [['distribution', 'num', 'num_rate']],
	        cols: [[{
	            caption: '访问页面',
	            type: 'string'
	        }, {
	            caption: '启动次数',
	            type: 'number'
	        }, {
	            caption: '启动次数占比',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 访问页面数量分布
	 */
	var util = __webpack_require__(82);

	module.exports = {
	    accessPageNumOne: function accessPageNumOne(data, array) {
	        var newData = {},
	            source = data.data,
	            type = "bar",
	            map = {
	            value: "访问页面"
	        };
	        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                var obj = {
	                    value: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var k = _step2.value;

	                        if (key === k.distribution) {
	                            obj.value += k.num;
	                        }
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

	                newData[key] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    accessPageNumTwo: function accessPageNumTwo(data, array) {
	        var newData = [],
	            total_num = 0,
	            source = data.data;
	        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(array), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;

	                var obj = {
	                    distribution: key,
	                    num: 0,
	                    num_rate: ""
	                };
	                var _iteratorNormalCompletion5 = true;
	                var _didIteratorError5 = false;
	                var _iteratorError5 = undefined;

	                try {
	                    for (var _iterator5 = (0, _getIterator3.default)(source), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var k = _step5.value;

	                        if (key === k.distribution) {
	                            total_num += k.num;
	                            obj.num += k.num;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError5 = true;
	                    _iteratorError5 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                            _iterator5.return();
	                        }
	                    } finally {
	                        if (_didIteratorError5) {
	                            throw _iteratorError5;
	                        }
	                    }
	                }

	                newData.push(obj);
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(newData), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                key.num_rate = util.toFixed(key.num, total_num);
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 访问页面-wap
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(180);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/useAnalysis/accessWapOne",
	        modelName: ["UrlAccessWap"],
	        platform: false,
	        fixedParams: {
	            type: "H5"
	        },
	        filter_select: [{
	            title: '',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'page_view',
	                value: '浏览量'
	            }, {
	                key: 'access_num',
	                value: '访客数'
	            }, {
	                key: 'ip_num',
	                value: 'ip数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.accessWapOne(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/accessWapTwo",
	        modelName: ["UrlAccessWap"],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter_select: [{
	            title: '',
	            filter_key: 'url_type',
	            groups: [{
	                key: '1',
	                value: '页面价值分析'
	            }, {
	                key: '2',
	                value: '入口页面'
	            }, {
	                key: '3',
	                value: '出口页面'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.accessWapTwo(data);
	        },

	        rows: [['id', 'url', 'page_view', 'access_num', 'down_browse', 'avg_stay_time', "operating"]],
	        cols: [[{
	            caption: '序号',
	            type: 'number'
	        }, {
	            caption: '页面URL',
	            type: 'string'
	        }, {
	            caption: '浏览量',
	            type: 'number'
	        }, {
	            caption: '访客数',
	            type: 'number'
	        }, {
	            caption: '贡献下游流量',
	            type: 'string'
	        }, {
	            caption: '平均停留时长(s)',
	            type: 'number'
	        }, {
	            caption: '趋势'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/wap",
	        modelName: ["UrlAccessWap"],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.wap(data);
	        },

	        rows: [["date", "url", "page_view", "access_num", "down_browse", "avg_stay_time"]],
	        cols: [[{
	            caption: "日期",
	            type: "number"
	        }, {
	            caption: "页面URL",
	            type: "number"
	        }, {
	            caption: "浏览量",
	            type: "number"
	        }, {
	            caption: "访客数",
	            type: "number"
	        }, {
	            caption: "贡献下游浏览",
	            type: "number"
	        }, {
	            caption: "平均停留时间",
	            type: "number"
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 访问页面-wap
	 */
	var util = __webpack_require__(82),
	    moment = __webpack_require__(138),
	    _ = __webpack_require__(84);

	module.exports = {
	    accessWapOne: function accessWapOne(data, filter_key, dates) {
	        var source = data.data,
	            type = "line",
	            filter_name = {
	            page_view: "浏览量",
	            access_num: "访客数",
	            ip_num: "ip数"
	        },
	            map = {
	            value: filter_name[filter_key]
	        },
	            newData = {};
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var date = _step.value;

	                newData[date] = {
	                    value: 0
	                };
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

	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var key = _step2.value;

	                newData[util.getDate(key.date)].value += key[filter_key];
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    accessWapTwo: function accessWapTwo(data) {
	        var source = data.data,
	            urls = util.uniq(_.pluck(source, "url")),
	            newData = [];
	        for (var i = 0; i < urls.length; i++) {
	            var obj = {
	                id: i + 1,
	                url: urls[i],
	                page_view: 0,
	                access_num: 0,
	                down_browse: 0,
	                avg_stay_time: 0,
	                operating: "<button class='btn btn-default' url_detail='/useAnalysis/wap'>详情>></button>"
	            };
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;

	            try {
	                for (var _iterator3 = (0, _getIterator3.default)(source), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                    var key = _step3.value;

	                    if (urls[i] === key.url) {
	                        obj.page_view += key.page_view;
	                        obj.access_num += key.access_num;
	                        obj.down_browse += key.down_browse;
	                        obj.avg_stay_time += Math.round(key.avg_stay_time);
	                    }
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

	            newData.push(obj);
	        }
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    wap: function wap(data) {
	        var source = data.data;
	        for (var i = 0; i < source.length; i++) {
	            source[i].id = i + 1;
	            source[i].date = moment(source[i].date).format("YYYY-MM-DD");
	        }
	        return util.toTable([source], data.rows, data.cols);
	    }
	};

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 使用时长
	 */
	var api = __webpack_require__(90),
	    _filter = __webpack_require__(182);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/useAnalysis/useTimeOne",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 1
	        },
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useTimeOne(data, ['1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '3-10分', '10-30分', '30分+'], "单次使用时长");
	        }
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/useTimeTwo",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 1
	        },
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useTimeTwo(data, ['1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '3-10分', '10-30分', '30分+']);
	        },

	        rows: [['distribution', 'num', 'num_rate']],
	        cols: [[{
	            caption: '访问页面',
	            type: 'string'
	        }, {
	            caption: '启动次数',
	            type: 'number'
	        }, {
	            caption: '启动次数占比',
	            type: 'string'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/useTimeThree",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 4
	        },
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useTimeOne(data, ['1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '3-10分', '10-30分', '30分+'], "日使用时长");
	        }
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/useTimeFour",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 4
	        },
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useTimeTwo(data, ['1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '3-10分', '10-30分', '30分+']);
	        },

	        rows: [['distribution', 'num', 'num_rate']],
	        cols: [[{
	            caption: '访问页面',
	            type: 'string'
	        }, {
	            caption: '用户数',
	            type: 'number'
	        }, {
	            caption: '用户数比例',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 使用时长
	 */
	var util = __webpack_require__(82);

	module.exports = {
	    useTimeOne: function useTimeOne(data, array, filter_key) {
	        var newData = {},
	            source = data.data,
	            type = "bar",
	            map = {
	            value: filter_key
	        };
	        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                var obj = {
	                    value: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var k = _step2.value;

	                        if (key === k.distribution) {
	                            obj.value += k.num;
	                        }
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

	                newData[key] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    useTimeTwo: function useTimeTwo(data, array) {
	        var newData = [],
	            total_num = 0,
	            source = data.data;
	        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(array), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;

	                var obj = {
	                    distribution: key,
	                    num: 0,
	                    num_rate: ""
	                };
	                var _iteratorNormalCompletion5 = true;
	                var _didIteratorError5 = false;
	                var _iteratorError5 = undefined;

	                try {
	                    for (var _iterator5 = (0, _getIterator3.default)(source), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var k = _step5.value;

	                        if (key === k.distribution) {
	                            total_num += k.num;
	                            obj.num += k.num;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError5 = true;
	                    _iteratorError5 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                            _iterator5.return();
	                        }
	                    } finally {
	                        if (_didIteratorError5) {
	                            throw _iteratorError5;
	                        }
	                    }
	                }

	                newData.push(obj);
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(newData), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                key.num_rate = util.toFixed(key.num, total_num);
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 使用频率
	 */
	var api = __webpack_require__(90),
	    frequency = ['1-2次', '3-5次', '6-9次', '10-19次', '20-49次', '50+次'],
	    _filter = __webpack_require__(184);

	module.exports = function (Router) {

	    Router = new api(Router, {
	        router: "/useAnalysis/useFrequencyOne",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 2
	        },
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useFrequencyOne(data, frequency, "日启动次数");
	        }
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/useFrequencyTwo",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 2
	        },
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useFrequencyTwo(data, frequency);
	        },

	        rows: [['distribution', 'num', 'num_rate']],
	        cols: [[{
	            caption: '启动次数',
	            type: 'string'
	        }, {
	            caption: '用户数',
	            type: 'number'
	        }, {
	            caption: '用户数占比',
	            type: 'string'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/useFrequencyThree",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 2,
	            day_type: 2
	        },
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useFrequencyOne(data, frequency, "周启动次数");
	        }
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/useFrequencyFour",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 2,
	            day_type: 2
	        },
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useFrequencyTwo(data, frequency);
	        },

	        rows: [['distribution', 'num', 'num_rate']],
	        cols: [[{
	            caption: '启动次数',
	            type: 'string'
	        }, {
	            caption: '用户数',
	            type: 'number'
	        }, {
	            caption: '用户数占比',
	            type: 'string'
	        }]]
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/useFrequencyFive",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 2,
	            day_type: 3
	        },
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useFrequencyOne(data, frequency, "月启动次数");
	        }
	    });

	    Router = new api(Router, {
	        router: "/useAnalysis/useFrequencySix",
	        modelName: ["UserCompose"],
	        fixedParams: {
	            use_type: 2,
	            day_type: 3
	        },
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return _filter.useFrequencyTwo(data, frequency);
	        },

	        rows: [['distribution', 'num', 'num_rate']],
	        cols: [[{
	            caption: '启动次数',
	            type: 'string'
	        }, {
	            caption: '用户数',
	            type: 'number'
	        }, {
	            caption: '用户数占比',
	            type: 'string'
	        }]]
	    });

	    return Router;
	};

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 使用频率
	 */
	var util = __webpack_require__(82);

	module.exports = {
	    useFrequencyOne: function useFrequencyOne(data, array, filter_key) {
	        var newData = {},
	            source = data.data,
	            type = "bar",
	            map = {
	            value: filter_key
	        };
	        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var key = _step.value;

	                var obj = {
	                    value: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var k = _step2.value;

	                        if (key === k.distribution) {
	                            obj.value += k.num;
	                        }
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

	                newData[key] = obj;
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

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    useFrequencyTwo: function useFrequencyTwo(data, array) {
	        var newData = [],
	            total_num = 0,
	            source = data.data;
	        //var array = [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ];
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(array), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var key = _step3.value;

	                var obj = {
	                    distribution: key,
	                    num: 0,
	                    num_rate: ""
	                };
	                var _iteratorNormalCompletion5 = true;
	                var _didIteratorError5 = false;
	                var _iteratorError5 = undefined;

	                try {
	                    for (var _iterator5 = (0, _getIterator3.default)(source), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var k = _step5.value;

	                        if (key === k.distribution) {
	                            total_num += k.num;
	                            obj.num += k.num;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError5 = true;
	                    _iteratorError5 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                            _iterator5.return();
	                        }
	                    } finally {
	                        if (_didIteratorError5) {
	                            throw _iteratorError5;
	                        }
	                    }
	                }

	                newData.push(obj);
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(newData), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                key.num_rate = util.toFixed(key.num, total_num);
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160411
	 * @fileoverview 活跃用户分析
	 */
	var api = __webpack_require__(90),
	    userAnalysis = __webpack_require__(186);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/userAnalysis/activeAccountOne",
	        modelName: ["NewAccount"],
	        filter: function filter(data, filter_key, dates) {
	            return userAnalysis.One(data, ["active_users", "active_account"], ["活跃用户", "活跃账号"], dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/userAnalysis/activeAccountTwe",
	        modelName: ["NewAccount"],
	        rows: [['date', 'active_users', 'active_users_rate', 'active_account', 'active_account_rate']],
	        cols: [[{
	            caption: '时间',
	            type: 'string',
	            width: 20
	        }, {
	            caption: '活跃用户',
	            type: 'number'
	        }, {
	            caption: '活跃用户占比',
	            type: 'string'
	        }, {
	            caption: '活跃账户',
	            type: 'number'
	        }, {
	            caption: '活跃账户占比',
	            type: 'string'
	        }]],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return userAnalysis.activeUsersTwe(data, dates);
	        }
	    });

	    return Router;
	};

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator2 = __webpack_require__(56);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author yanglei
	 * @date 20160401
	 * @fileoverview 用户分析
	 */
	var _ = __webpack_require__(84),
	    util = __webpack_require__(82);

	module.exports = {
	    One: function One(data, mapKey, mapName, dates) {
	        var type = "line",
	            source = data.data,
	            newData = {},
	            data = [],
	            map = {};
	        for (var i = 0; i < mapKey.length; i++) {
	            map[mapKey[i]] = mapName[i];
	        }
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(dates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var date = _step.value;

	                var obj = {
	                    new_users: 0,
	                    new_account: 0,
	                    active_account: 0,
	                    active_users: 0,
	                    start_up: 0
	                };
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;

	                try {
	                    for (var _iterator2 = (0, _getIterator3.default)(source), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var key = _step2.value;

	                        if (date === util.getDate(key.date)) {
	                            obj.new_users += key.new_users;
	                            obj.new_account += key.new_account;
	                            obj.active_account += key.active_account;
	                            obj.active_users += key.active_users;
	                            obj.start_up += key.start_up;
	                        }
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

	                newData[date] = obj;
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

	        data.push({
	            type: type,
	            data: newData,
	            map: map,
	            config: {
	                stack: false
	            }
	        });
	        return data;
	    },
	    newUsersTwe: function newUsersTwe(data, dates) {
	        var source = data.data,
	            newData = [],
	            total_users = 0,
	            total_account = 0;
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	            for (var _iterator3 = (0, _getIterator3.default)(dates), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                var date = _step3.value;

	                var obj = {
	                    date: date,
	                    new_users: 0,
	                    new_account: 0
	                };
	                var _iteratorNormalCompletion5 = true;
	                var _didIteratorError5 = false;
	                var _iteratorError5 = undefined;

	                try {
	                    for (var _iterator5 = (0, _getIterator3.default)(source), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var key = _step5.value;

	                        if (date === util.getDate(key.date)) {
	                            total_users += key.new_users;
	                            total_account += key.new_account;
	                            obj.new_users += key.new_users;
	                            obj.new_account += key.new_account;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError5 = true;
	                    _iteratorError5 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                            _iterator5.return();
	                        }
	                    } finally {
	                        if (_didIteratorError5) {
	                            throw _iteratorError5;
	                        }
	                    }
	                }

	                newData.push(obj);
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

	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	            for (var _iterator4 = (0, _getIterator3.default)(newData), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                var key = _step4.value;

	                key.new_users_rate = util.toFixed(key.new_users, total_users);
	                key.new_account_rate = util.toFixed(key.new_account, total_account);
	            }
	        } catch (err) {
	            _didIteratorError4 = true;
	            _iteratorError4 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion4 && _iterator4.return) {
	                    _iterator4.return();
	                }
	            } finally {
	                if (_didIteratorError4) {
	                    throw _iteratorError4;
	                }
	            }
	        }

	        newData.sort(function (a, b) {
	            return new Date(b.date) - new Date(a.date);
	        });
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    activeUsersTwe: function activeUsersTwe(data, dates) {
	        var source = data.data,
	            newData = [],
	            total_users = 0,
	            total_account = 0;
	        var _iteratorNormalCompletion6 = true;
	        var _didIteratorError6 = false;
	        var _iteratorError6 = undefined;

	        try {
	            for (var _iterator6 = (0, _getIterator3.default)(dates), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	                var date = _step6.value;

	                var obj = {
	                    date: date,
	                    active_users: 0,
	                    active_account: 0
	                };
	                var _iteratorNormalCompletion8 = true;
	                var _didIteratorError8 = false;
	                var _iteratorError8 = undefined;

	                try {
	                    for (var _iterator8 = (0, _getIterator3.default)(source), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                        var key = _step8.value;

	                        if (date === util.getDate(key.date)) {
	                            total_users += key.active_users;
	                            total_account += key.active_account;
	                            obj.active_users += key.active_users;
	                            obj.active_account += key.active_account;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError8 = true;
	                    _iteratorError8 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                            _iterator8.return();
	                        }
	                    } finally {
	                        if (_didIteratorError8) {
	                            throw _iteratorError8;
	                        }
	                    }
	                }

	                newData.push(obj);
	            }
	        } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                    _iterator6.return();
	                }
	            } finally {
	                if (_didIteratorError6) {
	                    throw _iteratorError6;
	                }
	            }
	        }

	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;

	        try {
	            for (var _iterator7 = (0, _getIterator3.default)(newData), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	                var key = _step7.value;

	                key.active_users_rate = util.toFixed(key.active_users, total_users);
	                key.active_account_rate = util.toFixed(key.active_account, total_account);
	            }
	        } catch (err) {
	            _didIteratorError7 = true;
	            _iteratorError7 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion7 && _iterator7.return) {
	                    _iterator7.return();
	                }
	            } finally {
	                if (_didIteratorError7) {
	                    throw _iteratorError7;
	                }
	            }
	        }

	        newData.sort(function (a, b) {
	            return new Date(b.date) - new Date(a.date);
	        });
	        return util.toTable([newData], data.rows, data.cols);
	    },
	    startUp: function startUp(data, dates) {
	        var source = data.data,
	            newData = [];
	        dates.sort(function (a, b) {
	            return new Date(b) - new Date(a);
	        });
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;

	        try {
	            for (var _iterator9 = (0, _getIterator3.default)(dates), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	                var date = _step9.value;

	                var obj = {
	                    date: date,
	                    start_up: 0,
	                    active_users: 0,
	                    active_account: 0,
	                    startup_per: 0
	                };
	                var _iteratorNormalCompletion11 = true;
	                var _didIteratorError11 = false;
	                var _iteratorError11 = undefined;

	                try {
	                    for (var _iterator11 = (0, _getIterator3.default)(source), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
	                        var key = _step11.value;

	                        if (date === util.getDate(key.date)) {
	                            obj.start_up += key.start_up;
	                            obj.active_users += key.active_users;
	                            obj.active_account += key.active_account;
	                            obj.startup_per += key.startup_per;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError11 = true;
	                    _iteratorError11 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
	                            _iterator11.return();
	                        }
	                    } finally {
	                        if (_didIteratorError11) {
	                            throw _iteratorError11;
	                        }
	                    }
	                }

	                newData.push(obj);
	            }
	        } catch (err) {
	            _didIteratorError9 = true;
	            _iteratorError9 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                    _iterator9.return();
	                }
	            } finally {
	                if (_didIteratorError9) {
	                    throw _iteratorError9;
	                }
	            }
	        }

	        var _iteratorNormalCompletion10 = true;
	        var _didIteratorError10 = false;
	        var _iteratorError10 = undefined;

	        try {
	            for (var _iterator10 = (0, _getIterator3.default)(newData), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                var key = _step10.value;

	                key.startup_per = key.startup_per.toFixed(2);
	            }
	        } catch (err) {
	            _didIteratorError10 = true;
	            _iteratorError10 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                    _iterator10.return();
	                }
	            } finally {
	                if (_didIteratorError10) {
	                    throw _iteratorError10;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    },
	    versionOne: function versionOne(data, filter_key, dates) {
	        var source = data.data,
	            vers = util.uniq(_.pluck(source, "ver")),
	            newData = {},
	            array = [],
	            type = "line",
	            filter_name = {
	            new_users: "新增用户",
	            active_users: "活跃用户",
	            start_up: "启动次数"
	        },
	            map = {};
	        var _iteratorNormalCompletion12 = true;
	        var _didIteratorError12 = false;
	        var _iteratorError12 = undefined;

	        try {
	            for (var _iterator12 = (0, _getIterator3.default)(vers), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
	                var ver = _step12.value;

	                var obj = {
	                    ver: ver,
	                    value: 0
	                };
	                var _iteratorNormalCompletion14 = true;
	                var _didIteratorError14 = false;
	                var _iteratorError14 = undefined;

	                try {
	                    for (var _iterator14 = (0, _getIterator3.default)(source), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
	                        var key = _step14.value;

	                        if (key.ver === ver) {
	                            obj.value += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError14 = true;
	                    _iteratorError14 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion14 && _iterator14.return) {
	                            _iterator14.return();
	                        }
	                    } finally {
	                        if (_didIteratorError14) {
	                            throw _iteratorError14;
	                        }
	                    }
	                }

	                array.push(obj);
	            }
	        } catch (err) {
	            _didIteratorError12 = true;
	            _iteratorError12 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion12 && _iterator12.return) {
	                    _iterator12.return();
	                }
	            } finally {
	                if (_didIteratorError12) {
	                    throw _iteratorError12;
	                }
	            }
	        }

	        array.sort(function (a, b) {
	            return b.value - a.value;
	        });
	        var top = array.length > 10 ? 10 : array.length;
	        for (var i = 0; i < top; i++) {
	            map[array[i].ver] = array[i].ver + "版本";
	        }
	        var _iteratorNormalCompletion13 = true;
	        var _didIteratorError13 = false;
	        var _iteratorError13 = undefined;

	        try {
	            for (var _iterator13 = (0, _getIterator3.default)(dates), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
	                var date = _step13.value;

	                var obj = {};
	                for (var i = 0; i < top; i++) {
	                    obj[array[i].ver] = 0;
	                }
	                var _iteratorNormalCompletion15 = true;
	                var _didIteratorError15 = false;
	                var _iteratorError15 = undefined;

	                try {
	                    for (var _iterator15 = (0, _getIterator3.default)(source), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
	                        var key = _step15.value;

	                        if (date === util.getDate(key.date)) {
	                            obj[key.ver] += key[filter_key];
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError15 = true;
	                    _iteratorError15 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion15 && _iterator15.return) {
	                            _iterator15.return();
	                        }
	                    } finally {
	                        if (_didIteratorError15) {
	                            throw _iteratorError15;
	                        }
	                    }
	                }

	                newData[date] = obj;
	            }
	        } catch (err) {
	            _didIteratorError13 = true;
	            _iteratorError13 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion13 && _iterator13.return) {
	                    _iterator13.return();
	                }
	            } finally {
	                if (_didIteratorError13) {
	                    throw _iteratorError13;
	                }
	            }
	        }

	        return [{
	            type: type,
	            map: map,
	            data: newData,
	            config: { // 配置信息
	                stack: false // 图的堆叠
	            }
	        }];
	    },
	    versionTwo: function versionTwo(data, dates) {
	        var source = data.data,
	            newData = [],
	            rows = ["date"],
	            cols = [{
	            caption: '时间',
	            type: 'string',
	            width: 20
	        }],
	            vers = util.uniq(_.pluck(source, "ver"));
	        var _iteratorNormalCompletion16 = true;
	        var _didIteratorError16 = false;
	        var _iteratorError16 = undefined;

	        try {
	            for (var _iterator16 = (0, _getIterator3.default)(vers), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
	                var ver = _step16.value;

	                rows.push(ver.replace(/\./g, ''));
	                cols.push({
	                    caption: ver + "版本",
	                    type: "number"
	                });
	            }
	        } catch (err) {
	            _didIteratorError16 = true;
	            _iteratorError16 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion16 && _iterator16.return) {
	                    _iterator16.return();
	                }
	            } finally {
	                if (_didIteratorError16) {
	                    throw _iteratorError16;
	                }
	            }
	        }

	        dates.sort(function (a, b) {
	            return new Date(b) - new Date(a);
	        });

	        data.rows[0] = rows;
	        data.cols[0] = cols;
	        var _iteratorNormalCompletion17 = true;
	        var _didIteratorError17 = false;
	        var _iteratorError17 = undefined;

	        try {
	            for (var _iterator17 = (0, _getIterator3.default)(dates), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
	                var date = _step17.value;

	                var obj = {
	                    date: date
	                };
	                var _iteratorNormalCompletion18 = true;
	                var _didIteratorError18 = false;
	                var _iteratorError18 = undefined;

	                try {
	                    for (var _iterator18 = (0, _getIterator3.default)(vers), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
	                        var ver = _step18.value;

	                        ver = ver.replace(/\./g, '');
	                        obj[ver] = 0;
	                    }
	                } catch (err) {
	                    _didIteratorError18 = true;
	                    _iteratorError18 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion18 && _iterator18.return) {
	                            _iterator18.return();
	                        }
	                    } finally {
	                        if (_didIteratorError18) {
	                            throw _iteratorError18;
	                        }
	                    }
	                }

	                var _iteratorNormalCompletion19 = true;
	                var _didIteratorError19 = false;
	                var _iteratorError19 = undefined;

	                try {
	                    for (var _iterator19 = (0, _getIterator3.default)(source), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
	                        var key = _step19.value;

	                        if (date === util.getDate(key.date)) {
	                            obj[key.ver.replace(/\./g, '')] += key.total_users;
	                        }
	                    }
	                } catch (err) {
	                    _didIteratorError19 = true;
	                    _iteratorError19 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion19 && _iterator19.return) {
	                            _iterator19.return();
	                        }
	                    } finally {
	                        if (_didIteratorError19) {
	                            throw _iteratorError19;
	                        }
	                    }
	                }

	                newData.push(obj);
	            }
	        } catch (err) {
	            _didIteratorError17 = true;
	            _iteratorError17 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion17 && _iterator17.return) {
	                    _iterator17.return();
	                }
	            } finally {
	                if (_didIteratorError17) {
	                    throw _iteratorError17;
	                }
	            }
	        }

	        return util.toTable([newData], data.rows, data.cols);
	    }
	};

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160323
	 * @fileoverview 用户分析
	 */
	var api = __webpack_require__(90),
	    moment = __webpack_require__(138),
	    userAnalysis = __webpack_require__(186);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/userAnalysis/newUsersOne",
	        modelName: ["NewAccount"],
	        filter: function filter(data, filter_key, dates) {
	            return userAnalysis.One(data, ["new_users", "new_account"], ["新增用户", "新增账户"], dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/userAnalysis/newUsersTwe",
	        modelName: ["NewAccount"],
	        rows: [['date', 'new_users', 'new_users_rate', 'new_account', 'new_account_rate']],
	        cols: [[{
	            caption: '时间',
	            type: 'string',
	            width: 20
	        }, {
	            caption: '新增用户',
	            type: 'number'
	        }, {
	            caption: '新增用户占比',
	            type: 'string'
	        }, {
	            caption: '新增账户',
	            type: 'number'
	        }, {
	            caption: '新增账户占比',
	            type: 'string'
	        }]],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return userAnalysis.newUsersTwe(data, dates);
	        }
	    });

	    return Router;
	};

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 启动次数
	 */
	var api = __webpack_require__(90),
	    userAnalysis = __webpack_require__(186);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/userAnalysis/startUpOne",
	        modelName: ["NewAccount"],
	        filter: function filter(data, filter_key, dates) {
	            return userAnalysis.One(data, ["start_up"], ["启动次数"], dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/userAnalysis/startUpTwe",
	        modelName: ["NewAccount"],
	        rows: [['date', 'start_up', 'active_users', 'active_account', 'startup_per']],
	        cols: [[{
	            caption: '时间',
	            type: 'string',
	            width: 20
	        }, {
	            caption: '启动次数',
	            type: 'number'
	        }, {
	            caption: '活跃用户',
	            type: 'number'
	        }, {
	            caption: '活跃账户',
	            type: 'number'
	        }, {
	            caption: '人均启动次数',
	            type: 'number'
	        }]],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return userAnalysis.startUp(data, dates);
	        }
	    });

	    return Router;
	};

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author yanglei
	 * @date 20160413
	 * @fileoverview 版本分析
	 */
	var api = __webpack_require__(90),
	    moment = __webpack_require__(138),
	    userAnalysis = __webpack_require__(186);

	module.exports = function (Router) {
	    Router = new api(Router, {
	        router: "/userAnalysis/versionOne",
	        modelName: ["NewAccount"],
	        filter_select: [{
	            title: '',
	            filter_key: 'filter_key',
	            groups: [{
	                key: 'new_users',
	                value: '新增用户'
	            }, {
	                key: 'active_users',
	                value: '活跃用户'
	            }, {
	                key: 'start_up',
	                value: '启动次数'
	            }]
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return userAnalysis.versionOne(data, filter_key, dates);
	        }
	    });

	    Router = new api(Router, {
	        router: "/userAnalysis/versionTwo",
	        modelName: ["NewAccount"],
	        rows: [],
	        cols: [],
	        excel_export: true,
	        flexible_btn: [{
	            content: '<a href="javascript:void(0)">导出</a>',
	            preMethods: ['excel_export']
	        }],
	        filter: function filter(data, filter_key, dates) {
	            return userAnalysis.versionTwo(data, dates);
	        }
	    });

	    return Router;
	};

/***/ },
/* 190 */,
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author fuqiang
	 * @date 20151128
	 * @fileoverview 用户登陆控制器和权限校验
	 */
	var ldap = __webpack_require__(192);
	var config = __webpack_require__(43);
	var lodash = __webpack_require__(84);

	var username = 'yunyingbaobiao';
	var password = '5P=/d_Xp';
	var ldapurl = 'ldap://10.69.100.1';
	var superAdminInfo = {
	    username: "superAdmin",
	    password: "12345678"
	};

	module.exports = function (Router) {

	    Router.get('/login', function (req, res) {
	        if (req.session.isLogin) {
	            res.redirect('/dataOverview/app');
	        } else {
	            res.render('login/login', {
	                from: req.query.from
	            });
	        }
	    });

	    function unbind(client, next) {
	        client.unbind(function (err) {
	            if (err) {
	                next(err);
	            }
	        });
	    }

	    function saveLogin(req, res, remember, email, userInfo) {
	        var maxAge = 1000 * 60 * 60 * 2; //2小时
	        if (remember) {
	            maxAge = 1000 * 60 * 60 * 24 * 7; // 一周
	        }
	        req.sessionOptions.maxAge = new Date(Date.now() + maxAge);
	        req.session.userInfo = userInfo;
	        req.session.isLogin = true;
	    }

	    function authorityRouteFromBrowserUrl(req, res, next) {
	        var url = req.originalUrl,
	            limitedStr = "",
	            urlTransToIndex = "",
	            fixedUrl = url;

	        //.match(/^\/.+?\/.+   (?=\?|\/) |  ^\/.+?\/.+ (?=\?|\/)? /);

	        if (fixedUrl) {
	            var limitedConfigArr = config.limit;
	            limitedStr = req.session.userInfo.limited;
	            // fixedUrl = fixedUrl[0];
	            lodash.forEach(limitedConfigArr, function (item) {
	                var key = (0, _keys2.default)(item)[0];
	                var obj = item[key];
	                var href = obj.href;
	                var path = obj.path;
	                if (href === fixedUrl) {
	                    urlTransToIndex = obj.id;
	                } else if (obj.path.length) {
	                    var flag = true;
	                    lodash.forEach(path, function (v, k) {
	                        if (v.path === fixedUrl && flag) {
	                            urlTransToIndex = obj.id + "-" + k;
	                            flag = false; //类似break功能
	                        } else if (flag) {
	                                /*serverConfig读取权限*/
	                                if (v.serverConfig && v.serverConfig.links) {
	                                    var links = v.serverConfig.links;
	                                    lodash.forEach(links, function (v1) {
	                                        if (v1.href === fixedUrl) {
	                                            urlTransToIndex = obj.id + "-" + k;
	                                            flag = false;
	                                        }
	                                    });
	                                }
	                            }
	                    });
	                }
	            });
	        }
	        /*路由不存在或者无权限时urlTransToIndex为空字符串*/
	        if (urlTransToIndex) {
	            urlTransToIndex = urlTransToIndex.toString();
	            var parent = urlTransToIndex.split("-")[0];
	            var children = urlTransToIndex.split("-")[1];
	            if (limitedStr.split(',').some(function (item) {
	                var arrs = item.split("-");
	                var arrsFirstItem = arrs.shift();
	                return arrsFirstItem === parent || arrs.indexOf(children) >= 0;
	            })) {
	                /*实现三级菜单所处的index保存到session*/
	                req.session.thirdMenuIndex = urlTransToIndex;
	                next();
	            } else {
	                res.render("include/authority");
	            }
	        } else {
	            next();
	        }
	    }

	    Router.post('/logout', function (req, res) {
	        req.session = null;
	        res.redirect('/login');
	    });

	    Router.post('/login', function (req, res, next) {
	        if (req.session.isLogin) {
	            res.redirect('/dataOverview/app');
	        } else {
	            //本地要有个数据库
	            var email = req.body.email,
	                pwd = req.body.password,
	                from = req.body.from,
	                remember = req.body.remember;
	            //直接去ldap交换验证
	            if (!email || !pwd) {
	                req.flash('密码和账户不正确');
	                res.redirect('back');
	                return;
	            } else if (email === superAdminInfo.username && pwd === superAdminInfo.password) {
	                /*超级管理员不进行ldap验证*/
	                req.models.Users.find({
	                    username: email
	                }, function (err, ret) {
	                    if (err) {
	                        next(new Error("用户不存在"));
	                    } else {
	                        if (ret.length) {
	                            saveLogin(req, res, remember, email, ret[0]);
	                            res.redirect(from || '/dataOverview/app');
	                        }
	                    }
	                });
	                return;
	            }
	            var client = ldap.createClient({
	                url: ldapurl,
	                timeout: 5000,
	                connectTimeout: 10000
	            });
	            client.bind(username, password, function (err) {
	                if (err) {
	                    unbind(client, next);
	                } else {
	                    if (email.indexOf("@") < 0) {
	                        email += '@gomeplus.com';
	                    }
	                    client.search('ou=美信,dc=meixin,dc=com', {
	                        filter: '(userprincipalname=' + email + ')',
	                        scope: 'sub'
	                    }, function (err, resp) {
	                        var entrys = [];
	                        resp.on('searchEntry', function (entry) {
	                            entrys.push(entry);
	                        });
	                        resp.on('error', next);
	                        resp.on('end', function () {
	                            if (entrys.length === 1) {
	                                var entry = entrys[0];
	                                //console.log('entry: ' + JSON.stringify(entry.object));
	                                client.bind(entry.object.dn, pwd, function (err) {
	                                    //验证成功
	                                    if (err) {
	                                        //console.log(err);
	                                        unbind(client, next);
	                                        req.flash('密码和账户不正确');
	                                        res.redirect('back');
	                                    } else {
	                                        req.models.Users.find({
	                                            username: email
	                                        }, function (err, ret) {
	                                            if (err) {
	                                                unbind(client, next);
	                                            } else {
	                                                if (ret.length) {
	                                                    saveLogin(req, res, remember, email, ret[0]);
	                                                    unbind(client, next);
	                                                    res.redirect(from || '/dataOverview/app');
	                                                } else {
	                                                    //不存在本地用户,写入本地用户
	                                                    req.models.Users.create({
	                                                        username: email,
	                                                        login_time: new Date(entry.object.lastLogon),
	                                                        lastlogin_time: new Date(entry.object.lastLogonTimestamp)
	                                                    }, function (err, ret) {
	                                                        if (err) {
	                                                            unbind(client, next);
	                                                        } else {
	                                                            saveLogin(req, res, remember, email, ret);
	                                                            unbind(client, next);
	                                                            res.redirect(from || '/dataOverview/app');
	                                                        }
	                                                    });
	                                                }
	                                            }
	                                        });
	                                    }
	                                });
	                            } else {
	                                unbind(client, next);
	                                req.flash('密码和账户不正确');
	                                res.redirect('back');
	                            }
	                        });
	                    });
	                }
	            });
	        }
	    });

	    Router.get(/^((?!\/dist).)*$/, function (req, res, next) {
	        if (req.session.isLogin) {
	            /*用户输入浏览器地址栏URL路由权限控制*/
	            authorityRouteFromBrowserUrl(req, res, next);
	        } else {
	            var form = req.protocol + '://' + req.get('host') + req.originalUrl;
	            res.redirect('/login?from=' + encodeURIComponent(form));
	        }
	    });

	    Router.all('/', function (req, res) {
	        res.redirect("/dataOverview/app");
	    });

	    return Router;
	};

/***/ },
/* 192 */
/***/ function(module, exports) {

	module.exports = require("ldapjs");

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @author liuliangsir
	 * @date 20151209
	 * @description 针对用户模块的增删改查
	 */
	var update = __webpack_require__(194);
	var select = __webpack_require__(195);
	var lodash = __webpack_require__(84);
	module.exports = function (Router) {

	  Router.get('/user/all', function (req, res, next) {
	    var pageMax = 4;
	    var paginationMaxCount = 4;
	    var path = '/user/all';
	    var page = parseInt(req.query.page);

	    if (isNaN(page) || page <= 0) {
	      page = 1;
	    }

	    var start = (page - 1) * pageMax;
	    var end = page * pageMax;
	    var query = req.query.query ? req.query.query : null;

	    select.userFindAll({
	      start: start,
	      end: end,
	      model: req.models,
	      query: query
	    }, function (err, ret, pageCount) {
	      if (err) {
	        next(err);
	      } else {
	        var fixedRet = lodash.map(ret, function (item) {
	          var obj = {};
	          lodash.forIn(item, function (val, key) {
	            if (val !== null && (key === "id" || key === "username" || key === "is_admin")) {
	              obj[key] = val;
	            }
	          });
	          return obj;
	        });
	        res.render('user/index', {
	          users: fixedRet,
	          currentPage: page,
	          pageCount: Math.ceil(pageCount / pageMax),
	          pageMax: pageMax,
	          paginationMaxCount: paginationMaxCount,
	          path: path
	        });
	      }
	    });
	  });

	  Router.post('/user/updateLimit', function (req, res, next) {
	    var userId = req.body.userId,
	        limits = req.body.limits;
	    update.userLimitUpdate({
	      model: req.models,
	      userId: userId,
	      limited: limits,
	      req: req
	    }, function (err, ret) {
	      if (err) {
	        next(err);
	      } else {
	        res.json(ret);
	      }
	    });
	  });

	  Router.post('/user/showLimit', function (req, res, next) {
	    var userId = req.body.userId;
	    req.models.Users.find({
	      id: userId
	    }, function (err, ret) {
	      if (err) {
	        next(err);
	      } else {
	        res.json(ret);
	      }
	    });
	  });

	  Router.post('/user/changeRole', function (req, res, next) {
	    var role = req.body.role,
	        userId = req.body.userId;
	    update.userRoleUpdate({
	      model: req.models,
	      userId: userId,
	      role: role,
	      req: req
	    }, function (err, ret) {
	      if (err) {
	        next(err);
	      } else {
	        res.json(ret);
	      }
	    });
	  });

	  return Router;
	};

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * @author liuliang
	 * @fileoverview 用户权限update
	 */
	var utils = __webpack_require__(82);
	module.exports.userLimitUpdate = function (params, func) {

	  var model = params.model,
	      userId = params.userId,
	      limited = params.limited,
	      req = params.req;

	  model.Users.find({
	    id: userId
	  }, function (err, ret) {
	    if (err) {
	      func(err);
	    } else {
	      if (ret.length > 0) {
	        ret[0].limited = limited;
	        ret[0].save(function (error) {
	          if (error) {
	            func(error);
	          } else {
	            /*更新session*/
	            if (req.session && req.session.userInfo && parseInt(req.session.userInfo.id) === parseInt(userId)) {
	              utils.updateSession(req, { userInfo: ret[0] });
	            }
	            func(null, {
	              msg: "更新成功",
	              status: 200,
	              success: true
	            });
	          }
	        });
	      } else {
	        func(new Error("该用户不存在"));
	      }
	    }
	  });
	};

	module.exports.userRoleUpdate = function (params, func) {
	  var model = params.model,
	      userId = params.userId,
	      role = parseInt(params.role),
	      self = this,
	      req = params.req;

	  if (role !== 0 && role !== 1) {
	    role = 0;
	  }

	  model.Users.find({
	    id: userId
	  }, function (err, ret) {
	    if (err) {
	      func(err);
	    } else {
	      if (ret.length > 0) {
	        ret[0].is_admin = role;
	        ret[0].limited = self.userLimitUpdateByCondition(role, /0\-0(\,)?/, "0-0,", ret[0].limited);
	        ret[0].save(function (error) {
	          if (error) {
	            func(error);
	          } else {
	            func(null, {
	              msg: "更新成功",
	              status: 200,
	              success: true,
	              data: role
	            });
	          }
	        });
	      } else {
	        func(new Error("该用户不存在"));
	      }
	    }
	  });
	};

	module.exports.userLimitUpdateByCondition = function (condition, regExp, tpl, limited) {
	  if (condition) {
	    if (!regExp.test(limited)) return tpl + limited;else return limited;
	  } else {
	    if (regExp.test(limited)) return limited.replace(regExp, "");else return limited;
	  }
	};

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @author liuliang
	 * @fileoverview  查找用户数据
	 */

	var orm = __webpack_require__(135);

	module.exports.userFindAll = function (params, func) {
	  var start = parseInt(params.start),
	      end = parseInt(params.end),
	      offset = end - start,
	      model = params.model;

	  var findParams = {
	    is_admin: orm.ne('99')
	  };
	  if (params.query) {
	    findParams.username = orm.like('%' + params.query + '%');
	  }
	  model.Users.count(findParams, function (err, count) {
	    if (err) {
	      func(err);
	    } else {

	      model.Users.find(findParams, {
	        offset: start,
	        limit: offset
	      }, function (err, items) {
	        if (err) {
	          func(err);
	        } else {
	          func(err, items, count);
	        }
	      });
	    }
	  });
	};

/***/ },
/* 196 */
/***/ function(module, exports) {

	"use strict";

	// 选择类目接口
	module.exports = function (Router) {
	    Router.get('/api/categories', function (req, res, next) {
	        var pid = req.query.pid || 0;
	        req.models["ConfCategories"].find({ pid: pid, status: 1 }, function (err, data) {
	            res.send(data);
	        });
	    });
	    return Router;
	};

/***/ },
/* 197 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 198 */
/***/ function(module, exports) {

	module.exports = require("flashify");

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @author fuqiang
	 * @fileoverview orm for dataabase
	 * @date 20151201
	 */

	var orm = __webpack_require__(135);
	var config = __webpack_require__(200);
	var db = __webpack_require__(201);
	var mysql = db[config.db];

	function connect(app) {
	    app.use(orm.express('mysql://' + mysql.username + ':' + mysql.pwd + '@' + mysql.host + '/' + mysql.database + '?timezone=CST', {
	        define: function define(db, models, next) {
	            db.settings.set('instance.cache', false);
	            models.Users = db.define("tbl_dataplatform_nodejs_users", {
	                id: { type: 'serial', key: true },
	                username: String,
	                is_admin: { type: "number", defaultValue: 0 },
	                limited: { type: "text", defaultValue: "2-0-1,3-0-1-2-3,4,5,6-0-1-2-3-4,8-0-1-2,9-0-1,10,11,12,13-0-1-2,14-0-1-2,15-0-1-2-3-4-5,16" },
	                last_ip: String,
	                login_ip: String,
	                login_time: Date,
	                lastlogin_time: Date
	            });
	            models.NewAccount = db.define("tbl_rt_useranalysis_newuser", {
	                id: { type: 'number', key: true },
	                date: Date,
	                new_users: Number,
	                new_account: Number,
	                active_users: Number,
	                total_users: Number,
	                active_account: Number,
	                start_up: Number,
	                startup_per: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                day_type: Number
	            });
	            models.Configure = db.define("tbl_rt_configure", {
	                id: { type: 'number', key: true },
	                name: String,
	                type: String
	            });
	            models.Area = db.define("tbl_rt_terminal_area", {
	                id: { type: 'number', key: true },
	                start_up: Number,
	                new_users: Number,
	                country: String,
	                province: String,
	                area: String,
	                date: Date,
	                channel: String,
	                ver: String,
	                type: String
	            });
	            models.UsersAccess = db.define("tbl_rt_user_access", {
	                id: { type: 'number', key: true },
	                date: Date,
	                acc_num: Number,
	                acc_time: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                day_type: Number,
	                url: String,
	                url_comment: String,
	                bounce_rate: Number
	            });
	            models.Terminal = db.define("tbl_rt_terminal_device", {
	                id: { type: 'number', key: true },
	                date: Date,
	                new_users: Number,
	                start_up: Number,
	                oname: String,
	                object: String,
	                ver: String,
	                channel: String,
	                type: String,
	                day_type: Number
	            });
	            models.SalesOrder = db.define("tbl_rt_order_list", {
	                id: { type: 'number', key: true },
	                date: Date,
	                users: Number,
	                order_users: Number,
	                pay_users: Number,
	                order_num: Number,
	                pay_num: Number,
	                order_price: Number,
	                pay_price: Number,
	                coupons_num: Number,
	                coupons_use: Number,
	                refund_price: Number,
	                refund_num: Number,
	                type: String,
	                channel: String,
	                day_type: Number,
	                ver: String
	            });
	            models.SalesArea = db.define("tbl_rt_order_area", {
	                id: { type: 'number', key: true },
	                order_price: Number,
	                order_commodity: Number,
	                order_users: Number,
	                country: String,
	                province: String,
	                area: String,
	                date: Date,
	                type: String,
	                channel: String,
	                day_type: Number,
	                ver: String
	            });
	            models.SalesCategory = db.define("tbl_rt_order_category", {
	                id: { type: 'number', key: true },
	                date: Date,
	                category_name: String,
	                category_id: Number,
	                access_num: Number,
	                access_users: Number,
	                commodity_num: Number,
	                order_price: Number,
	                pay_price: Number,
	                category_type: Number,
	                type: String,
	                channel: String,
	                day_type: Number,
	                ver: String
	            });
	            models.ShopList = db.define("tbl_rt_shop_list", {
	                id: { type: 'number', key: true },
	                date: Date,
	                shop_new_num: Number,
	                shop_succ_num: Number,
	                shop_order_num: Number,
	                shop_total_num: Number,
	                shop_order_succ_num: Number,
	                shop_access_num: Number,
	                shop_share_num: Number,
	                type: String,
	                channel: String,
	                day_type: Number,
	                ver: String
	            });
	            models.ShopTop = db.define("tbl_rt_shop_top", {
	                id: { type: 'number', key: true },
	                date: Date,
	                shop_name: String,
	                shop_id: Number,
	                access_num: Number,
	                access_users: Number,
	                share_num: Number,
	                pay_price: Number,
	                sku_type: Number,
	                pay_commodity_num: Number,
	                share_commodity_num: Number,
	                type: String,
	                channel: String,
	                day_type: Number,
	                ver: String
	            });
	            models.CommodityList = db.define("tbl_rt_product_list", {
	                id: { type: 'number', key: true },
	                date: Date,
	                commodity_users: Number,
	                commodity_num: Number,
	                commodity_access_num: Number,
	                order_num: Number,
	                pay_num: Number,
	                order_commodity_num: Number,
	                pay_commodity_num: Number,
	                commodity_times: Number,
	                refund_num: Number,
	                pay_price: Number,
	                sku_type: Number,
	                refund_price: Number,
	                type: String,
	                channel: String,
	                day_type: Number,
	                ver: String
	            });
	            models.CommodityTop = db.define("tbl_rt_product_top", {
	                id: { type: 'number', key: true },
	                date: Date,
	                commodity_name: String,
	                commodity_id: Number,
	                access_num: Number,
	                access_users: Number,
	                share_num: Number,
	                order_users: Number,
	                order_price: Number,
	                refund_num: Number,
	                refund_price: Number,
	                type: String,
	                channel: String,
	                day_type: Number,
	                ver: String
	            });
	            models.UserCompose = db.define("tbl_rt_use_time", {
	                id: { type: 'number', key: true },
	                date: Date,
	                num: Number,
	                distribution: String,
	                use_type: String,
	                type: String,
	                channel: String,
	                day_type: Number,
	                ver: String
	            });
	            models.MarketingFlow = db.define("tbl_rt_marketing_flow", {
	                id: { type: 'number', key: true },
	                date: Date,
	                region: String,
	                type: Number,
	                page_name: String,
	                page_url: String,
	                visitor_cut: Number,
	                pv: Number,
	                stay_time_avg: Number,
	                jump_loss_rate: Number,
	                day_type: Number,
	                h5_conversion_rate: Number
	            });
	            models.MarketingCoupon = db.define("tbl_rt_marketing_coupon", {
	                id: { type: 'number', key: true },
	                date: Date,
	                type: String,
	                coupon_type: String,
	                coupon_facevalue: String,
	                get_coupon_user: Number,
	                get_coupon_cut: Number,
	                get_coupon_amount: Number,
	                used_coupon_user: Number,
	                used_coupon_cut: Number,
	                used_coupon_amount: Number,
	                day_type: Number
	            });
	            models.MarketingCouponDetails = db.define("tbl_rt_marketing_coupon_details", {
	                id: { type: 'number', key: true },
	                date: Date,
	                coupon_id: String,
	                coupon_type: String,
	                shop_name: String,
	                coupon_scope: String,
	                coupon_facevalue: String,
	                coupon_describe: String,
	                coupon_status: String,
	                day_type: Number
	            });
	            models.OverviewPage = db.define("tbl_rt_overview_page", {
	                id: { type: 'number', key: true },
	                date: Date,
	                page_type: Number,
	                page_url: String,
	                page_describe: String,
	                pv: Number,
	                uv: Number,
	                follow_page_sum: Number,
	                day_type: Number,
	                type: String,
	                ip_count: Number,
	                stay_time_avg: Number,
	                entry_page_cut: Number,
	                exit_page_cut: Number,
	                exit_rate: Number
	            });
	            models.OverviewPlatf = db.define("tbl_rt_overview_platf", {
	                id: { type: 'number', key: true },
	                date: Date,
	                region: String,
	                open_total: Number,
	                open_user_total: Number,
	                open_user_avg: Number,
	                uv: Number,
	                pv: Number,
	                ip_count: Number,
	                jump_loss_rate: Number,
	                new_user: Number,
	                new_user_rate: Number,
	                new_account: Number,
	                register_rate: Number,
	                stay_time_avg: Number,
	                using_time_avg: Number,
	                visit_time_avg: Number,
	                day_type: Number,
	                type: String
	            });
	            models.KpiValue = db.define("tbl_rt_kpi_value", {
	                id: { type: 'number', key: true },
	                date: Date,
	                kpi_type: Number,
	                kpi_value: Number,
	                day_type: Number,
	                ver: String,
	                channel: String
	            });
	            models.ShareAnalysis = db.define("tbl_rt_share_analysis", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                share_num: Number,
	                open_num: Number,
	                buy_num: Number
	            });
	            models.verAnalysis = db.define("tbl_rt_useranalysis_version", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                users: Number
	            });
	            models.Rebate = db.define("tbl_rt_rebate", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                defate_plan_count: Number,
	                participate_seller_count: Number,
	                total_shop_num: Number,
	                participate_goods_count: Number,
	                total_product_sku_num: Number,
	                order_count: Number,
	                total_order_num: Number,
	                participate_user_count: Number,
	                total_user_num: Number,
	                rebate_order_count: Number,
	                rebate_order_amount_count: Number,
	                total_order_amount: Number,
	                rebate_order_amount_actual_count: Number,
	                pay_order_time: Date,
	                user_party: String,
	                category_id: String,
	                category_name: String
	            });
	            models.RebateRefund = db.define("tbl_rt_rebate_refund", {
	                id: { type: 'number', key: true },
	                //date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                spu_count: Number,
	                total_spu_num: Number,
	                sku_count: Number,
	                total_sku_num: Number,
	                refund_user_count: Number,
	                total_user_num: Number,
	                refund_goods_amount_count: Number,
	                total_amount: Number,
	                refund_goods_amount_actual_count: Number,
	                total_amount_actual: Number,
	                pay_order_time: Date,
	                user_party: String,
	                category_id: String,
	                category_name: String
	            });
	            models.RebateShopOverview = db.define("tbl_rt_rebate_shop_overview", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                order_num: Number,
	                total_order_num: Number,
	                order_amount: Number,
	                total_order_amount: Number,
	                shop_num: Number,
	                total_shop_num: Number,
	                user_num: Number,
	                total_user_num: Number,
	                product_sku_num: Number,
	                total_product_sku_num: Number,
	                rebate_order_num: Number,
	                rebate_amount_total: Number,
	                rebate_amount_actual: Number,
	                rebate_amount: Number,
	                platform_amount: Number,
	                pay_order_time: Date
	            });
	            models.RebateShopRefund = db.define("tbl_rt_rebate_shop_refund", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                spu_num: Number,
	                total_spu_num: Number,
	                sku_num: Number,
	                total_sku_num: Number,
	                user_num: Number,
	                total_user_num: Number,
	                amount: Number,
	                total_amount: Number,
	                amount_actual: Number,
	                total_amount_actual: Number,
	                pay_order_time: Date
	            });
	            models.RebateShopTredencyDetails = db.define("tbl_rt_rebate_shop_tredency_details", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                order_num: Number,
	                order_amount: Number,
	                product_sku_num: Number,
	                item_amount: Number,
	                rebate_amount: Number,
	                rebate_type: String,
	                category_name: String,
	                level: String,
	                grade: String,
	                pay_order_time: Date
	            });
	            models.RebateShopTop = db.define("tbl_rt_rebate_shop_top", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                shop_name: String,
	                shop_id: Number,
	                plan_num: Number,
	                spu_num: Number,
	                user_num: Number,
	                order_num: Number,
	                pay_order_num: Number,
	                total_order_num: Number,
	                order_amount: Number,
	                total_order_amount: Number,
	                plan_rebate_amount: Number,
	                rebate_amount: Number,
	                platform_amount: Number,
	                pay_order_time: Date
	            });
	            models.RebateShopPlanTop = db.define("tbl_rt_rebate_shop_plan_top", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                plan_name: String,
	                shop_name: String,
	                shop_id: Number,
	                deadline: String,
	                related_flow: String,
	                level: String,
	                spu_num: Number,
	                user_num: Number,
	                order_num: Number,
	                pay_order_num: Number,
	                total_order_num: Number,
	                order_amount: Number,
	                total_order_amount: Number,
	                rebate_amount: Number,
	                refund_sku_num: Number,
	                sku_num: Number,
	                pay_order_time: Date
	            });
	            models.RebateInvitepartner = db.define("tbl_rt_rebate_invitepartner", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                rebate_plan_count: Number,
	                participate_user_count: Number,
	                registered_count: Number,
	                registered_all_count: Number,
	                rebate_amount_count: Number,
	                pay_order_time: String
	            });
	            models.RebatetRedencyDetails = db.define("tbl_rt_rebate_tredency_details", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                order_count: Number,
	                order_amount_count: Number,
	                goods_sku_count: Number,
	                goods_amount_count: Number,
	                rebate_amount_count: Number,
	                user_party: String,
	                level: String,
	                grade: String,
	                correlate_flow: String,
	                rebate_type: String,
	                category_id: String,
	                category_name: String,
	                pay_order_time: Date
	            });
	            models.RebatetSheduleDetails = db.define("tbl_rt_rebate_schedule_details", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                deadline: String,
	                rebate_plan_name: String,
	                level: String,
	                participate_seller_count: Number,
	                participate_goods_count: Number,
	                participate_user_count: Number,
	                new_order_count: Number,
	                order_all_count: Number,
	                new_order_amount: Number,
	                order_all_amount: Number,
	                rebate_amount: Number,
	                user_party: String,
	                correlate_flow: String,
	                pay_order_time: Date
	            });
	            models.RebatetInviteseller = db.define("tbl_rt_rebate_inviteseller", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                rebate_plan_count: Number,
	                participate_user_count: Number,
	                registered_count: Number,
	                registered_all_count: Number,
	                rebate_amount_count: Number,
	                pay_order_time: Date
	            });
	            models.RebatetRegisterTrendency = db.define("tbl_rt_rebate_register_trendency", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                registered_count: Number,
	                rebate_amount_count: Number,
	                user_party: String,
	                pay_order_time: Date
	            });
	            models.RebatetRegisterSheduleDetails = db.define("tbl_rt_rebate_register_shedule_details", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                rebate_plan_name: String,
	                user_party: String,
	                deadline: String,
	                correlate_flow: String,
	                participate_user_count: Number,
	                registered_count: Number,
	                register_type: String,
	                rebate_amount_count: Number,
	                pay_order_time: Date
	            });
	            models.ConfCategories = db.define("tbl_rt_conf_categories", {
	                id: { type: 'number', key: true },
	                pid: Number,
	                name: String,
	                level: Number,
	                status: Number,
	                has_children: Number,
	                has_spu: Number,
	                created_at: Date,
	                updated_at: Date,
	                outer_id: String
	            });
	            models.UrlAccessWap = db.define("tbl_rt_url_access_wap", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                url: String,
	                url_type: String,
	                page_view: Number,
	                access_num: Number,
	                ip_num: Number,
	                down_browse: Number,
	                avg_stay_time: Number
	            });
	            models.UserKeep = db.define("tbl_rt_user_keep", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                keep_type: String,
	                new_user: Number,
	                keep_num: Number
	            });
	            models.KeyValue = db.define("tbl_rt_key_value", {
	                id: { type: 'number', key: true },
	                date: Date,
	                day_type: Number,
	                type: String,
	                ver: String,
	                channel: String,
	                key_type: String,
	                key_name: String,
	                key_desc: String,
	                value: Number,
	                value2: Number,
	                value3: Number
	            });
	            next();
	        }
	    }));
	};

	//exports.init = function(options) {
	//  var self = this;
	//  var baseModel = {};
	//  this.connect(options, function(err, db) {
	//    if (err) {
	//      throw err;
	//    } else {
	//      var Users = db.define("dataplatform_nodejs_users", {
	//        id:{type: 'serial', key: true},
	//        username: String,
	//        isAdmin:{type:"number",value:0},
	//        limited:  String,
	//        lastIp: String,
	//        loginInIp: String,
	//        loginInTime: Date,
	//        lastLoginInTime: Date
	//      });
	//      var NewAccount = db.define("rt_new_account",{
	//        id : {type: 'number', key: true},
	//        date : Date,
	//        new_users : Number,
	//        new_account : Number,
	//        active_users : Number,
	//        active_account : Number,
	//        start_up : Number,
	//        type : String,
	//        ver : String,
	//        channel : String,
	//        day_type : String
	//      });
	//      var Configure = db.define("rt_configure",{
	//        id : {type: 'number', key: true},
	//        name : String,
	//        type : String
	//      });
	//      var Area = db.define("rt_area",{
	//        id : {type: 'number', key: true},
	//        pv : Number,
	//        uv : Number,
	//        new_uv : Number,
	//        country : String,
	//        province : String,
	//        area : String,
	//        date : Date,
	//        channel : String
	//      });
	//      var UserCompose = db.define("rt_area",{
	//        id : {type: 'number', key: true},
	//        date : Date,
	//        num : Number,
	//        distribution : String,
	//        use : String,
	//        type : String,
	//        ver : String,
	//        channel : String,
	//        day_type : String
	//      });
	//      db.sync(function(){
	//        //var startTime = new Date('2015-10-01').getTime();
	//        //var endTime = new Date('2015-12-25').getTime();
	//        //var days = parseInt((endTime - startTime) / (24*60*60*1000));
	//        //var total_users_week = 0;
	//        //var total_account_week = 0;
	//        //var total_users_month = 0;
	//        //var total_account_month = 0;
	//        //var month = 8;
	//        //var object = {};
	//        //for(var i = 0 ; i < days; i++){
	//        //  for(var n = 0; n < 5; n++){
	//        //    object = self.getObect(i*24*60*60*1000 + startTime, 'd');
	//        //    if(object.date.getMonth() !== month){
	//        //      object.new_users = total_users_month;
	//        //      object.active_users = total_users_month;
	//        //      object.active_account = total_users_month;
	//        //      object.new_account = total_account_month;
	//        //      object.day_type = 'm';
	//        //      NewAccount.create(object, function(){});
	//        //      total_users_month = 0;
	//        //      total_account_month = 0;
	//        //      month = month + 1;
	//        //    } else {
	//        //      total_users_week = total_users_week + object.new_users;
	//        //      total_users_month = total_users_month + object.new_users;
	//        //      total_account_week = total_account_week + object.new_account;
	//        //      total_account_month = total_account_month + object.new_account;
	//        //      NewAccount.create(object, function(err, data){ console.log('success') });
	//        //    }
	//        //  }
	//        //  if(object.date.getDay() === 0){
	//        //    console.log(object.date.getDay());
	//        //    object.new_users = total_users_week;
	//        //    object.new_account = total_account_week;
	//        //    object.day_type = 'w';
	//        //    NewAccount.create(object, function(){});
	//        //    total_users_week = 0;
	//        //    total_account_week = 0;
	//        //  }
	//        //}
	//        baseModel.Users = Users;
	//        baseModel.NewAccount = NewAccount;
	//        baseModel.Configure = Configure;
	//        baseModel.Area = Area;
	//        baseModel.UserCompose = UserCompose;
	//      });
	//
	//    }
	//  });
	//  return baseModel;
	//};
	//
	//exports.connect = function(options, cb) {
	//  orm.express('mysql://' + options.username + ':' + options.pwd + '@' + options.host + '/' + options.database + '?timezone=CST', cb);
	//};

	exports.getObect = function (a, day_type) {
	    var object = {};
	    object.date = new Date(a);
	    object.new_users = Math.random() * 100;
	    object.active_account = Math.random() * 100;
	    object.active_users = Math.random() * 100;
	    object.new_account = Math.random() * 100;
	    object.start_up = Math.random() * 100;
	    object.type = this.getRandom(['ios', 'android', 'H5'], 3);
	    object.ver = this.getRandom(['1.0.0', '1.0.1', '1.0.2'], 3);
	    object.channel = this.getRandom(['百度', '小米', '91助手', '360助手', '华为应用商店', '安智'], 6);
	    object.day_type = day_type;
	    return object;
	};

	exports.getRandom = function (array, max) {
	    return array[parseInt(Math.random() * max)];
	};

	module.exports = connect;

/***/ },
/* 200 */
/***/ function(module, exports) {

	module.exports = {
		"db": "test"
	};

/***/ },
/* 201 */
/***/ function(module, exports) {

	module.exports = {
		"dev": {
			"username": "datapltfm_user",
			"pwd": "Db57AteE172E4D1168",
			"host": "10.125.31.220:3306",
			"database": "dataplatform"
		},
		"test": {
			"username": "tester",
			"pwd": "Test_usEr",
			"host": "atlas01.test.gomeplus.com:8806",
			"database": "dataplatform"
		},
		"pre": {
			"username": "gome_business",
			"pwd": "P7P2k2yf3F",
			"host": "10.125.2.9:3306",
			"database": "dataplatform"
		},
		"pro1": {
			"username": "dong",
			"pwd": "1234567",
			"host": "10.69.7.8",
			"database": "dataplatform"
		},
		"pro": {
			"username": "gome_business",
			"pwd": "DjbnHtjSYD",
			"host": "atlas01.ic.pro.gomeplus.com:8806",
			"database": "dataplatform"
		}
	};

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @author xiaojue
	 * @fileoverview view中的帮助函数
	 */
	var ejs = __webpack_require__(39);

	module.exports = function (app) {

	    app.locals.createPaginationItem = function (currentPage, pageCount, pageMax, paginationMaxCount) {
	        var fixedCurrentPage = 1,
	            offset = Math.ceil(paginationMaxCount / 2);
	        fixedCurrentPage = currentPage - offset >= 1 ? currentPage - offset : 1;
	        if (pageCount > paginationMaxCount) {
	            /*当前页处于分页的中间位置*/
	            fixedCurrentPage = currentPage >= offset + 1 ? currentPage - offset : 1;
	            /*修正startIndex，分页按钮数总是paginationMaxCount*/
	            if (pageCount - fixedCurrentPage + 1 < paginationMaxCount) {
	                fixedCurrentPage -= paginationMaxCount - pageCount + currentPage - offset - 1;
	            }
	        }
	        /*修正fixedCurrentPage出现0*/
	        fixedCurrentPage = fixedCurrentPage > 0 ? fixedCurrentPage : 1;
	        var str = ejs.render('<% for(var i = fixedCurrentPage;i <= pageCount&&i<(paginationMaxCount+fixedCurrentPage); i++){%>' + '<li data-action="J_page" <% if(i == currentPage){ %>class="active goto"<%}%> ><a href="javascript:;"><%= i %></a></li>' + '<% } %>', {
	            fixedCurrentPage: fixedCurrentPage,
	            pageCount: pageCount,
	            paginationMaxCount: paginationMaxCount,
	            currentPage: currentPage
	        });
	        return str;
	    };

	    app.locals.createNavBarByLimit = function (limits, limit, thirdMenuIndex) {
	        var limitItemArray = limits.split(","),
	            subLimitItemArray = null,
	            href = null,
	            className = null,
	            limitItem = null,
	            limitItemKey = null,
	            name = null,
	            path = null,
	            str = '',
	            i = 0,
	            parent = -1000,
	            children = -1000;
	        if (thirdMenuIndex) {
	            parent = parseInt(thirdMenuIndex.split("-")[0]);
	            children = parseInt(thirdMenuIndex.split("-")[1]);
	        }
	        limitItemArray.forEach(function (item, index) {
	            subLimitItemArray = item.split("-");
	            for (i = 0; i < limit.length; i++) {
	                limitItemKey = (0, _keys2.default)(limit[i])[0];
	                if (limit[i][limitItemKey].id === subLimitItemArray[0] - 0 && limit[i][limitItemKey].display) {
	                    limitItem = limit[i];
	                    break;
	                }
	            }
	            if (limitItem && limitItem[limitItemKey]) {
	                href = limitItem[limitItemKey].href;
	                className = limitItem[limitItemKey].className;
	                name = limitItem[limitItemKey].name;
	                path = limitItem[limitItemKey].path;

	                var isActive = function isActive(isChildren) {
	                    return limitItem[limitItemKey].id === parent ? 'active' : '';
	                };
	                var isActive = limitItem[limitItemKey].id === parent ? 'active' : '';
	                var isIn = limitItem[limitItemKey].id === parent ? 'in' : '';
	                var isExpand = limitItem[limitItemKey].id === parent ? 'true' : 'false';
	                str += '<li class="' + isActive + '"><a href="' + href + '"><i class="' + className + '"></i>' + name;
	                if (path.length > 0) {
	                    str += '<span class="fa arrow"></span></a><ul class="nav nav-second-level collapse ' + isIn + '" aria-expanded="' + isExpand + '">';
	                    path.forEach(function (v, k) {
	                        for (var i = 1; i < subLimitItemArray.length; i++) {
	                            if (k === parseInt(subLimitItemArray[i])) {
	                                if (v.display) {
	                                    str += '<li><a href="' + v.path + '" class="' + (limitItem[limitItemKey].id === parent && k === children ? 'active' : '') + '">' + v.name + '</a></li>';
	                                }
	                            }
	                        }
	                    });
	                    str += '</ul>';
	                } else {
	                    str += '</a>';
	                }
	                str += '</li>';
	            }
	        });
	        return str;
	    };
	};

/***/ },
/* 203 */
/***/ function(module, exports) {

	"use strict";

	console.log(666);

/***/ }
/******/ ]);