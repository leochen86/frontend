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

	var _dndTree = __webpack_require__(103);

	var _dndTree2 = _interopRequireDefault(_dndTree);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = angular.module('directives.dndTree', []).directive('d3DndTree', function () {
	  return new _dndTree2.default();
	}).name; /**
	          * @file d3 dnd tree  entry
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


	__webpack_require__(104);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//import * as d3 from 'd3';

	var DndTreeDirective = function () {
	    function DndTreeDirective() {
	        _classCallCheck(this, DndTreeDirective);

	        this.restrict = 'AE';
	        this.replace = true;
	        this.scope = {
	            data: '=',
	            width: '=',
	            height: '=',
	            expandLevel: '=',
	            tooltip: '=getTooltip'

	        };
	        this.template = '<div class="d3-dnd-tree"></div>';
	    }

	    _createClass(DndTreeDirective, [{
	        key: 'link',
	        value: function link(scope, element, attrs) {
	            var _this = this;

	            d3.select(element[0]).append("svg:svg");
	            //scope.expandLevel = scope.expandLevel || 2;
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
	        value: function draw(treeData, element, scope) {
	            // Calculate total nodes, max label length
	            var totalNodes = 0;
	            var maxLabelLength = 0;
	            // variables for drag/drop
	            var selectedNode = null;
	            var draggingNode = null;
	            // panning variables
	            var panSpeed = 200;
	            var panBoundary = 20; // Within 20px from edges will pan when dragging.
	            // Misc. variables
	            var i = 0;
	            var duration = 750;
	            var root;

	            // size of the diagram
	            var viewerWidth = scope.width || 1280;
	            var viewerHeight = scope.height || 800;

	            var tree = d3.layout.tree().size([viewerHeight, viewerWidth]);

	            // define a d3 diagonal projection for use by the node paths later on.
	            var diagonal = d3.svg.diagonal().projection(function (d) {
	                return [d.y, d.x];
	            });

	            // A recursive helper function for performing some setup by walking through all nodes

	            function visit(parent, visitFn, childrenFn) {
	                if (!parent) return;

	                visitFn(parent);

	                var children = childrenFn(parent);
	                if (children) {
	                    var count = children.length;
	                    for (var i = 0; i < count; i++) {
	                        visit(children[i], visitFn, childrenFn);
	                    }
	                }
	                console.log('visit', parent);
	            }

	            // Call visit function to establish maxLabelLength
	            visit(treeData, function (d) {
	                totalNodes++;
	                maxLabelLength = Math.max(d.name.length, maxLabelLength);
	            }, function (d) {
	                return d.children && d.children.length > 0 ? d.children : null;
	            });

	            // sort the tree according to the node names

	            function sortTree() {
	                tree.sort(function (a, b) {
	                    return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
	                });
	            }
	            // Sort the tree initially incase the JSON isn't in a sorted order.
	            sortTree();

	            // TODO: Pan function, can be better implemented.

	            function pan(domNode, direction) {
	                var speed = panSpeed;
	                if (panTimer) {
	                    clearTimeout(panTimer);
	                    translateCoords = d3.transform(svgGroup.attr("transform"));
	                    if (direction == 'left' || direction == 'right') {
	                        translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
	                        translateY = translateCoords.translate[1];
	                    } else if (direction == 'up' || direction == 'down') {
	                        translateX = translateCoords.translate[0];
	                        translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
	                    }
	                    scaleX = translateCoords.scale[0];
	                    scaleY = translateCoords.scale[1];
	                    scale = zoomListener.scale();
	                    svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
	                    d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
	                    zoomListener.scale(zoomListener.scale());
	                    zoomListener.translate([translateX, translateY]);
	                    panTimer = setTimeout(function () {
	                        pan(domNode, speed, direction);
	                    }, 50);
	                }
	            }

	            // Define the zoom function for the zoomable tree

	            function zoom() {
	                svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	            }

	            // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
	            var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

	            function initiateDrag(d, domNode) {
	                draggingNode = d;
	                d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
	                d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
	                d3.select(domNode).attr('class', 'node activeDrag');

	                svgGroup.selectAll("g.node").sort(function (a, b) {
	                    // select the parent and sort the path's
	                    if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
	                    else return -1; // a is the hovered element, bring "a" to the front
	                });
	                // if nodes has children, remove the links and nodes
	                if (nodes.length > 1) {
	                    // remove link paths
	                    links = tree.links(nodes);
	                    nodePaths = svgGroup.selectAll("path.link").data(links, function (d) {
	                        return d.target.id;
	                    }).remove();
	                    // remove child nodes
	                    nodesExit = svgGroup.selectAll("g.node").data(nodes, function (d) {
	                        return d.id;
	                    }).filter(function (d, i) {
	                        if (d.id == draggingNode.id) {
	                            return false;
	                        }
	                        return true;
	                    }).remove();
	                }

	                // remove parent link
	                parentLink = tree.links(tree.nodes(draggingNode.parent));
	                svgGroup.selectAll('path.link').filter(function (d, i) {
	                    if (d.target.id == draggingNode.id) {
	                        return true;
	                    }
	                    return false;
	                }).remove();

	                dragStarted = null;
	            }

	            // define the baseSvg, attaching a class for styling and the zoomListener
	            element.empty();
	            var baseSvg = d3.select(element[0]).append("svg").attr("width", viewerWidth).attr("height", viewerHeight).attr("class", "overlay");
	            //.call(zoomListener);


	            // Define the drag listeners for drag/drop behaviour of nodes.
	            var dragListener = d3.behavior.drag().on("dragstart", function (d) {
	                if (d == root) {
	                    return;
	                }
	                dragStarted = true;
	                nodes = tree.nodes(d);
	                d3.event.sourceEvent.stopPropagation();
	                // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
	            }).on("drag", function (d) {
	                if (d == root) {
	                    return;
	                }
	                if (dragStarted) {
	                    domNode = this;
	                    initiateDrag(d, domNode);
	                }

	                // get coords of mouseEvent relative to svg container to allow for panning
	                relCoords = d3.mouse($('svg').get(0));
	                if (relCoords[0] < panBoundary) {
	                    panTimer = true;
	                    pan(this, 'left');
	                } else if (relCoords[0] > $('svg').width() - panBoundary) {

	                    panTimer = true;
	                    pan(this, 'right');
	                } else if (relCoords[1] < panBoundary) {
	                    panTimer = true;
	                    pan(this, 'up');
	                } else if (relCoords[1] > $('svg').height() - panBoundary) {
	                    panTimer = true;
	                    pan(this, 'down');
	                } else {
	                    try {
	                        clearTimeout(panTimer);
	                    } catch (e) {}
	                }

	                d.x0 += d3.event.dy;
	                d.y0 += d3.event.dx;
	                var node = d3.select(this);
	                node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
	                updateTempConnector();
	            }).on("dragend", function (d) {
	                if (d == root) {
	                    return;
	                }
	                domNode = this;
	                if (selectedNode) {
	                    // now remove the element from the parent, and insert it into the new elements children
	                    var index = draggingNode.parent.children.indexOf(draggingNode);
	                    if (index > -1) {
	                        draggingNode.parent.children.splice(index, 1);
	                    }
	                    if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
	                        if (typeof selectedNode.children !== 'undefined') {
	                            selectedNode.children.push(draggingNode);
	                        } else {
	                            selectedNode._children.push(draggingNode);
	                        }
	                    } else {
	                        selectedNode.children = [];
	                        selectedNode.children.push(draggingNode);
	                    }
	                    // Make sure that the node being added to is expanded so user can see added node is correctly moved
	                    expand(selectedNode);
	                    sortTree();
	                    endDrag();
	                } else {
	                    endDrag();
	                }
	            });

	            function endDrag() {
	                selectedNode = null;
	                d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
	                d3.select(domNode).attr('class', 'node');
	                // now restore the mouseover event or we won't be able to drag a 2nd time
	                d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
	                updateTempConnector();
	                if (draggingNode !== null) {
	                    update(root);
	                    centerNode(draggingNode);
	                    draggingNode = null;
	                }
	            }

	            // Helper functions for collapsing and expanding nodes.

	            function collapse(d) {
	                if (d.children) {
	                    d._children = d.children;
	                    d._children.forEach(collapse);
	                    d.children = null;
	                }
	            }

	            function expand(d) {
	                if (d._children) {
	                    d.children = d._children;
	                    d.children.forEach(expand);
	                    d._children = null;
	                }
	            }

	            var overCircle = function overCircle(d) {
	                selectedNode = d;
	                updateTempConnector();
	            };
	            var outCircle = function outCircle(d) {
	                selectedNode = null;
	                updateTempConnector();
	            };

	            // Function to update the temporary connector indicating dragging affiliation
	            var updateTempConnector = function updateTempConnector() {
	                var data = [];
	                if (draggingNode !== null && selectedNode !== null) {
	                    // have to flip the source coordinates since we did this for the existing connectors on the original tree
	                    data = [{
	                        source: {
	                            x: selectedNode.y0,
	                            y: selectedNode.x0
	                        },
	                        target: {
	                            x: draggingNode.y0,
	                            y: draggingNode.x0
	                        }
	                    }];
	                }
	                var link = svgGroup.selectAll(".templink").data(data);

	                link.enter().append("path").attr("class", "templink").attr("d", d3.svg.diagonal()).attr('pointer-events', 'none');

	                link.attr("d", d3.svg.diagonal());

	                link.exit().remove();
	            };

	            // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

	            function centerNode(source) {
	                //var scale = zoomListener.scale();
	                //var x = -source.y0;
	                //var y = -source.x0;
	                //x = x * scale + viewerWidth / 2;
	                //y = y * scale + viewerHeight / 2;
	                //d3.select('g').transition()
	                //    .duration(duration)
	                //    .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
	                //zoomListener.scale(scale);
	                //zoomListener.translate([x, y]);

	                var x = -source.y0;
	                var y = -source.x0;
	                x = x + 120; //viewerWidth / 2;
	                y = 0; // y + viewerHeight / 2;
	                d3.select('g').transition().duration(duration).attr("transform", "translate(" + x + "," + y + ")scale(" + 1 + ")");
	            }

	            // Toggle children function

	            function toggleChildren(d) {
	                if (d.children) {
	                    d._children = d.children;
	                    d.children = null;
	                } else if (d._children) {
	                    d.children = d._children;
	                    d._children = null;
	                }
	                return d;
	            }

	            // Toggle children on click.

	            function click(d) {
	                if (d3.event.defaultPrevented) return; // click suppressed
	                d = toggleChildren(d);
	                update(d);
	                //centerNode(d);
	            }

	            function update(source) {
	                var _arguments = arguments;

	                // Compute the new height, function counts total children of root node and sets tree height accordingly.
	                // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
	                // This makes the layout more consistent.
	                var levelWidth = [1];
	                var childCount = function childCount(level, n) {

	                    if (n.children && n.children.length > 0) {
	                        if (levelWidth.length <= level + 1) levelWidth.push(0);

	                        levelWidth[level + 1] += n.children.length;
	                        n.children.forEach(function (d) {
	                            childCount(level + 1, d);
	                        });
	                    }
	                };
	                childCount(0, root);
	                //var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
	                var newHeight = d3.max(levelWidth) * 40; // 25 pixels per line
	                tree = tree.size([newHeight, viewerWidth]);
	                element.find('svg').attr('height', newHeight);

	                // Compute the new tree layout.
	                var nodes = tree.nodes(root).reverse(),
	                    links = tree.links(nodes);

	                // Set widths between levels based on maxLabelLength.
	                nodes.forEach(function (d) {
	                    d.y = d.depth * (maxLabelLength * 20); //maxLabelLength * 10px
	                    // alternatively to keep a fixed scale one can set a fixed depth per level
	                    // Normalize for fixed-depth by commenting out below line
	                    // d.y = (d.depth * 500); //500px per level.
	                });

	                // Update the nodes…
	                var node = svgGroup.selectAll("g.node").data(nodes, function (d) {
	                    return d.id || (d.id = ++i);
	                });

	                var getTooltip = function getTooltip(node) {
	                    if (scope.tooltip) {
	                        return angular.isFunction(scope.tooltip) ? scope.tooltip(node) : scope.tooltip;
	                    }
	                    return node.name;
	                };
	                var nodeRadius = 4.5;

	                // Enter any new nodes at the parent's previous position.
	                var nodeEnter = node.enter().append("g")
	                //.call(dragListener)
	                .attr("class", "node").attr("transform", function (d) {
	                    return "translate(" + source.y0 + "," + source.x0 + ")";
	                }).on('click', click).on('mouseover', function (d) {
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
	                        left: d.y + 120 + nodeRadius * 2,
	                        top: d.x + 0,
	                        opacity: 1
	                    });
	                }).on('mouseout', function (d) {
	                    console.log(_arguments);
	                    element.find('.d3-tooltip').css('opacity', 0);
	                });

	                nodeEnter.append("circle").attr('class', 'nodeCircle').attr("r", 0).style("fill", function (d) {
	                    return d._children ? "lightsteelblue" : "#fff";
	                });

	                nodeEnter.append("text").attr("x", function (d) {
	                    return d.children || d._children ? -10 : 10;
	                }).attr("dy", ".35em").attr('class', 'nodeText').attr("text-anchor", function (d) {
	                    return d.children || d._children ? "end" : "start";
	                }).text(function (d) {
	                    return d.name;
	                }).style("fill-opacity", 0);

	                // phantom node to give us mouseover in a radius around it
	                nodeEnter.append("circle").attr('class', 'ghostCircle').attr("r", 30).attr("opacity", 0.2) // change this to zero to hide the target area
	                .style("fill", "red").attr('pointer-events', 'mouseover').on("mouseover", function (node) {
	                    overCircle(node);
	                }).on("mouseout", function (node) {
	                    outCircle(node);
	                });

	                // Update the text to reflect whether node has children or not.
	                node.select('text').attr("x", function (d) {
	                    return d.children || d._children ? -10 : 10;
	                }).attr("text-anchor", function (d) {
	                    return d.children || d._children ? "end" : "start";
	                }).text(function (d) {
	                    return d.name;
	                });

	                // Change the circle fill depending on whether it has children and is collapsed
	                node.select("circle.nodeCircle").attr("r", nodeRadius).style("fill", function (d) {
	                    return d._children ? "lightsteelblue" : "#fff";
	                });

	                // Transition nodes to their new position.
	                var nodeUpdate = node.transition().duration(duration).attr("transform", function (d) {
	                    return "translate(" + d.y + "," + d.x + ")";
	                });

	                // Fade the text in
	                nodeUpdate.select("text").style("fill-opacity", 1);

	                // Transition exiting nodes to the parent's new position.
	                var nodeExit = node.exit().transition().duration(duration).attr("transform", function (d) {
	                    return "translate(" + source.y + "," + source.x + ")";
	                }).remove();

	                nodeExit.select("circle").attr("r", 0);

	                nodeExit.select("text").style("fill-opacity", 0);

	                // Update the links…
	                var link = svgGroup.selectAll("path.link").data(links, function (d) {
	                    return d.target.id;
	                });

	                // Enter any new links at the parent's previous position.
	                link.enter().insert("path", "g").attr("class", "link").attr("d", function (d) {
	                    var o = {
	                        x: source.x0,
	                        y: source.y0
	                    };
	                    return diagonal({
	                        source: o,
	                        target: o
	                    });
	                });

	                // Transition links to their new position.
	                link.transition().duration(duration).attr("d", diagonal);

	                // Transition exiting nodes to the parent's new position.
	                link.exit().transition().duration(duration).attr("d", function (d) {
	                    var o = {
	                        x: source.x,
	                        y: source.y
	                    };
	                    return diagonal({
	                        source: o,
	                        target: o
	                    });
	                }).remove();

	                // Stash the old positions for transition.
	                nodes.forEach(function (d) {
	                    d.x0 = d.x;
	                    d.y0 = d.y;
	                });
	            }

	            // Append a group which holds all nodes and which the zoom Listener can act upon.
	            var svgGroup = baseSvg.append("g");

	            // Define the root
	            root = treeData;
	            root.x0 = viewerHeight / 2;
	            root.y0 = 0;

	            // set expand level
	            function setExpandByLevel(node, level, expandLevel) {
	                console.log(level, node);
	                level = level || 0;
	                var childKey = 'children';

	                if (level < expandLevel) {
	                    level++;
	                } else {
	                    if (node.children) {
	                        //node._children = node.children;
	                        //node.children = null;
	                        //childKey = '_children';
	                        toggleChildren(node);
	                    }
	                }
	                (node[childKey] || []).forEach(function (item, i) {
	                    setExpandByLevel(item, level, expandLevel);
	                });
	            }

	            // Layout the tree initially and center on the root node.
	            update(root);
	            centerNode(root);

	            setExpandByLevel(root, 0, scope.expandLevel || 2);
	        }
	    }]);

	    return DndTreeDirective;
	}();

	exports.default = DndTreeDirective;

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
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/less-loader/index.js!./dndTree.less", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/less-loader/index.js!./dndTree.less");
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
	exports.push([module.id, ".d3-dnd-tree {\n  position: relative;\n}\n.d3-dnd-tree .node {\n  cursor: pointer;\n}\n.d3-dnd-tree .node circle {\n  fill: #fff;\n  stroke: steelblue;\n  stroke-width: 1.5px;\n}\n.d3-dnd-tree .node text {\n  font-size: 12px;\n  font-family: sans-serif;\n}\n.d3-dnd-tree .link {\n  fill: none;\n  stroke: #ccc;\n  stroke-width: 1.5px;\n}\n.d3-dnd-tree .templink {\n  fill: none;\n  stroke: red;\n  stroke-width: 3px;\n}\n.d3-dnd-tree .ghostCircle.show {\n  display: block;\n}\n.d3-dnd-tree .ghostCircle,\n.d3-dnd-tree .activeDrag .ghostCircle {\n  display: none;\n}\n.d3-tooltip {\n  position: absolute;\n  background: rgba(0, 0, 0, 0.6);\n  padding: 5px 10px;\n  border-radius: 2px;\n  color: #ffffff;\n  transition: all .25s linear;\n  font-size: 12px;\n}\n.d3-tooltip p {\n  text-indent: 2em;\n  margin: 0;\n}\n", ""]);

	// exports


/***/ }

/******/ });