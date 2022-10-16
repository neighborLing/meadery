(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
/**
 * html-compile html => html ast
 */

var HtmlCompile = function () {
    function HtmlCompile(element) {
        _classCallCheck(this, HtmlCompile);

        this.htmlStr = (0, utils_1.isElement)(element) ? element.outerHTML : element;
    }

    _createClass(HtmlCompile, [{
        key: "parse",
        value: function parse() {}
    }]);

    return HtmlCompile;
}();

exports.default = HtmlCompile;

},{"./utils":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var htmlCompile_1 = require("./htmlCompile");
var element = document.body;
console.log('element: ', element);
var compiler = new htmlCompile_1.default(element);
console.log('compiler: ', compiler);

},{"./htmlCompile":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isElement = void 0;
function isElement(val) {
    return val && val.nodeType === 1;
}
exports.isElement = isElement;

},{}]},{},[2])

//# sourceMappingURL=bundle.js.map
