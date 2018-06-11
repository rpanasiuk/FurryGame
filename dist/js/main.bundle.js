/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "a6c01aac9ea6497a9a6d"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
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
/******/ 			_main: hotCurrentChildModule !== moduleId,
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
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
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
/******/ 		hotCurrentChildModule = undefined;
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
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
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
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
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
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
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
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
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
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
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
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
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
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n__webpack_require__(1);\n\nvar Furry = function Furry() {\n\t_classCallCheck(this, Furry);\n\n\tthis.x = 0;\n\tthis.y = 0;\n\tthis.direction = 'right';\n};\n\nvar Coin = function Coin() {\n\t_classCallCheck(this, Coin);\n\n\tthis.x = Math.floor(Math.random() * 10);\n\tthis.y = Math.floor(Math.random() * 10);\n};\n\nvar Game = function () {\n\tfunction Game(furryInstance, coinInstance) {\n\t\t_classCallCheck(this, Game);\n\n\t\tthis.board = document.querySelectorAll(\"#board > div\");\n\t\tthis.furry = new Furry();\n\t\tthis.coin = new Coin();\n\t\tthis.score = 0;\n\t\tthis.live = true;\n\t\tthis.idSetInterval = this.startGame();\n\t}\n\n\t_createClass(Game, [{\n\t\tkey: \"index\",\n\t\tvalue: function index(x, y) {\n\t\t\treturn x + y * 10;\n\t\t}\n\t}, {\n\t\tkey: \"showFurry\",\n\t\tvalue: function showFurry() {\n\t\t\tthis.hideVisibleFurry();\n\n\t\t\tvar pos = this.index(this.furry.x, this.furry.y);\n\n\t\t\treturn this.board[pos].classList.add('furry');\n\t\t}\n\t}, {\n\t\tkey: \"showCoin\",\n\t\tvalue: function showCoin() {\n\t\t\tvar pos = this.index(this.coin.x, this.coin.y);\n\n\t\t\treturn this.board[pos].classList.add('coin');\n\t\t}\n\t}, {\n\t\tkey: \"startGame\",\n\t\tvalue: function startGame() {\n\t\t\tvar _this = this;\n\n\t\t\tvar time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 250;\n\n\t\t\treturn setInterval(function () {\n\t\t\t\t_this.moveFurry();\n\t\t\t}, time);\n\t\t}\n\t}, {\n\t\tkey: \"moveFurry\",\n\t\tvalue: function moveFurry() {\n\n\t\t\tif (this.furry.direction === 'right') {\n\t\t\t\tthis.furry.x = this.furry.x + 1;\n\t\t\t} else if (this.furry.direction === 'left') {\n\t\t\t\tthis.furry.x = this.furry.x - 1;\n\t\t\t} else if (this.furry.direction === 'up') {\n\t\t\t\tthis.furry.y = this.furry.y + 1;\n\t\t\t} else if (this.furry.direction === 'down') {\n\t\t\t\tthis.furry.y = this.furry.y - 1;\n\t\t\t}\n\n\t\t\tthis.gameOver();\n\n\t\t\tif (this.live) {\n\t\t\t\tthis.showFurry();\n\t\t\t\tthis.checkCoinCollision();\n\t\t\t}\n\t\t}\n\t}, {\n\t\tkey: \"hideVisibleFurry\",\n\t\tvalue: function hideVisibleFurry() {\n\t\t\tvar furryClassItem = document.querySelector('.furry');\n\n\t\t\tif (furryClassItem) {\n\t\t\t\tfurryClassItem.classList.remove('furry');\n\t\t\t}\n\t\t}\n\t}, {\n\t\tkey: \"turnFurry\",\n\t\tvalue: function turnFurry(event) {\n\t\t\tswitch (event.which) {\n\t\t\t\tcase 37:\n\t\t\t\t\tthis.furry.direction = 'left';\n\t\t\t\t\tbreak;\n\t\t\t\tcase 38:\n\t\t\t\t\tthis.furry.direction = 'down';\n\t\t\t\t\tbreak;\n\t\t\t\tcase 39:\n\t\t\t\t\tthis.furry.direction = 'right';\n\t\t\t\t\tbreak;\n\t\t\t\tcase 40:\n\t\t\t\t\tthis.furry.direction = 'up';\n\t\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t}, {\n\t\tkey: \"checkCoinCollision\",\n\t\tvalue: function checkCoinCollision() {\n\t\t\tvar pos = this.index(this.coin.x, this.coin.y);\n\n\t\t\tif (pos === this.index(this.furry.x, this.furry.y)) {\n\t\t\t\tthis.board[pos].classList.remove('coin');\n\t\t\t\tthis.score++;\n\n\t\t\t\tdocument.querySelector('#score strong').innerText = this.score;\n\n\t\t\t\tthis.coin = new Coin();\n\t\t\t\tthis.showCoin();\n\t\t\t}\n\t\t}\n\t}, {\n\t\tkey: \"gameOver\",\n\t\tvalue: function gameOver() {\n\t\t\tif (this.furry.x < 0 || this.furry.y < 0 || this.furry.x > 9 || this.furry.y > 9) {\n\t\t\t\tclearInterval(this.idSetInterval);\n\n\t\t\t\tthis.live = false;\n\t\t\t\tthis.hideVisibleFurry();\n\t\t\t\talert('Game over.');\n\t\t\t}\n\t\t}\n\t}]);\n\n\treturn Game;\n}();\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n\n\tvar gameInstance = new Game();\n\n\tgameInstance.showFurry();\n\tgameInstance.showCoin();\n\n\tdocument.addEventListener('keydown', function (event) {\n\t\tgameInstance.turnFurry(event);\n\t});\n});\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvYXBwLmpzPzcxYjQiXSwibmFtZXMiOlsicmVxdWlyZSIsIkZ1cnJ5IiwieCIsInkiLCJkaXJlY3Rpb24iLCJDb2luIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiR2FtZSIsImZ1cnJ5SW5zdGFuY2UiLCJjb2luSW5zdGFuY2UiLCJib2FyZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZ1cnJ5IiwiY29pbiIsInNjb3JlIiwibGl2ZSIsImlkU2V0SW50ZXJ2YWwiLCJzdGFydEdhbWUiLCJoaWRlVmlzaWJsZUZ1cnJ5IiwicG9zIiwiaW5kZXgiLCJjbGFzc0xpc3QiLCJhZGQiLCJ0aW1lIiwic2V0SW50ZXJ2YWwiLCJtb3ZlRnVycnkiLCJnYW1lT3ZlciIsInNob3dGdXJyeSIsImNoZWNrQ29pbkNvbGxpc2lvbiIsImZ1cnJ5Q2xhc3NJdGVtIiwicXVlcnlTZWxlY3RvciIsInJlbW92ZSIsImV2ZW50Iiwid2hpY2giLCJpbm5lclRleHQiLCJzaG93Q29pbiIsImNsZWFySW50ZXJ2YWwiLCJhbGVydCIsImFkZEV2ZW50TGlzdGVuZXIiLCJnYW1lSW5zdGFuY2UiLCJ0dXJuRnVycnkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG1CQUFBQSxDQUFRLENBQVI7O0lBRU1DLEssR0FDTCxpQkFBYztBQUFBOztBQUNiLE1BQUtDLENBQUwsR0FBUyxDQUFUO0FBQ0EsTUFBS0MsQ0FBTCxHQUFTLENBQVQ7QUFDQSxNQUFLQyxTQUFMLEdBQWlCLE9BQWpCO0FBQ0EsQzs7SUFHSUMsSSxHQUNMLGdCQUFjO0FBQUE7O0FBQ2IsTUFBS0gsQ0FBTCxHQUFTSSxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0IsRUFBM0IsQ0FBVDtBQUNBLE1BQUtMLENBQUwsR0FBU0csS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCLEVBQTNCLENBQVQ7QUFDQSxDOztJQUdJQyxJO0FBQ0wsZUFBWUMsYUFBWixFQUEy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RUFGRDtBQUdBLENBVkQiLCJmaWxlIjoiMC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCIuLi9zY3NzL21haW4uc2Nzc1wiKTtcblxuY2xhc3MgRnVycnkge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLnggPSAwO1xuXHRcdHRoaXMueSA9IDA7XG5cdFx0dGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1x0XHRcblx0fVxufVxuXG5jbGFzcyBDb2luIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy54ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuXHRcdHRoaXMueSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcdFx0XG5cdH1cbn1cblxuY2xhc3MgR2FtZSB7XG5cdGNvbnN0cnVjdG9yKGZ1cnJ5SW5zdGFuY2UsIGNvaW5JbnN0YW5jZSkge1xuXHRcdHRoaXMuYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI2JvYXJkID4gZGl2XCIpO1xuXHRcdHRoaXMuZnVycnkgPSBuZXcgRnVycnkoKTtcblx0XHR0aGlzLmNvaW4gPSBuZXcgQ29pbigpO1xuXHRcdHRoaXMuc2NvcmUgPSAwO1xuXHRcdHRoaXMubGl2ZSA9IHRydWU7XG5cdFx0dGhpcy5pZFNldEludGVydmFsXHQ9IHRoaXMuc3RhcnRHYW1lKCk7XG5cdH1cblxuXHRpbmRleCh4LHkpIHtcblx0XHRyZXR1cm4geCArICh5ICogMTApO1xuXHR9XG5cblx0c2hvd0Z1cnJ5KCkge1xuXHRcdHRoaXMuaGlkZVZpc2libGVGdXJyeSgpO1xuXG5cdFx0Y29uc3QgcG9zID0gdGhpcy5pbmRleCh0aGlzLmZ1cnJ5LngsIHRoaXMuZnVycnkueSk7XG5cblx0XHRyZXR1cm4gdGhpcy5ib2FyZFtwb3NdLmNsYXNzTGlzdC5hZGQoJ2Z1cnJ5Jyk7XG5cdH1cblxuXHRzaG93Q29pbigpIHtcblx0XHRjb25zdCBwb3MgPSB0aGlzLmluZGV4KHRoaXMuY29pbi54LCB0aGlzLmNvaW4ueSk7XG5cdFx0XG5cdFx0cmV0dXJuIHRoaXMuYm9hcmRbcG9zXS5jbGFzc0xpc3QuYWRkKCdjb2luJyk7XG5cdH1cblxuXHRzdGFydEdhbWUodGltZT0yNTApIHtcblx0XHRyZXR1cm4gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tb3ZlRnVycnkoKTtcbiAgICAgICAgfSwgdGltZSk7XHRcdFxuXHR9XG5cblx0bW92ZUZ1cnJ5KCkge1xuXG5cdFx0aWYgKHRoaXMuZnVycnkuZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XG5cdFx0XHR0aGlzLmZ1cnJ5LnggPSB0aGlzLmZ1cnJ5LnggKyAxO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5mdXJyeS5kaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuXHRcdFx0dGhpcy5mdXJyeS54ID0gdGhpcy5mdXJyeS54IC0gMTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuZnVycnkuZGlyZWN0aW9uID09PSAndXAnKSB7XG5cdFx0XHR0aGlzLmZ1cnJ5LnkgPSB0aGlzLmZ1cnJ5LnkgKyAxO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5mdXJyeS5kaXJlY3Rpb24gPT09ICdkb3duJykge1xuXHRcdFx0dGhpcy5mdXJyeS55ID0gdGhpcy5mdXJyeS55IC0gMTtcblx0XHR9XG5cblx0XHR0aGlzLmdhbWVPdmVyKCk7XG5cblx0XHRpZiAodGhpcy5saXZlKSB7XG5cdFx0XHR0aGlzLnNob3dGdXJyeSgpO1xuXHRcdFx0dGhpcy5jaGVja0NvaW5Db2xsaXNpb24oKTtcdFx0XHRcblx0XHR9XG5cdH1cblxuXHRoaWRlVmlzaWJsZUZ1cnJ5KCkge1xuXHRcdGNvbnN0IGZ1cnJ5Q2xhc3NJdGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1cnJ5Jyk7XG5cblx0XHRpZiAoZnVycnlDbGFzc0l0ZW0pIHtcblx0XHRcdGZ1cnJ5Q2xhc3NJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1cnJ5Jyk7XG5cdFx0fVxuXHR9XG5cblx0dHVybkZ1cnJ5KGV2ZW50KSB7XG5cdFx0c3dpdGNoIChldmVudC53aGljaCkge1xuXHRcdFx0Y2FzZSAzNzpcblx0XHRcdFx0dGhpcy5mdXJyeS5kaXJlY3Rpb24gPSAnbGVmdCc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0dGhpcy5mdXJyeS5kaXJlY3Rpb24gPSAnZG93bic7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOTpcblx0XHRcdFx0dGhpcy5mdXJyeS5kaXJlY3Rpb24gPSAncmlnaHQnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdHRoaXMuZnVycnkuZGlyZWN0aW9uID0gJ3VwJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVx0XG5cdH1cblxuXHRjaGVja0NvaW5Db2xsaXNpb24oKSB7XG5cdFx0Y29uc3QgcG9zID0gdGhpcy5pbmRleCh0aGlzLmNvaW4ueCwgdGhpcy5jb2luLnkpO1xuXG5cdFx0aWYgKHBvcyA9PT0gdGhpcy5pbmRleCh0aGlzLmZ1cnJ5LngsIHRoaXMuZnVycnkueSkpIHtcblx0XHRcdHRoaXMuYm9hcmRbcG9zXS5jbGFzc0xpc3QucmVtb3ZlKCdjb2luJyk7XG5cdFx0XHR0aGlzLnNjb3JlKys7XG5cblx0XHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzY29yZSBzdHJvbmcnKS5pbm5lclRleHQgPSB0aGlzLnNjb3JlO1xuXG5cdFx0XHR0aGlzLmNvaW4gPSBuZXcgQ29pbigpO1xuXHRcdFx0dGhpcy5zaG93Q29pbigpO1xuXHRcdH1cblx0fVxuXG5cdGdhbWVPdmVyKCkge1xuXHRcdGlmICh0aGlzLmZ1cnJ5LnggPCAwIHx8IHRoaXMuZnVycnkueSA8IDAgfHwgdGhpcy5mdXJyeS54ID4gOSB8fCB0aGlzLmZ1cnJ5LnkgPiA5KSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuaWRTZXRJbnRlcnZhbCk7XG5cblx0XHRcdHRoaXMubGl2ZSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5oaWRlVmlzaWJsZUZ1cnJ5KCk7XG5cdFx0XHRhbGVydCgnR2FtZSBvdmVyLicpO1xuXHRcdH1cblx0fVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcblxuXHRjb25zdCBnYW1lSW5zdGFuY2UgPSBuZXcgR2FtZSgpO1xuXG5cdGdhbWVJbnN0YW5jZS5zaG93RnVycnkoKTtcblx0Z2FtZUluc3RhbmNlLnNob3dDb2luKCk7XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRnYW1lSW5zdGFuY2UudHVybkZ1cnJ5KGV2ZW50KTtcblx0fSk7XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvYXBwLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

eval("// removed by extract-text-webpack-plugin\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvc2Nzcy9tYWluLnNjc3M/MTQ2NSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zY3NzL21haW4uc2Nzc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///1\n");

/***/ })
/******/ ]);