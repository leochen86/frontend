/******/ (function(modules) { // webpackBootstrap
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
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

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

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(102);


/***/ },

/***/ 5:
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },

/***/ 102:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _layoutTree = __webpack_require__(103);

	var _layoutTree2 = _interopRequireDefault(_layoutTree);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = angular.module('directives.layoutTree', []).directive('d3LayoutTree', function () {
	  return new _layoutTree2.default();
	}).name; /**
	          * @file d3 layout tree  entry
	          * @author zhangyou04@baidu.com
	          */
	//import angular from 'angular';

/***/ },

/***/ 103:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file directed graph directive
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author zhangyou04
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	//import * as d3 from 'd3';


	__webpack_require__(104);

	__webpack_require__(106);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LayoutTreeDirective = function () {
	    function LayoutTreeDirective() {
	        _classCallCheck(this, LayoutTreeDirective);

	        this.restrict = 'AE';
	        this.replace = true;
	        this.scope = {
	            data: '=',
	            width: '=',
	            height: '=',
	            tooltip: '=getTooltip'

	        };
	        this.template = '<div class="d3-layout-tree"></div>';
	    }

	    _createClass(LayoutTreeDirective, [{
	        key: 'link',
	        value: function link(scope, element, attrs) {
	            var _this = this;

	            d3.select(element[0]).append("svg:svg");
	            scope.$watch('data', function (data) {
	                if (data) {
	                    _this.draw(data, element, scope);
	                }
	            });
	            scope.$watch('height', function (height) {
	                if (height) {
	                    _this.draw(scope.data, element, scope);
	                }
	            });
	            scope.$watch('width', function (width) {
	                console.log('watch width:', width);
	                if (width) {
	                    _this.draw(scope.data, element, scope);
	                }
	            });
	        }
	    }, {
	        key: 'draw',
	        value: function draw(data, element, scope) {
	            var m = [20, 120, 20, 120];
	            var w = (scope.width || 1280) - m[1] - m[3];
	            var h = (scope.height || 800) - m[0] - m[2];
	            var i = 0;
	            var root = data;

	            var tree = d3.layout.tree().size([h, w]);

	            var diagonal = d3.svg.diagonal().projection(function (d) {
	                return [d.y, d.x];
	            });

	            element.empty();
	            var vis = d3.select(element[0]).append('svg:svg').attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	            root = data;
	            root.x0 = h / 2;
	            root.y0 = 0;

	            function toggleAll(d) {
	                if (d.children) {
	                    d.children.forEach(toggleAll);
	                    toggle(d);
	                }
	            }

	            // Initialize the display to show a few nodes.
	            (root.children || []).forEach(toggleAll);
	            (root.children || []).forEach(function (child) {
	                toggle(child);
	            });

	            update(root);

	            function update(source) {
	                var _arguments = arguments;

	                var duration = d3.event && d3.event.altKey ? 5000 : 500;

	                // Compute the new tree layout.
	                var nodes = tree.nodes(root).reverse();

	                // Normalize for fixed-depth.
	                nodes.forEach(function (d) {
	                    d.y = d.depth * 180;
	                });

	                // Update the nodes…
	                var node = vis.selectAll("g.node").data(nodes, function (d) {
	                    return d.id || (d.id = ++i);
	                });
	                var getTooltip = function getTooltip(node) {
	                    if (scope.tooltip) {
	                        return angular.isFunction(scope.tooltip) ? scope.tooltip(node) : scope.tooltip;
	                    }
	                    return node.name;
	                };
	                var nodeRadius = 5;

	                // Enter any new nodes at the parent's previous position.
	                var nodeEnter = node.enter().append("svg:g").attr("class", "node").attr("transform", function (d) {
	                    return "translate(" + source.y0 + "," + source.x0 + ")";
	                }).on("click", function (d) {
	                    toggle(d);update(d);
	                }).on('mouseover', function (d) {
	                    console.log('hover', d);
	                    var d3Tooltip = element.find('.d3-tooltip');
	                    if (d3Tooltip.length === 0) {
	                        d3Tooltip = $('<div class="d3-tooltip">' + getTooltip(d) + '</div>');
	                        element.append(d3Tooltip);
	                        d3Tooltip.on('mouseover', function (evt) {
	                            d3Tooltip.css({ opacity: 1 });
	                        }).on('mouseout', function (evt) {
	                            d3Tooltip.css({ opacity: 0 });
	                        });
	                    } else {
	                        d3Tooltip.html(getTooltip(d));
	                    }
	                    d3Tooltip.css({
	                        left: d.y + m[3] + nodeRadius * 2,
	                        top: d.x + m[0],
	                        opacity: 1
	                    });
	                }).on('mouseout', function (d) {
	                    console.log(_arguments);
	                    element.find('.d3-tooltip').css('opacity', 0);
	                });

	                nodeEnter.append("svg:circle").attr("r", 1e-6).style("fill", function (d) {
	                    return d._children ? "lightsteelblue" : "#fff";
	                });

	                nodeEnter.append("svg:text").attr("x", function (d) {
	                    return d.children || d._children ? -10 : 10;
	                }).attr("dy", ".35em").attr("text-anchor", function (d) {
	                    return d.children || d._children ? "end" : "start";
	                }).text(function (d) {
	                    return d.name;
	                }).style("fill-opacity", 1e-6);

	                // Transition nodes to their new position.
	                var nodeUpdate = node.transition().duration(duration).attr("transform", function (d) {
	                    return "translate(" + d.y + "," + d.x + ")";
	                });

	                nodeUpdate.select("circle").attr("r", nodeRadius).style("fill", function (d) {
	                    return d._children ? "lightsteelblue" : "#fff";
	                });

	                nodeUpdate.select("text").style("fill-opacity", 1);

	                // Transition exiting nodes to the parent's new position.
	                var nodeExit = node.exit().transition().duration(duration).attr("transform", function (d) {
	                    return "translate(" + source.y + "," + source.x + ")";
	                }).remove();

	                nodeExit.select("circle").attr("r", 1e-6);

	                nodeExit.select("text").style("fill-opacity", 1e-6);

	                // Update the links…
	                var link = vis.selectAll("path.link").data(tree.links(nodes), function (d) {
	                    return d.target.id;
	                });

	                // Enter any new links at the parent's previous position.
	                link.enter().insert("svg:path", "g").attr("class", "link").attr("d", function (d) {
	                    var o = { x: source.x0, y: source.y0 };
	                    return diagonal({ source: o, target: o });
	                }).transition().duration(duration).attr("d", diagonal);

	                // Transition links to their new position.
	                link.transition().duration(duration).attr("d", diagonal);

	                // Transition exiting nodes to the parent's new position.
	                link.exit().transition().duration(duration).attr("d", function (d) {
	                    var o = { x: source.x, y: source.y };
	                    return diagonal({ source: o, target: o });
	                }).remove();

	                // Stash the old positions for transition.
	                nodes.forEach(function (d) {
	                    d.x0 = d.x;
	                    d.y0 = d.y;
	                });
	            }

	            // Toggle children.
	            function toggle(d) {
	                if (d.children) {
	                    d._children = d.children;
	                    d.children = null;
	                } else {
	                    d.children = d._children;
	                    d._children = null;
	                }
	            }
	        }
	    }]);

	    return LayoutTreeDirective;
	}();

	exports.default = LayoutTreeDirective;

/***/ },

/***/ 104:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(105);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/less-loader/index.js!./layoutTree.less", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/less-loader/index.js!./layoutTree.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 105:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".d3-layout-tree {\n  position: relative;\n}\n.d3-layout-tree .node circle {\n  cursor: pointer;\n  fill: #fff;\n  stroke: steelblue;\n  stroke-width: 1.5px;\n}\n.d3-layout-tree .node text {\n  font-size: 11px;\n}\n.d3-layout-tree path.link {\n  fill: none;\n  stroke: #ccc;\n  stroke-width: 1.5px;\n}\n.d3-layout-tree .d3-tooltip {\n  position: absolute;\n  background: rgba(0, 0, 0, 0.6);\n  padding: 5px 10px;\n  border-radius: 2px;\n  color: #ffffff;\n  transition: all .25s linear;\n  font-size: 12px;\n}\n.d3-layout-tree .d3-tooltip p {\n  text-indent: 2em;\n  margin: 0;\n}\n", ""]);

	// exports


/***/ },

/***/ 106:
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	(function () {
	    d3.layout = {};
	    // Implements hierarchical edge bundling using Holten's algorithm. For each
	    // input link, a path is computed that travels through the tree, up the parent
	    // hierarchy to the least common ancestor, and then back down to the destination
	    // node. Each path is simply an array of nodes.
	    d3.layout.bundle = function () {
	        return function (links) {
	            var paths = [],
	                i = -1,
	                n = links.length;
	            while (++i < n) {
	                paths.push(d3_layout_bundlePath(links[i]));
	            }return paths;
	        };
	    };

	    function d3_layout_bundlePath(link) {
	        var start = link.source,
	            end = link.target,
	            lca = d3_layout_bundleLeastCommonAncestor(start, end),
	            points = [start];
	        while (start !== lca) {
	            start = start.parent;
	            points.push(start);
	        }
	        var k = points.length;
	        while (end !== lca) {
	            points.splice(k, 0, end);
	            end = end.parent;
	        }
	        return points;
	    }

	    function d3_layout_bundleAncestors(node) {
	        var ancestors = [],
	            parent = node.parent;
	        while (parent != null) {
	            ancestors.push(node);
	            node = parent;
	            parent = parent.parent;
	        }
	        ancestors.push(node);
	        return ancestors;
	    }

	    function d3_layout_bundleLeastCommonAncestor(a, b) {
	        if (a === b) return a;
	        var aNodes = d3_layout_bundleAncestors(a),
	            bNodes = d3_layout_bundleAncestors(b),
	            aNode = aNodes.pop(),
	            bNode = bNodes.pop(),
	            sharedNode = null;
	        while (aNode === bNode) {
	            sharedNode = aNode;
	            aNode = aNodes.pop();
	            bNode = bNodes.pop();
	        }
	        return sharedNode;
	    }
	    d3.layout.chord = function () {
	        var chord = {},
	            chords,
	            groups,
	            matrix,
	            n,
	            padding = 0,
	            sortGroups,
	            sortSubgroups,
	            sortChords;

	        function relayout() {
	            var subgroups = {},
	                groupSums = [],
	                groupIndex = d3.range(n),
	                subgroupIndex = [],
	                k,
	                x,
	                x0,
	                i,
	                j;

	            chords = [];
	            groups = [];

	            // Compute the sum.
	            k = 0, i = -1;while (++i < n) {
	                x = 0, j = -1;while (++j < n) {
	                    x += matrix[i][j];
	                }
	                groupSums.push(x);
	                subgroupIndex.push(d3.range(n));
	                k += x;
	            }

	            // Sort groups…
	            if (sortGroups) {
	                groupIndex.sort(function (a, b) {
	                    return sortGroups(groupSums[a], groupSums[b]);
	                });
	            }

	            // Sort subgroups…
	            if (sortSubgroups) {
	                subgroupIndex.forEach(function (d, i) {
	                    d.sort(function (a, b) {
	                        return sortSubgroups(matrix[i][a], matrix[i][b]);
	                    });
	                });
	            }

	            // Convert the sum to scaling factor for [0, 2pi].
	            // TODO Allow start and end angle to be specified.
	            // TODO Allow padding to be specified as percentage?
	            k = (2 * Math.PI - padding * n) / k;

	            // Compute the start and end angle for each group and subgroup.
	            x = 0, i = -1;while (++i < n) {
	                x0 = x, j = -1;while (++j < n) {
	                    var di = groupIndex[i],
	                        dj = subgroupIndex[i][j],
	                        v = matrix[di][dj];
	                    subgroups[di + "-" + dj] = {
	                        index: di,
	                        subindex: dj,
	                        startAngle: x,
	                        endAngle: x += v * k,
	                        value: v
	                    };
	                }
	                groups.push({
	                    index: di,
	                    startAngle: x0,
	                    endAngle: x,
	                    value: (x - x0) / k
	                });
	                x += padding;
	            }

	            // Generate chords for each (non-empty) subgroup-subgroup link.
	            i = -1;while (++i < n) {
	                j = i - 1;while (++j < n) {
	                    var source = subgroups[i + "-" + j],
	                        target = subgroups[j + "-" + i];
	                    if (source.value || target.value) {
	                        chords.push(source.value < target.value ? { source: target, target: source } : { source: source, target: target });
	                    }
	                }
	            }

	            if (sortChords) resort();
	        }

	        function resort() {
	            chords.sort(function (a, b) {
	                return sortChords(a.target.value, b.target.value);
	            });
	        }

	        chord.matrix = function (x) {
	            if (!arguments.length) return matrix;
	            n = (matrix = x) && matrix.length;
	            chords = groups = null;
	            return chord;
	        };

	        chord.padding = function (x) {
	            if (!arguments.length) return padding;
	            padding = x;
	            chords = groups = null;
	            return chord;
	        };

	        chord.sortGroups = function (x) {
	            if (!arguments.length) return sortGroups;
	            sortGroups = x;
	            chords = groups = null;
	            return chord;
	        };

	        chord.sortSubgroups = function (x) {
	            if (!arguments.length) return sortSubgroups;
	            sortSubgroups = x;
	            chords = null;
	            return chord;
	        };

	        chord.sortChords = function (x) {
	            if (!arguments.length) return sortChords;
	            sortChords = x;
	            if (chords) resort();
	            return chord;
	        };

	        chord.chords = function () {
	            if (!chords) relayout();
	            return chords;
	        };

	        chord.groups = function () {
	            if (!groups) relayout();
	            return groups;
	        };

	        return chord;
	    };
	    // A rudimentary force layout using Gauss-Seidel.
	    d3.layout.force = function () {
	        var force = {},
	            event = d3.dispatch("tick"),
	            size = [1, 1],
	            drag,
	            alpha,
	            friction = .9,
	            linkDistance = d3_layout_forceLinkDistance,
	            linkStrength = d3_layout_forceLinkStrength,
	            charge = -30,
	            gravity = .1,
	            theta = .8,
	            interval,
	            nodes = [],
	            links = [],
	            distances,
	            strengths,
	            charges;

	        function repulse(node) {
	            return function (quad, x1, y1, x2, y2) {
	                if (quad.point !== node) {
	                    var dx = quad.cx - node.x,
	                        dy = quad.cy - node.y,
	                        dn = 1 / Math.sqrt(dx * dx + dy * dy);

	                    /* Barnes-Hut criterion. */
	                    if ((x2 - x1) * dn < theta) {
	                        var k = quad.charge * dn * dn;
	                        node.px -= dx * k;
	                        node.py -= dy * k;
	                        return true;
	                    }

	                    if (quad.point && isFinite(dn)) {
	                        var k = quad.pointCharge * dn * dn;
	                        node.px -= dx * k;
	                        node.py -= dy * k;
	                    }
	                }
	                return !quad.charge;
	            };
	        }

	        function tick() {
	            var n = nodes.length,
	                m = links.length,
	                q,
	                i,
	                // current index
	            o,
	                // current object
	            s,
	                // current source
	            t,
	                // current target
	            l,
	                // current distance
	            k,
	                // current force
	            x,
	                // x-distance
	            y; // y-distance

	            // gauss-seidel relaxation for links
	            for (i = 0; i < m; ++i) {
	                o = links[i];
	                s = o.source;
	                t = o.target;
	                x = t.x - s.x;
	                y = t.y - s.y;
	                if (l = x * x + y * y) {
	                    l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
	                    x *= l;
	                    y *= l;
	                    t.x -= x * (k = s.weight / (t.weight + s.weight));
	                    t.y -= y * k;
	                    s.x += x * (k = 1 - k);
	                    s.y += y * k;
	                }
	            }

	            // apply gravity forces
	            if (k = alpha * gravity) {
	                x = size[0] / 2;
	                y = size[1] / 2;
	                i = -1;if (k) while (++i < n) {
	                    o = nodes[i];
	                    o.x += (x - o.x) * k;
	                    o.y += (y - o.y) * k;
	                }
	            }

	            // compute quadtree center of mass and apply charge forces
	            if (charge) {
	                d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
	                i = -1;while (++i < n) {
	                    if (!(o = nodes[i]).fixed) {
	                        q.visit(repulse(o));
	                    }
	                }
	            }

	            // position verlet integration
	            i = -1;while (++i < n) {
	                o = nodes[i];
	                if (o.fixed) {
	                    o.x = o.px;
	                    o.y = o.py;
	                } else {
	                    o.x -= (o.px - (o.px = o.x)) * friction;
	                    o.y -= (o.py - (o.py = o.y)) * friction;
	                }
	            }

	            event.tick.dispatch({ type: "tick", alpha: alpha });

	            // simulated annealing, basically
	            return (alpha *= .99) < .005;
	        }

	        force.on = function (type, listener) {
	            event[type].add(listener);
	            return force;
	        };

	        force.nodes = function (x) {
	            if (!arguments.length) return nodes;
	            nodes = x;
	            return force;
	        };

	        force.links = function (x) {
	            if (!arguments.length) return links;
	            links = x;
	            return force;
	        };

	        force.size = function (x) {
	            if (!arguments.length) return size;
	            size = x;
	            return force;
	        };

	        force.linkDistance = function (x) {
	            if (!arguments.length) return linkDistance;
	            linkDistance = d3.functor(x);
	            return force;
	        };

	        // For backwards-compatibility.
	        force.distance = force.linkDistance;

	        force.linkStrength = function (x) {
	            if (!arguments.length) return linkStrength;
	            linkStrength = d3.functor(x);
	            return force;
	        };

	        force.friction = function (x) {
	            if (!arguments.length) return friction;
	            friction = x;
	            return force;
	        };

	        force.charge = function (x) {
	            if (!arguments.length) return charge;
	            charge = typeof x === "function" ? x : +x;
	            return force;
	        };

	        force.gravity = function (x) {
	            if (!arguments.length) return gravity;
	            gravity = x;
	            return force;
	        };

	        force.theta = function (x) {
	            if (!arguments.length) return theta;
	            theta = x;
	            return force;
	        };

	        force.start = function () {
	            var i,
	                j,
	                n = nodes.length,
	                m = links.length,
	                w = size[0],
	                h = size[1],
	                neighbors,
	                o;

	            for (i = 0; i < n; ++i) {
	                (o = nodes[i]).index = i;
	                o.weight = 0;
	            }

	            distances = [];
	            strengths = [];
	            for (i = 0; i < m; ++i) {
	                o = links[i];
	                if (typeof o.source == "number") o.source = nodes[o.source];
	                if (typeof o.target == "number") o.target = nodes[o.target];
	                distances[i] = linkDistance.call(this, o, i);
	                strengths[i] = linkStrength.call(this, o, i);
	                ++o.source.weight;
	                ++o.target.weight;
	            }

	            for (i = 0; i < n; ++i) {
	                o = nodes[i];
	                if (isNaN(o.x)) o.x = position("x", w);
	                if (isNaN(o.y)) o.y = position("y", h);
	                if (isNaN(o.px)) o.px = o.x;
	                if (isNaN(o.py)) o.py = o.y;
	            }

	            charges = [];
	            if (typeof charge === "function") {
	                for (i = 0; i < n; ++i) {
	                    charges[i] = +charge.call(this, nodes[i], i);
	                }
	            } else {
	                for (i = 0; i < n; ++i) {
	                    charges[i] = charge;
	                }
	            }

	            // initialize node position based on first neighbor
	            function position(dimension, size) {
	                var neighbors = neighbor(i),
	                    j = -1,
	                    m = neighbors.length,
	                    x;
	                while (++j < m) {
	                    if (!isNaN(x = neighbors[j][dimension])) return x;
	                }return Math.random() * size;
	            }

	            // initialize neighbors lazily
	            function neighbor() {
	                if (!neighbors) {
	                    neighbors = [];
	                    for (j = 0; j < n; ++j) {
	                        neighbors[j] = [];
	                    }
	                    for (j = 0; j < m; ++j) {
	                        var o = links[j];
	                        neighbors[o.source.index].push(o.target);
	                        neighbors[o.target.index].push(o.source);
	                    }
	                }
	                return neighbors[i];
	            }

	            return force.resume();
	        };

	        force.resume = function () {
	            alpha = .1;
	            d3.timer(tick);
	            return force;
	        };

	        force.stop = function () {
	            alpha = 0;
	            return force;
	        };

	        // use `node.call(force.drag)` to make nodes draggable
	        force.drag = function () {
	            if (!drag) drag = d3.behavior.drag().on("dragstart", dragstart).on("drag", d3_layout_forceDrag).on("dragend", d3_layout_forceDragEnd);

	            this.on("mouseover.force", d3_layout_forceDragOver).on("mouseout.force", d3_layout_forceDragOut).call(drag);
	        };

	        function dragstart(d) {
	            d3_layout_forceDragOver(d3_layout_forceDragNode = d);
	            d3_layout_forceDragForce = force;
	        }

	        return force;
	    };

	    var d3_layout_forceDragForce, d3_layout_forceDragNode;

	    function d3_layout_forceDragOver(d) {
	        d.fixed |= 2;
	    }

	    function d3_layout_forceDragOut(d) {
	        if (d !== d3_layout_forceDragNode) d.fixed &= 1;
	    }

	    function d3_layout_forceDragEnd() {
	        d3_layout_forceDrag();
	        d3_layout_forceDragNode.fixed &= 1;
	        d3_layout_forceDragForce = d3_layout_forceDragNode = null;
	    }

	    function d3_layout_forceDrag() {
	        d3_layout_forceDragNode.px += d3.event.dx;
	        d3_layout_forceDragNode.py += d3.event.dy;
	        d3_layout_forceDragForce.resume(); // restart annealing
	    }

	    function d3_layout_forceAccumulate(quad, alpha, charges) {
	        var cx = 0,
	            cy = 0;
	        quad.charge = 0;
	        if (!quad.leaf) {
	            var nodes = quad.nodes,
	                n = nodes.length,
	                i = -1,
	                c;
	            while (++i < n) {
	                c = nodes[i];
	                if (c == null) continue;
	                d3_layout_forceAccumulate(c, alpha, charges);
	                quad.charge += c.charge;
	                cx += c.charge * c.cx;
	                cy += c.charge * c.cy;
	            }
	        }
	        if (quad.point) {
	            // jitter internal nodes that are coincident
	            if (!quad.leaf) {
	                quad.point.x += Math.random() - .5;
	                quad.point.y += Math.random() - .5;
	            }
	            var k = alpha * charges[quad.point.index];
	            quad.charge += quad.pointCharge = k;
	            cx += k * quad.point.x;
	            cy += k * quad.point.y;
	        }
	        quad.cx = cx / quad.charge;
	        quad.cy = cy / quad.charge;
	    }

	    function d3_layout_forceLinkDistance(link) {
	        return 20;
	    }

	    function d3_layout_forceLinkStrength(link) {
	        return 1;
	    }
	    d3.layout.partition = function () {
	        var hierarchy = d3.layout.hierarchy(),
	            size = [1, 1]; // width, height

	        function position(node, x, dx, dy) {
	            var children = node.children;
	            node.x = x;
	            node.y = node.depth * dy;
	            node.dx = dx;
	            node.dy = dy;
	            if (children && (n = children.length)) {
	                var i = -1,
	                    n,
	                    c,
	                    d;
	                dx = node.value ? dx / node.value : 0;
	                while (++i < n) {
	                    position(c = children[i], x, d = c.value * dx, dy);
	                    x += d;
	                }
	            }
	        }

	        function depth(node) {
	            var children = node.children,
	                d = 0;
	            if (children && (n = children.length)) {
	                var i = -1,
	                    n;
	                while (++i < n) {
	                    d = Math.max(d, depth(children[i]));
	                }
	            }
	            return 1 + d;
	        }

	        function partition(d, i) {
	            var nodes = hierarchy.call(this, d, i);
	            position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
	            return nodes;
	        }

	        partition.size = function (x) {
	            if (!arguments.length) return size;
	            size = x;
	            return partition;
	        };

	        return d3_layout_hierarchyRebind(partition, hierarchy);
	    };
	    d3.layout.pie = function () {
	        var value = Number,
	            sort = null,
	            startAngle = 0,
	            endAngle = 2 * Math.PI;

	        function pie(data, i) {

	            // Compute the start angle.
	            var a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle);

	            // Compute the angular range (end - start).
	            var k = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - startAngle;

	            // Optionally sort the data.
	            var index = d3.range(data.length);
	            if (sort != null) index.sort(function (i, j) {
	                return sort(data[i], data[j]);
	            });

	            // Compute the numeric values for each data element.
	            var values = data.map(value);

	            // Convert k into a scale factor from value to angle, using the sum.
	            k /= values.reduce(function (p, d) {
	                return p + d;
	            }, 0);

	            // Compute the arcs!
	            var arcs = index.map(function (i) {
	                return {
	                    data: data[i],
	                    value: d = values[i],
	                    startAngle: a,
	                    endAngle: a += d * k
	                };
	            });

	            // Return the arcs in the original data's order.
	            return data.map(function (d, i) {
	                return arcs[index[i]];
	            });
	        }

	        /**
	         * Specifies the value function *x*, which returns a nonnegative numeric value
	         * for each datum. The default value function is `Number`. The value function
	         * is passed two arguments: the current datum and the current index.
	         */
	        pie.value = function (x) {
	            if (!arguments.length) return value;
	            value = x;
	            return pie;
	        };

	        /**
	         * Specifies a sort comparison operator *x*. The comparator is passed two data
	         * elements from the data array, a and b; it returns a negative value if a is
	         * less than b, a positive value if a is greater than b, and zero if a equals
	         * b.
	         */
	        pie.sort = function (x) {
	            if (!arguments.length) return sort;
	            sort = x;
	            return pie;
	        };

	        /**
	         * Specifies the overall start angle of the pie chart. Defaults to 0. The
	         * start angle can be specified either as a constant or as a function; in the
	         * case of a function, it is evaluated once per array (as opposed to per
	         * element).
	         */
	        pie.startAngle = function (x) {
	            if (!arguments.length) return startAngle;
	            startAngle = x;
	            return pie;
	        };

	        /**
	         * Specifies the overall end angle of the pie chart. Defaults to 2π. The
	         * end angle can be specified either as a constant or as a function; in the
	         * case of a function, it is evaluated once per array (as opposed to per
	         * element).
	         */
	        pie.endAngle = function (x) {
	            if (!arguments.length) return endAngle;
	            endAngle = x;
	            return pie;
	        };

	        return pie;
	    };
	    // data is two-dimensional array of x,y; we populate y0
	    d3.layout.stack = function () {
	        var values = Object,
	            order = d3_layout_stackOrders["default"],
	            offset = d3_layout_stackOffsets["zero"],
	            out = d3_layout_stackOut,
	            x = d3_layout_stackX,
	            y = d3_layout_stackY;

	        function stack(data, index) {

	            // Convert series to canonical two-dimensional representation.
	            var series = data.map(function (d, i) {
	                return values.call(stack, d, i);
	            });

	            // Convert each series to canonical [[x,y]] representation.
	            var points = series.map(function (d, i) {
	                return d.map(function (v, i) {
	                    return [x.call(stack, v, i), y.call(stack, v, i)];
	                });
	            });

	            // Compute the order of series, and permute them.
	            var orders = order.call(stack, points, index);
	            series = d3.permute(series, orders);
	            points = d3.permute(points, orders);

	            // Compute the baseline…
	            var offsets = offset.call(stack, points, index);

	            // And propagate it to other series.
	            var n = series.length,
	                m = series[0].length,
	                i,
	                j,
	                o;
	            for (j = 0; j < m; ++j) {
	                out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
	                for (i = 1; i < n; ++i) {
	                    out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
	                }
	            }

	            return data;
	        }

	        stack.values = function (x) {
	            if (!arguments.length) return values;
	            values = x;
	            return stack;
	        };

	        stack.order = function (x) {
	            if (!arguments.length) return order;
	            order = typeof x === "function" ? x : d3_layout_stackOrders[x];
	            return stack;
	        };

	        stack.offset = function (x) {
	            if (!arguments.length) return offset;
	            offset = typeof x === "function" ? x : d3_layout_stackOffsets[x];
	            return stack;
	        };

	        stack.x = function (z) {
	            if (!arguments.length) return x;
	            x = z;
	            return stack;
	        };

	        stack.y = function (z) {
	            if (!arguments.length) return y;
	            y = z;
	            return stack;
	        };

	        stack.out = function (z) {
	            if (!arguments.length) return out;
	            out = z;
	            return stack;
	        };

	        return stack;
	    };

	    function d3_layout_stackX(d) {
	        return d.x;
	    }

	    function d3_layout_stackY(d) {
	        return d.y;
	    }

	    function d3_layout_stackOut(d, y0, y) {
	        d.y0 = y0;
	        d.y = y;
	    }

	    var d3_layout_stackOrders = {

	        "inside-out": function insideOut(data) {
	            var n = data.length,
	                i,
	                j,
	                max = data.map(d3_layout_stackMaxIndex),
	                sums = data.map(d3_layout_stackReduceSum),
	                index = d3.range(n).sort(function (a, b) {
	                return max[a] - max[b];
	            }),
	                top = 0,
	                bottom = 0,
	                tops = [],
	                bottoms = [];
	            for (i = 0; i < n; ++i) {
	                j = index[i];
	                if (top < bottom) {
	                    top += sums[j];
	                    tops.push(j);
	                } else {
	                    bottom += sums[j];
	                    bottoms.push(j);
	                }
	            }
	            return bottoms.reverse().concat(tops);
	        },

	        "reverse": function reverse(data) {
	            return d3.range(data.length).reverse();
	        },

	        "default": function _default(data) {
	            return d3.range(data.length);
	        }

	    };

	    var d3_layout_stackOffsets = {

	        "silhouette": function silhouette(data) {
	            var n = data.length,
	                m = data[0].length,
	                sums = [],
	                max = 0,
	                i,
	                j,
	                o,
	                y0 = [];
	            for (j = 0; j < m; ++j) {
	                for (i = 0, o = 0; i < n; i++) {
	                    o += data[i][j][1];
	                }if (o > max) max = o;
	                sums.push(o);
	            }
	            for (j = 0; j < m; ++j) {
	                y0[j] = (max - sums[j]) / 2;
	            }
	            return y0;
	        },

	        "wiggle": function wiggle(data) {
	            var n = data.length,
	                x = data[0],
	                m = x.length,
	                max = 0,
	                i,
	                j,
	                k,
	                s1,
	                s2,
	                s3,
	                dx,
	                o,
	                o0,
	                y0 = [];
	            y0[0] = o = o0 = 0;
	            for (j = 1; j < m; ++j) {
	                for (i = 0, s1 = 0; i < n; ++i) {
	                    s1 += data[i][j][1];
	                }for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
	                    for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
	                        s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
	                    }
	                    s2 += s3 * data[i][j][1];
	                }
	                y0[j] = o -= s1 ? s2 / s1 * dx : 0;
	                if (o < o0) o0 = o;
	            }
	            for (j = 0; j < m; ++j) {
	                y0[j] -= o0;
	            }return y0;
	        },

	        "expand": function expand(data) {
	            var n = data.length,
	                m = data[0].length,
	                k = 1 / n,
	                i,
	                j,
	                o,
	                y0 = [];
	            for (j = 0; j < m; ++j) {
	                for (i = 0, o = 0; i < n; i++) {
	                    o += data[i][j][1];
	                }if (o) for (i = 0; i < n; i++) {
	                    data[i][j][1] /= o;
	                } else for (i = 0; i < n; i++) {
	                    data[i][j][1] = k;
	                }
	            }
	            for (j = 0; j < m; ++j) {
	                y0[j] = 0;
	            }return y0;
	        },

	        "zero": function zero(data) {
	            var j = -1,
	                m = data[0].length,
	                y0 = [];
	            while (++j < m) {
	                y0[j] = 0;
	            }return y0;
	        }

	    };

	    function d3_layout_stackMaxIndex(array) {
	        var i = 1,
	            j = 0,
	            v = array[0][1],
	            k,
	            n = array.length;
	        for (; i < n; ++i) {
	            if ((k = array[i][1]) > v) {
	                j = i;
	                v = k;
	            }
	        }
	        return j;
	    }

	    function d3_layout_stackReduceSum(d) {
	        return d.reduce(d3_layout_stackSum, 0);
	    }

	    function d3_layout_stackSum(p, d) {
	        return p + d[1];
	    }
	    d3.layout.histogram = function () {
	        var frequency = true,
	            valuer = Number,
	            ranger = d3_layout_histogramRange,
	            binner = d3_layout_histogramBinSturges;

	        function histogram(data, i) {
	            var bins = [],
	                values = data.map(valuer, this),
	                range = ranger.call(this, values, i),
	                thresholds = binner.call(this, range, values, i),
	                bin,
	                i = -1,
	                n = values.length,
	                m = thresholds.length - 1,
	                k = frequency ? 1 : 1 / n,
	                x;

	            // Initialize the bins.
	            while (++i < m) {
	                bin = bins[i] = [];
	                bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
	                bin.y = 0;
	            }

	            // Fill the bins, ignoring values outside the range.
	            i = -1;while (++i < n) {
	                x = values[i];
	                if (x >= range[0] && x <= range[1]) {
	                    bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
	                    bin.y += k;
	                    bin.push(data[i]);
	                }
	            }

	            return bins;
	        }

	        // Specifies how to extract a value from the associated data. The default
	        // value function is `Number`, which is equivalent to the identity function.
	        histogram.value = function (x) {
	            if (!arguments.length) return valuer;
	            valuer = x;
	            return histogram;
	        };

	        // Specifies the range of the histogram. Values outside the specified range
	        // will be ignored. The argument `x` may be specified either as a two-element
	        // array representing the minimum and maximum value of the range, or as a
	        // function that returns the range given the array of values and the current
	        // index `i`. The default range is the extent (minimum and maximum) of the
	        // values.
	        histogram.range = function (x) {
	            if (!arguments.length) return ranger;
	            ranger = d3.functor(x);
	            return histogram;
	        };

	        // Specifies how to bin values in the histogram. The argument `x` may be
	        // specified as a number, in which case the range of values will be split
	        // uniformly into the given number of bins. Or, `x` may be an array of
	        // threshold values, defining the bins; the specified array must contain the
	        // rightmost (upper) value, thus specifying n + 1 values for n bins. Or, `x`
	        // may be a function which is evaluated, being passed the range, the array of
	        // values, and the current index `i`, returning an array of thresholds. The
	        // default bin function will divide the values into uniform bins using
	        // Sturges' formula.
	        histogram.bins = function (x) {
	            if (!arguments.length) return binner;
	            binner = typeof x === "number" ? function (range) {
	                return d3_layout_histogramBinFixed(range, x);
	            } : d3.functor(x);
	            return histogram;
	        };

	        // Specifies whether the histogram's `y` value is a count (frequency) or a
	        // probability (density). The default value is true.
	        histogram.frequency = function (x) {
	            if (!arguments.length) return frequency;
	            frequency = !!x;
	            return histogram;
	        };

	        return histogram;
	    };

	    function d3_layout_histogramBinSturges(range, values) {
	        return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
	    }

	    function d3_layout_histogramBinFixed(range, n) {
	        var x = -1,
	            b = +range[0],
	            m = (range[1] - b) / n,
	            f = [];
	        while (++x <= n) {
	            f[x] = m * x + b;
	        }return f;
	    }

	    function d3_layout_histogramRange(values) {
	        return [d3.min(values), d3.max(values)];
	    }
	    d3.layout.hierarchy = function () {
	        var sort = d3_layout_hierarchySort,
	            children = d3_layout_hierarchyChildren,
	            value = d3_layout_hierarchyValue;

	        // Recursively compute the node depth and value.
	        // Also converts the data representation into a standard hierarchy structure.
	        function recurse(data, depth, nodes) {
	            var childs = children.call(hierarchy, data, depth),
	                node = d3_layout_hierarchyInline ? data : { data: data },
	                d;
	            node.depth = depth;
	            nodes.push(node);
	            if (childs && (n = childs.length)) {
	                var i = -1,
	                    n,
	                    c = node.children = [],
	                    v = 0,
	                    j = depth + 1;
	                while (++i < n) {
	                    d = recurse(childs[i], j, nodes);
	                    d.parent = node;
	                    c.push(d);
	                    v += d.value;
	                }
	                if (sort) c.sort(sort);
	                if (value) node.value = v;
	            } else if (value) {
	                node.value = +value.call(hierarchy, data, depth) || 0;
	            }
	            return node;
	        }

	        // Recursively re-evaluates the node value.
	        function revalue(node, depth) {
	            var children = node.children,
	                v = 0;
	            if (children && (n = children.length)) {
	                var i = -1,
	                    n,
	                    j = depth + 1;
	                while (++i < n) {
	                    v += revalue(children[i], j);
	                }
	            } else if (value) {
	                v = +value.call(hierarchy, d3_layout_hierarchyInline ? node : node.data, depth) || 0;
	            }
	            if (value) node.value = v;
	            return v;
	        }

	        function hierarchy(d) {
	            var nodes = [];
	            recurse(d, 0, nodes);
	            return nodes;
	        }

	        hierarchy.sort = function (x) {
	            if (!arguments.length) return sort;
	            sort = x;
	            return hierarchy;
	        };

	        hierarchy.children = function (x) {
	            if (!arguments.length) return children;
	            children = x;
	            return hierarchy;
	        };

	        hierarchy.value = function (x) {
	            if (!arguments.length) return value;
	            value = x;
	            return hierarchy;
	        };

	        // Re-evaluates the `value` property for the specified hierarchy.
	        hierarchy.revalue = function (root) {
	            revalue(root, 0);
	            return root;
	        };

	        return hierarchy;
	    };

	    // A method assignment helper for hierarchy subclasses.
	    function d3_layout_hierarchyRebind(object, hierarchy) {
	        object.sort = d3.rebind(object, hierarchy.sort);
	        object.children = d3.rebind(object, hierarchy.children);
	        object.links = d3_layout_hierarchyLinks;
	        object.value = d3.rebind(object, hierarchy.value);

	        // If the new API is used, enabling inlining.
	        object.nodes = function (d) {
	            d3_layout_hierarchyInline = true;
	            return (object.nodes = object)(d);
	        };

	        return object;
	    }

	    function d3_layout_hierarchyChildren(d) {
	        return d.children;
	    }

	    function d3_layout_hierarchyValue(d) {
	        return d.value;
	    }

	    function d3_layout_hierarchySort(a, b) {
	        return b.value - a.value;
	    }

	    // Returns an array source+target objects for the specified nodes.
	    function d3_layout_hierarchyLinks(nodes) {
	        return d3.merge(nodes.map(function (parent) {
	            return (parent.children || []).map(function (child) {
	                return { source: parent, target: child };
	            });
	        }));
	    }

	    // For backwards-compatibility, don't enable inlining by default.
	    var d3_layout_hierarchyInline = false;
	    d3.layout.pack = function () {
	        var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort),
	            size = [1, 1];

	        function pack(d, i) {
	            var nodes = hierarchy.call(this, d, i),
	                root = nodes[0];

	            // Recursively compute the layout.
	            root.x = 0;
	            root.y = 0;
	            d3_layout_packTree(root);

	            // Scale the layout to fit the requested size.
	            var w = size[0],
	                h = size[1],
	                k = 1 / Math.max(2 * root.r / w, 2 * root.r / h);
	            d3_layout_packTransform(root, w / 2, h / 2, k);

	            return nodes;
	        }

	        pack.size = function (x) {
	            if (!arguments.length) return size;
	            size = x;
	            return pack;
	        };

	        return d3_layout_hierarchyRebind(pack, hierarchy);
	    };

	    function d3_layout_packSort(a, b) {
	        return a.value - b.value;
	    }

	    function d3_layout_packInsert(a, b) {
	        var c = a._pack_next;
	        a._pack_next = b;
	        b._pack_prev = a;
	        b._pack_next = c;
	        c._pack_prev = b;
	    }

	    function d3_layout_packSplice(a, b) {
	        a._pack_next = b;
	        b._pack_prev = a;
	    }

	    function d3_layout_packIntersects(a, b) {
	        var dx = b.x - a.x,
	            dy = b.y - a.y,
	            dr = a.r + b.r;
	        return dr * dr - dx * dx - dy * dy > .001; // within epsilon
	    }

	    function d3_layout_packCircle(nodes) {
	        var xMin = Infinity,
	            xMax = -Infinity,
	            yMin = Infinity,
	            yMax = -Infinity,
	            n = nodes.length,
	            a,
	            b,
	            c,
	            j,
	            k;

	        function bound(node) {
	            xMin = Math.min(node.x - node.r, xMin);
	            xMax = Math.max(node.x + node.r, xMax);
	            yMin = Math.min(node.y - node.r, yMin);
	            yMax = Math.max(node.y + node.r, yMax);
	        }

	        // Create node links.
	        nodes.forEach(d3_layout_packLink);

	        // Create first node.
	        a = nodes[0];
	        a.x = -a.r;
	        a.y = 0;
	        bound(a);

	        // Create second node.
	        if (n > 1) {
	            b = nodes[1];
	            b.x = b.r;
	            b.y = 0;
	            bound(b);

	            // Create third node and build chain.
	            if (n > 2) {
	                c = nodes[2];
	                d3_layout_packPlace(a, b, c);
	                bound(c);
	                d3_layout_packInsert(a, c);
	                a._pack_prev = c;
	                d3_layout_packInsert(c, b);
	                b = a._pack_next;

	                // Now iterate through the rest.
	                for (var i = 3; i < n; i++) {
	                    d3_layout_packPlace(a, b, c = nodes[i]);

	                    // Search for the closest intersection.
	                    var isect = 0,
	                        s1 = 1,
	                        s2 = 1;
	                    for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
	                        if (d3_layout_packIntersects(j, c)) {
	                            isect = 1;
	                            break;
	                        }
	                    }
	                    if (isect == 1) {
	                        for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
	                            if (d3_layout_packIntersects(k, c)) {
	                                if (s2 < s1) {
	                                    isect = -1;
	                                    j = k;
	                                }
	                                break;
	                            }
	                        }
	                    }

	                    // Update node chain.
	                    if (isect == 0) {
	                        d3_layout_packInsert(a, c);
	                        b = c;
	                        bound(c);
	                    } else if (isect > 0) {
	                        d3_layout_packSplice(a, j);
	                        b = j;
	                        i--;
	                    } else {
	                        // isect < 0
	                        d3_layout_packSplice(j, b);
	                        a = j;
	                        i--;
	                    }
	                }
	            }
	        }

	        // Re-center the circles and return the encompassing radius.
	        var cx = (xMin + xMax) / 2,
	            cy = (yMin + yMax) / 2,
	            cr = 0;
	        for (var i = 0; i < n; i++) {
	            var node = nodes[i];
	            node.x -= cx;
	            node.y -= cy;
	            cr = Math.max(cr, node.r + Math.sqrt(node.x * node.x + node.y * node.y));
	        }

	        // Remove node links.
	        nodes.forEach(d3_layout_packUnlink);

	        return cr;
	    }

	    function d3_layout_packLink(node) {
	        node._pack_next = node._pack_prev = node;
	    }

	    function d3_layout_packUnlink(node) {
	        delete node._pack_next;
	        delete node._pack_prev;
	    }

	    function d3_layout_packTree(node) {
	        var children = node.children;
	        if (children && children.length) {
	            children.forEach(d3_layout_packTree);
	            node.r = d3_layout_packCircle(children);
	        } else {
	            node.r = Math.sqrt(node.value);
	        }
	    }

	    function d3_layout_packTransform(node, x, y, k) {
	        var children = node.children;
	        node.x = x += k * node.x;
	        node.y = y += k * node.y;
	        node.r *= k;
	        if (children) {
	            var i = -1,
	                n = children.length;
	            while (++i < n) {
	                d3_layout_packTransform(children[i], x, y, k);
	            }
	        }
	    }

	    function d3_layout_packPlace(a, b, c) {
	        var db = a.r + c.r,
	            dx = b.x - a.x,
	            dy = b.y - a.y;
	        if (db && (dx || dy)) {
	            var da = b.r + c.r,
	                dc = Math.sqrt(dx * dx + dy * dy),
	                cos = Math.max(-1, Math.min(1, (db * db + dc * dc - da * da) / (2 * db * dc))),
	                theta = Math.acos(cos),
	                x = cos * (db /= dc),
	                y = Math.sin(theta) * db;
	            c.x = a.x + x * dx + y * dy;
	            c.y = a.y + x * dy - y * dx;
	        } else {
	            c.x = a.x + db;
	            c.y = a.y;
	        }
	    }
	    // Implements a hierarchical layout using the cluster (or dendogram) algorithm.
	    d3.layout.cluster = function () {
	        var hierarchy = d3.layout.hierarchy().sort(null).value(null),
	            separation = d3_layout_treeSeparation,
	            size = [1, 1]; // width, height

	        function cluster(d, i) {
	            var nodes = hierarchy.call(this, d, i),
	                root = nodes[0],
	                previousNode,
	                x = 0,
	                kx,
	                ky;

	            // First walk, computing the initial x & y values.
	            d3_layout_treeVisitAfter(root, function (node) {
	                var children = node.children;
	                if (children && children.length) {
	                    node.x = d3_layout_clusterX(children);
	                    node.y = d3_layout_clusterY(children);
	                } else {
	                    node.x = previousNode ? x += separation(node, previousNode) : 0;
	                    node.y = 0;
	                    previousNode = node;
	                }
	            });

	            // Compute the left-most, right-most, and depth-most nodes for extents.
	            var left = d3_layout_clusterLeft(root),
	                right = d3_layout_clusterRight(root),
	                x0 = left.x - separation(left, right) / 2,
	                x1 = right.x + separation(right, left) / 2;

	            // Second walk, normalizing x & y to the desired size.
	            d3_layout_treeVisitAfter(root, function (node) {
	                node.x = (node.x - x0) / (x1 - x0) * size[0];
	                node.y = (1 - node.y / root.y) * size[1];
	            });

	            return nodes;
	        }

	        cluster.separation = function (x) {
	            if (!arguments.length) return separation;
	            separation = x;
	            return cluster;
	        };

	        cluster.size = function (x) {
	            if (!arguments.length) return size;
	            size = x;
	            return cluster;
	        };

	        return d3_layout_hierarchyRebind(cluster, hierarchy);
	    };

	    function d3_layout_clusterY(children) {
	        return 1 + d3.max(children, function (child) {
	            return child.y;
	        });
	    }

	    function d3_layout_clusterX(children) {
	        return children.reduce(function (x, child) {
	            return x + child.x;
	        }, 0) / children.length;
	    }

	    function d3_layout_clusterLeft(node) {
	        var children = node.children;
	        return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
	    }

	    function d3_layout_clusterRight(node) {
	        var children = node.children,
	            n;
	        return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
	    }
	    // Node-link tree diagram using the Reingold-Tilford "tidy" algorithm
	    d3.layout.tree = function () {
	        var hierarchy = d3.layout.hierarchy().sort(null).value(null),
	            separation = d3_layout_treeSeparation,
	            size = [1, 1]; // width, height

	        function tree(d, i) {
	            var nodes = hierarchy.call(this, d, i),
	                root = nodes[0];

	            function firstWalk(node, previousSibling) {
	                var children = node.children,
	                    layout = node._tree;
	                if (children && (n = children.length)) {
	                    var n,
	                        firstChild = children[0],
	                        previousChild,
	                        ancestor = firstChild,
	                        child,
	                        i = -1;
	                    while (++i < n) {
	                        child = children[i];
	                        firstWalk(child, previousChild);
	                        ancestor = apportion(child, previousChild, ancestor);
	                        previousChild = child;
	                    }
	                    d3_layout_treeShift(node);
	                    var midpoint = .5 * (firstChild._tree.prelim + child._tree.prelim);
	                    if (previousSibling) {
	                        layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);
	                        layout.mod = layout.prelim - midpoint;
	                    } else {
	                        layout.prelim = midpoint;
	                    }
	                } else {
	                    if (previousSibling) {
	                        layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);
	                    }
	                }
	            }

	            function secondWalk(node, x) {
	                node.x = node._tree.prelim + x;
	                var children = node.children;
	                if (children && (n = children.length)) {
	                    var i = -1,
	                        n;
	                    x += node._tree.mod;
	                    while (++i < n) {
	                        secondWalk(children[i], x);
	                    }
	                }
	            }

	            function apportion(node, previousSibling, ancestor) {
	                if (previousSibling) {
	                    var vip = node,
	                        vop = node,
	                        vim = previousSibling,
	                        vom = node.parent.children[0],
	                        sip = vip._tree.mod,
	                        sop = vop._tree.mod,
	                        sim = vim._tree.mod,
	                        som = vom._tree.mod,
	                        shift;
	                    while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
	                        vom = d3_layout_treeLeft(vom);
	                        vop = d3_layout_treeRight(vop);
	                        vop._tree.ancestor = node;
	                        shift = vim._tree.prelim + sim - vip._tree.prelim - sip + separation(vim, vip);
	                        if (shift > 0) {
	                            d3_layout_treeMove(d3_layout_treeAncestor(vim, node, ancestor), node, shift);
	                            sip += shift;
	                            sop += shift;
	                        }
	                        sim += vim._tree.mod;
	                        sip += vip._tree.mod;
	                        som += vom._tree.mod;
	                        sop += vop._tree.mod;
	                    }
	                    if (vim && !d3_layout_treeRight(vop)) {
	                        vop._tree.thread = vim;
	                        vop._tree.mod += sim - sop;
	                    }
	                    if (vip && !d3_layout_treeLeft(vom)) {
	                        vom._tree.thread = vip;
	                        vom._tree.mod += sip - som;
	                        ancestor = node;
	                    }
	                }
	                return ancestor;
	            }

	            // Initialize temporary layout variables.
	            d3_layout_treeVisitAfter(root, function (node, previousSibling) {
	                node._tree = {
	                    ancestor: node,
	                    prelim: 0,
	                    mod: 0,
	                    change: 0,
	                    shift: 0,
	                    number: previousSibling ? previousSibling._tree.number + 1 : 0
	                };
	            });

	            // Compute the layout using Buchheim et al.'s algorithm.
	            firstWalk(root);
	            secondWalk(root, -root._tree.prelim);

	            // Compute the left-most, right-most, and depth-most nodes for extents.
	            var left = d3_layout_treeSearch(root, d3_layout_treeLeftmost),
	                right = d3_layout_treeSearch(root, d3_layout_treeRightmost),
	                deep = d3_layout_treeSearch(root, d3_layout_treeDeepest),
	                x0 = left.x - separation(left, right) / 2,
	                x1 = right.x + separation(right, left) / 2,
	                y1 = deep.depth || 1;

	            // Clear temporary layout variables; transform x and y.
	            d3_layout_treeVisitAfter(root, function (node) {
	                node.x = (node.x - x0) / (x1 - x0) * size[0];
	                node.y = node.depth / y1 * size[1];
	                delete node._tree;
	            });

	            return nodes;
	        }

	        tree.separation = function (x) {
	            if (!arguments.length) return separation;
	            separation = x;
	            return tree;
	        };

	        tree.size = function (x) {
	            if (!arguments.length) return size;
	            size = x;
	            return tree;
	        };

	        return d3_layout_hierarchyRebind(tree, hierarchy);
	    };

	    function d3_layout_treeSeparation(a, b) {
	        return a.parent == b.parent ? 1 : 2;
	    }

	    // function d3_layout_treeSeparationRadial(a, b) {
	    //   return (a.parent == b.parent ? 1 : 2) / a.depth;
	    // }

	    function d3_layout_treeLeft(node) {
	        var children = node.children;
	        return children && children.length ? children[0] : node._tree.thread;
	    }

	    function d3_layout_treeRight(node) {
	        var children = node.children,
	            n;
	        return children && (n = children.length) ? children[n - 1] : node._tree.thread;
	    }

	    function d3_layout_treeSearch(node, compare) {
	        var children = node.children;
	        if (children && (n = children.length)) {
	            var child,
	                n,
	                i = -1;
	            while (++i < n) {
	                if (compare(child = d3_layout_treeSearch(children[i], compare), node) > 0) {
	                    node = child;
	                }
	            }
	        }
	        return node;
	    }

	    function d3_layout_treeRightmost(a, b) {
	        return a.x - b.x;
	    }

	    function d3_layout_treeLeftmost(a, b) {
	        return b.x - a.x;
	    }

	    function d3_layout_treeDeepest(a, b) {
	        return a.depth - b.depth;
	    }

	    function d3_layout_treeVisitAfter(node, callback) {
	        function visit(node, previousSibling) {
	            var children = node.children;
	            if (children && (n = children.length)) {
	                var child,
	                    previousChild = null,
	                    i = -1,
	                    n;
	                while (++i < n) {
	                    child = children[i];
	                    visit(child, previousChild);
	                    previousChild = child;
	                }
	            }
	            callback(node, previousSibling);
	        }
	        visit(node, null);
	    }

	    function d3_layout_treeShift(node) {
	        var shift = 0,
	            change = 0,
	            children = node.children,
	            i = children.length,
	            child;
	        while (--i >= 0) {
	            child = children[i]._tree;
	            child.prelim += shift;
	            child.mod += shift;
	            shift += child.shift + (change += child.change);
	        }
	    }

	    function d3_layout_treeMove(ancestor, node, shift) {
	        ancestor = ancestor._tree;
	        node = node._tree;
	        var change = shift / (node.number - ancestor.number);
	        ancestor.change += change;
	        node.change -= change;
	        node.shift += shift;
	        node.prelim += shift;
	        node.mod += shift;
	    }

	    function d3_layout_treeAncestor(vim, node, ancestor) {
	        return vim._tree.ancestor.parent == node.parent ? vim._tree.ancestor : ancestor;
	    }
	    // Squarified Treemaps by Mark Bruls, Kees Huizing, and Jarke J. van Wijk
	    // Modified to support a target aspect ratio by Jeff Heer
	    d3.layout.treemap = function () {
	        var hierarchy = d3.layout.hierarchy(),
	            round = Math.round,
	            size = [1, 1],
	            // width, height
	        padding = null,
	            pad = d3_layout_treemapPadNull,
	            sticky = false,
	            stickies,
	            ratio = 0.5 * (1 + Math.sqrt(5)); // golden ratio

	        // Compute the area for each child based on value & scale.
	        function scale(children, k) {
	            var i = -1,
	                n = children.length,
	                child,
	                area;
	            while (++i < n) {
	                area = (child = children[i]).value * (k < 0 ? 0 : k);
	                child.area = isNaN(area) || area <= 0 ? 0 : area;
	            }
	        }

	        // Recursively arranges the specified node's children into squarified rows.
	        function squarify(node) {
	            var children = node.children;
	            if (children && children.length) {
	                var rect = pad(node),
	                    row = [],
	                    remaining = children.slice(),
	                    // copy-on-write
	                child,
	                    best = Infinity,
	                    // the best row score so far
	                score,
	                    // the current row score
	                u = Math.min(rect.dx, rect.dy),
	                    // initial orientation
	                n;
	                scale(remaining, rect.dx * rect.dy / node.value);
	                row.area = 0;
	                while ((n = remaining.length) > 0) {
	                    row.push(child = remaining[n - 1]);
	                    row.area += child.area;
	                    if ((score = worst(row, u)) <= best) {
	                        // continue with this orientation
	                        remaining.pop();
	                        best = score;
	                    } else {
	                        // abort, and try a different orientation
	                        row.area -= row.pop().area;
	                        position(row, u, rect, false);
	                        u = Math.min(rect.dx, rect.dy);
	                        row.length = row.area = 0;
	                        best = Infinity;
	                    }
	                }
	                if (row.length) {
	                    position(row, u, rect, true);
	                    row.length = row.area = 0;
	                }
	                children.forEach(squarify);
	            }
	        }

	        // Recursively resizes the specified node's children into existing rows.
	        // Preserves the existing layout!
	        function stickify(node) {
	            var children = node.children;
	            if (children && children.length) {
	                var rect = pad(node),
	                    remaining = children.slice(),
	                    // copy-on-write
	                child,
	                    row = [];
	                scale(remaining, rect.dx * rect.dy / node.value);
	                row.area = 0;
	                while (child = remaining.pop()) {
	                    row.push(child);
	                    row.area += child.area;
	                    if (child.z != null) {
	                        position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
	                        row.length = row.area = 0;
	                    }
	                }
	                children.forEach(stickify);
	            }
	        }

	        // Computes the score for the specified row, as the worst aspect ratio.
	        function worst(row, u) {
	            var s = row.area,
	                r,
	                rmax = 0,
	                rmin = Infinity,
	                i = -1,
	                n = row.length;
	            while (++i < n) {
	                if (!(r = row[i].area)) continue;
	                if (r < rmin) rmin = r;
	                if (r > rmax) rmax = r;
	            }
	            s *= s;
	            u *= u;
	            return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
	        }

	        // Positions the specified row of nodes. Modifies `rect`.
	        function position(row, u, rect, flush) {
	            var i = -1,
	                n = row.length,
	                x = rect.x,
	                y = rect.y,
	                v = u ? round(row.area / u) : 0,
	                o;
	            if (u == rect.dx) {
	                // horizontal subdivision
	                if (flush || v > rect.dy) v = v ? rect.dy : 0; // over+underflow
	                while (++i < n) {
	                    o = row[i];
	                    o.x = x;
	                    o.y = y;
	                    o.dy = v;
	                    x += o.dx = v ? round(o.area / v) : 0;
	                }
	                o.z = true;
	                o.dx += rect.x + rect.dx - x; // rounding error
	                rect.y += v;
	                rect.dy -= v;
	            } else {
	                // vertical subdivision
	                if (flush || v > rect.dx) v = v ? rect.dx : 0; // over+underflow
	                while (++i < n) {
	                    o = row[i];
	                    o.x = x;
	                    o.y = y;
	                    o.dx = v;
	                    y += o.dy = v ? round(o.area / v) : 0;
	                }
	                o.z = false;
	                o.dy += rect.y + rect.dy - y; // rounding error
	                rect.x += v;
	                rect.dx -= v;
	            }
	        }

	        function treemap(d) {
	            var nodes = stickies || hierarchy(d),
	                root = nodes[0];
	            root.x = 0;
	            root.y = 0;
	            root.dx = size[0];
	            root.dy = size[1];
	            if (stickies) hierarchy.revalue(root);
	            scale([root], root.dx * root.dy / root.value);
	            (stickies ? stickify : squarify)(root);
	            if (sticky) stickies = nodes;
	            return nodes;
	        }

	        treemap.size = function (x) {
	            if (!arguments.length) return size;
	            size = x;
	            return treemap;
	        };

	        treemap.padding = function (x) {
	            if (!arguments.length) return padding;

	            function padFunction(node) {
	                var p = x.call(treemap, node, node.depth);
	                return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [p, p, p, p] : p);
	            }

	            function padConstant(node) {
	                return d3_layout_treemapPad(node, x);
	            }

	            var type;
	            pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x === "undefined" ? "undefined" : _typeof(x)) === "function" ? padFunction : type === "number" ? (x = [x, x, x, x], padConstant) : padConstant;
	            return treemap;
	        };

	        treemap.round = function (x) {
	            if (!arguments.length) return round != Number;
	            round = x ? Math.round : Number;
	            return treemap;
	        };

	        treemap.sticky = function (x) {
	            if (!arguments.length) return sticky;
	            sticky = x;
	            stickies = null;
	            return treemap;
	        };

	        treemap.ratio = function (x) {
	            if (!arguments.length) return ratio;
	            ratio = x;
	            return treemap;
	        };

	        return d3_layout_hierarchyRebind(treemap, hierarchy);
	    };

	    function d3_layout_treemapPadNull(node) {
	        return { x: node.x, y: node.y, dx: node.dx, dy: node.dy };
	    }

	    function d3_layout_treemapPad(node, padding) {
	        var x = node.x + padding[3],
	            y = node.y + padding[0],
	            dx = node.dx - padding[1] - padding[3],
	            dy = node.dy - padding[0] - padding[2];
	        if (dx < 0) {
	            x += dx / 2;dx = 0;
	        }
	        if (dy < 0) {
	            y += dy / 2;dy = 0;
	        }
	        return { x: x, y: y, dx: dx, dy: dy };
	    }
	})();

/***/ }

/******/ });