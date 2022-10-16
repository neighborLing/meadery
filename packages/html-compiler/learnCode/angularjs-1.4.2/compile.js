function Compile(element) {
  var jqLite = JQLite,
    slice = [].slice,
    splice = [].splice,
    push = [].push,
    toString = Object.prototype.toString,
    getPrototypeOf = Object.getPrototypeOf,
    ngMinErr = minErr('ng')
  var jqLiteMinErr = minErr('jqLite');

  var trim = function (value) {
    return isString(value) ? value.trim() : value;
  };

  var isArray = Array.isArray;

  var NODE_TYPE_ELEMENT = 1;
  var NODE_TYPE_ATTRIBUTE = 2;
  var NODE_TYPE_TEXT = 3;
  var NODE_TYPE_COMMENT = 8;
  var NODE_TYPE_DOCUMENT = 9;
  var NODE_TYPE_DOCUMENT_FRAGMENT = 11;

  var SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  var HTML_REGEXP = /<|&#?\w+;/;
  var TAG_NAME_REGEXP = /<([\w:]+)/;
  var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;

  var wrapMap = {
    'option': [1, '<select multiple="multiple">', '</select>'],

    'thead': [1, '<table>', '</table>'],
    'col': [2, '<table><colgroup>', '</colgroup></table>'],
    'tr': [2, '<table><tbody>', '</tbody></table>'],
    'td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    '_default': [0, "", ""]
  };

  function isString(value) { return typeof value === 'string'; }

  function jqLiteAddNodes(root, elements) {
    // THIS CODE IS VERY HOT. Don't make changes without benchmarking.
    debugger;
    if (elements) {
      root.length = root.length || 0;
      // if a Node (the most common case)
      if (elements.nodeType) {
        root[root.length++] = elements;
      } else {
        var length = elements.length;

        // if an Array or NodeList and not a Window
        if (typeof length === 'number' && elements.window !== elements) {
          if (length) {
            for (var i = 0; i < length; i++) {
              root[root.length++] = elements[i];
            }
          }
        } else {
          root[root.length++] = elements;
        }
      }
    }
  }


  function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective,
    previousCompileContext) {
    if (!($compileNodes instanceof jqLite)) {
      // jquery always rewraps, whereas we need to preserve the original selector so that we can
      // modify it.

      $compileNodes = jqLite($compileNodes);
    }
    // We can not compile top level text elements since text nodes can be merged and we will
    // not be able to attach scope data to them, so we will wrap them in <span>
    forEach($compileNodes, function (node, index) {
      if (node.nodeType == NODE_TYPE_TEXT && node.nodeValue.match(/\S+/) /* non-empty */) {
        $compileNodes[index] = jqLite(node).wrap('<span></span>').parent()[0];
      }
    });
    console.log('$compileNodes: ', $compileNodes);
    var compositeLinkFn =
      compileNodes($compileNodes, transcludeFn, $compileNodes,
        maxPriority, ignoreDirective, previousCompileContext);
    // compile.$$addScopeClass($compileNodes);
    var namespace = null;
    return function publicLinkFn(scope, cloneConnectFn, options) {
      assertArg(scope, 'scope');

      options = options || {};
      var parentBoundTranscludeFn = options.parentBoundTranscludeFn,
        transcludeControllers = options.transcludeControllers,
        futureParentElement = options.futureParentElement;

      // When `parentBoundTranscludeFn` is passed, it is a
      // `controllersBoundTransclude` function (it was previously passed
      // as `transclude` to directive.link) so we must unwrap it to get
      // its `boundTranscludeFn`
      if (parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude) {
        parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude;
      }

      if (!namespace) {
        namespace = detectNamespaceForChildElements(futureParentElement);
      }
      var $linkNode;
      if (namespace !== 'html') {
        // When using a directive with replace:true and templateUrl the $compileNodes
        // (or a child element inside of them)
        // might change, so we need to recreate the namespace adapted compileNodes
        // for call to the link function.
        // Note: This will already clone the nodes...
        $linkNode = jqLite(
          wrapTemplate(namespace, jqLite('<div>').append($compileNodes).html())
        );
      } else if (cloneConnectFn) {
        // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart
        // and sometimes changes the structure of the DOM.
        $linkNode = JQLitePrototype.clone.call($compileNodes);
      } else {
        $linkNode = $compileNodes;
      }

      if (transcludeControllers) {
        for (var controllerName in transcludeControllers) {
          $linkNode.data('$' + controllerName + 'Controller', transcludeControllers[controllerName].instance);
        }
      }

      compile.$$addScopeInfo($linkNode, scope);

      if (cloneConnectFn) cloneConnectFn($linkNode, scope);
      if (compositeLinkFn) compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn);
      console.log('$linkNode: ', $linkNode);
      return $linkNode;
    };
  }

  function JQLite(element) {
    if (element instanceof JQLite) {
      return element;
    }

    var argIsString;

    if (isString(element)) {
      element = trim(element);
      argIsString = true;
    }
    if (!(this instanceof JQLite)) {
      if (argIsString && element.charAt(0) != '<') {
        throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
      }
      return new JQLite(element);
    }

    console.log('argIsString: ', argIsString);
    if (argIsString) {
      jqLiteAddNodes(this, jqLiteParseHTML(element));
      console.log('jqLiteParseHTML(element): ', jqLiteParseHTML(element));
      console.log('element: ', element);
    } else {
      jqLiteAddNodes(this, element);
    }
  }

  function jqLiteParseHTML(html, context) {
    context = context || document;
    var parsed;

    if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
      return [context.createElement(parsed[1])];
    }

    if ((parsed = jqLiteBuildFragment(html, context))) {
      return parsed.childNodes;
    }

    return [];
  }

  function jqLiteBuildFragment(html, context) {
    var tmp, tag, wrap,
      fragment = context.createDocumentFragment(),
      nodes = [], i;

    if (jqLiteIsTextNode(html)) {
      // Convert non-html into a text node
      nodes.push(context.createTextNode(html));
    } else {
      // Convert html into DOM nodes
      tmp = tmp || fragment.appendChild(context.createElement("div"));
      tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase();
      wrap = wrapMap[tag] || wrapMap._default;
      tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2];

      // Descend through wrappers to the right content
      i = wrap[0];
      while (i--) {
        tmp = tmp.lastChild;
      }

      nodes = concat(nodes, tmp.childNodes);

      tmp = fragment.firstChild;
      tmp.textContent = "";
    }

    // Remove wrapper from fragment
    fragment.textContent = "";
    fragment.innerHTML = ""; // Clear inner HTML
    forEach(nodes, function (node) {
      fragment.appendChild(node);
    });

    return fragment;
  }

  function jqLiteIsTextNode(html) {
    return !HTML_REGEXP.test(html);
  }

  function concat(array1, array2, index) {
    return array1.concat(slice.call(array2, index));
  }

  function forEach(obj, iterator, context) {
    var key, length;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          // Need to check if hasOwnProperty exists,
          // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
          if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = typeof obj !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        // Slow path for objects which do not have a method `hasOwnProperty`
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }

  function isFunction(value) { return typeof value === 'function'; }


  function isArrayLike(obj) {
    if (obj == null || isWindow(obj)) {
      return false;
    }

    // Support: iOS 8.2 (not reproducible in simulator)
    // "length" in obj used to prevent JIT error (gh-11508)
    var length = "length" in Object(obj) && obj.length;

    if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
      return true;
    }

    return isString(obj) || isArray(obj) || length === 0 ||
      typeof length === 'number' && length > 0 && (length - 1) in obj;
  }

  /**
    * @private
    * @param {*} obj
    * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
    *                   String ...)
    */
  function isArrayLike(obj) {
    if (obj == null || isWindow(obj)) {
      return false;
    }

    // Support: iOS 8.2 (not reproducible in simulator)
    // "length" in obj used to prevent JIT error (gh-11508)
    var length = "length" in Object(obj) && obj.length;

    if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
      return true;
    }

    return isString(obj) || isArray(obj) || length === 0 ||
      typeof length === 'number' && length > 0 && (length - 1) in obj;
  }

  /**
   * @ngdoc function
   * @name angular.forEach
   * @module ng
   * @kind function
   *
   * @description
   * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
   * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
   * is the value of an object property or an array element, `key` is the object property key or
   * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
   *
   * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
   * using the `hasOwnProperty` method.
   *
   * Unlike ES262's
   * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
   * Providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
   * return the value provided.
   *
     ```js
       var values = {name: 'misko', gender: 'male'};
       var log = [];
       angular.forEach(values, function(value, key) {
         this.push(key + ': ' + value);
       }, log);
       expect(log).toEqual(['name: misko', 'gender: male']);
     ```
   *
   * @param {Object|Array} obj Object to iterate over.
   * @param {Function} iterator Iterator function.
   * @param {Object=} context Object to become context (`this`) for the iterator function.
   * @returns {Object|Array} Reference to `obj`.
   */

  function forEach(obj, iterator, context) {
    var key, length;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          // Need to check if hasOwnProperty exists,
          // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
          if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = typeof obj !== 'object';
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === 'function') {
        // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        // Slow path for objects which do not have a method `hasOwnProperty`
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }

  function forEachSorted(obj, iterator, context) {
    var keys = Object.keys(obj).sort();
    for (var i = 0; i < keys.length; i++) {
      iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
  }


  /**
   * when using forEach the params are value, key, but it is often useful to have key, value.
   * @param {function(string, *)} iteratorFn
   * @returns {function(*, string)}
   */
  function reverseParams(iteratorFn) {
    return function (value, key) { iteratorFn(key, value); };
  }

  /**
   * A consistent way of creating unique IDs in angular.
   *
   * Using simple numbers allows us to generate 28.6 million unique ids per second for 10 years before
   * we hit number precision issues in JavaScript.
   *
   * Math.pow(2,53) / 60 / 60 / 24 / 365 / 10 = 28.6M
   *
   * @returns {number} an unique alpha-numeric string
   */
  function nextUid() {
    return ++uid;
  }


  /**
   * Set or clear the hashkey for an object.
   * @param obj object
   * @param h the hashkey (!truthy to delete the hashkey)
   */
  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }


  function baseExtend(dst, objs, deep) {
    var h = dst.$$hashKey;

    for (var i = 0, ii = objs.length; i < ii; ++i) {
      var obj = objs[i];
      if (!isObject(obj) && !isFunction(obj)) continue;
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        var src = obj[key];

        if (deep && isObject(src)) {
          if (isDate(src)) {
            dst[key] = new Date(src.valueOf());
          } else {
            if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
            baseExtend(dst[key], [src], true);
          }
        } else {
          dst[key] = src;
        }
      }
    }

    setHashKey(dst, h);
    return dst;
  }

  /**
   * @ngdoc function
   * @name angular.extend
   * @module ng
   * @kind function
   *
   * @description
   * Extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
   * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
   * by passing an empty object as the target: `var object = angular.extend({}, object1, object2)`.
   *
   * **Note:** Keep in mind that `angular.extend` does not support recursive merge (deep copy). Use
   * {@link angular.merge} for this.
   *
   * @param {Object} dst Destination object.
   * @param {...Object} src Source object(s).
   * @returns {Object} Reference to `dst`.
   */
  function extend(dst) {
    return baseExtend(dst, slice.call(arguments, 1), false);
  }


  /**
  * @ngdoc function
  * @name angular.merge
  * @module ng
  * @kind function
  *
  * @description
  * Deeply extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
  * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
  * by passing an empty object as the target: `var object = angular.merge({}, object1, object2)`.
  *
  * Unlike {@link angular.extend extend()}, `merge()` recursively descends into object properties of source
  * objects, performing a deep copy.
  *
  * @param {Object} dst Destination object.
  * @param {...Object} src Source object(s).
  * @returns {Object} Reference to `dst`.
  */
  function merge(dst) {
    return baseExtend(dst, slice.call(arguments, 1), true);
  }



  function toInt(str) {
    return parseInt(str, 10);
  }


  function inherit(parent, extra) {
    return extend(Object.create(parent), extra);
  }

  /**
   * @ngdoc function
   * @name angular.noop
   * @module ng
   * @kind function
   *
   * @description
   * A function that performs no operations. This function can be useful when writing code in the
   * functional style.
     ```js
       function foo(callback) {
         var result = calculateResult();
         (callback || angular.noop)(result);
       }
     ```
   */
  function noop() { }
  noop.$inject = [];


  /**
   * @ngdoc function
   * @name angular.identity
   * @module ng
   * @kind function
   *
   * @description
   * A function that returns its first argument. This function is useful when writing code in the
   * functional style.
   *
     ```js
       function transformer(transformationFn, value) {
         return (transformationFn || angular.identity)(value);
       };
     ```
    * @param {*} value to be returned.
    * @returns {*} the value passed in.
   */
  function identity($) { return $; }
  identity.$inject = [];


  function valueFn(value) { return function () { return value; }; }

  function hasCustomToString(obj) {
    return isFunction(obj.toString) && obj.toString !== Object.prototype.toString;
  }


  /**
   * @ngdoc function
   * @name angular.isUndefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is undefined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is undefined.
   */
  function isUndefined(value) { return typeof value === 'undefined'; }


  /**
   * @ngdoc function
   * @name angular.isDefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is defined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is defined.
   */
  function isDefined(value) { return typeof value !== 'undefined'; }


  /**
   * @ngdoc function
   * @name angular.isObject
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
   * considered to be objects. Note that JavaScript arrays are objects.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Object` but not `null`.
   */
  function isObject(value) {
    // http://jsperf.com/isobject4
    return value !== null && typeof value === 'object';
  }


  /**
   * Determine if a value is an object with a null prototype
   *
   * @returns {boolean} True if `value` is an `Object` with a null prototype
   */
  function isBlankObject(value) {
    return value !== null && typeof value === 'object' && !getPrototypeOf(value);
  }


  /**
   * @ngdoc function
   * @name angular.isString
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `String`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `String`.
   */
  function isString(value) { return typeof value === 'string'; }


  /**
   * @ngdoc function
   * @name angular.isNumber
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Number`.
   *
   * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
   *
   * If you wish to exclude these then you can use the native
   * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
   * method.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Number`.
   */
  function isNumber(value) { return typeof value === 'number'; }


  /**
   * @ngdoc function
   * @name angular.isDate
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a value is a date.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Date`.
   */
  function isDate(value) {
    return toString.call(value) === '[object Date]';
  }


  /**
   * @ngdoc function
   * @name angular.isArray
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Array`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Array`.
   */
  var isArray = Array.isArray;

  /**
   * @ngdoc function
   * @name angular.isFunction
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */
  function isFunction(value) { return typeof value === 'function'; }


  /**
   * Determines if a value is a regular expression object.
   *
   * @private
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `RegExp`.
   */
  function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
  }


  /**
   * Checks if `obj` is a window object.
   *
   * @private
   * @param {*} obj Object to check
   * @returns {boolean} True if `obj` is a window obj.
   */
  function isWindow(obj) {
    return obj && obj.window === obj;
  }


  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }


  function isFile(obj) {
    return toString.call(obj) === '[object File]';
  }


  function isFormData(obj) {
    return toString.call(obj) === '[object FormData]';
  }


  function isBlob(obj) {
    return toString.call(obj) === '[object Blob]';
  }


  function isBoolean(value) {
    return typeof value === 'boolean';
  }


  function isPromiseLike(obj) {
    return obj && isFunction(obj.then);
  }


  var TYPED_ARRAY_REGEXP = /^\[object (Uint8(Clamped)?)|(Uint16)|(Uint32)|(Int8)|(Int16)|(Int32)|(Float(32)|(64))Array\]$/;
  function isTypedArray(value) {
    return TYPED_ARRAY_REGEXP.test(toString.call(value));
  }


  var trim = function (value) {
    return isString(value) ? value.trim() : value;
  };

  // Copied from:
  // http://docs.closure-library.googlecode.com/git/local_closure_goog_string_string.js.source.html#line1021
  // Prereq: s is a string.
  var escapeForRegexp = function (s) {
    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08');
  };


  /**
   * @ngdoc function
   * @name angular.isElement
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a DOM element (or wrapped jQuery element).
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
   */
  function isElement(node) {
    return !!(node &&
      (node.nodeName  // we are a direct element
        || (node.prop && node.attr && node.find)));  // we have an on and find method part of jQuery API
  }

  /**
   * @param str 'key1,key2,...'
   * @returns {object} in the form of {key1:true, key2:true, ...}
   */
  function makeMap(str) {
    var obj = {}, items = str.split(","), i;
    for (i = 0; i < items.length; i++) {
      obj[items[i]] = true;
    }
    return obj;
  }

  function minErr(module, ErrorConstructor) {
    ErrorConstructor = ErrorConstructor || Error;
    return function () {
      var SKIP_INDEXES = 2;

      var templateArgs = arguments,
        code = templateArgs[0],
        message = '[' + (module ? module + ':' : '') + code + '] ',
        template = templateArgs[1],
        paramPrefix, i;

      message += template.replace(/\{\d+\}/g, function (match) {
        var index = +match.slice(1, -1),
          shiftedIndex = index + SKIP_INDEXES;

        if (shiftedIndex < templateArgs.length) {
          return toDebugString(templateArgs[shiftedIndex]);
        }

        return match;
      });

      message += '\nhttp://errors.angularjs.org/1.4.2/' +
        (module ? module + '/' : '') + code;

      for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
        message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' +
          encodeURIComponent(toDebugString(templateArgs[i]));
      }

      return new ErrorConstructor(message);
    };
  }

  function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective,
    previousCompileContext) {
    var linkFns = [],
      attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound;

    for (var i = 0; i < nodeList.length; i++) {
      attrs = new Attributes();

      // we must always refer to nodeList[i] since the nodes can be replaced underneath us.
      directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined,
        ignoreDirective);

      nodeLinkFn = (directives.length)
        ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement,
          null, [], [], previousCompileContext)
        : null;

      // if (nodeLinkFn && nodeLinkFn.scope) {
      //   compile.$$addScopeClass(attrs.$$element);
      // }

      childLinkFn = (nodeLinkFn && nodeLinkFn.terminal ||
        !(childNodes = nodeList[i].childNodes) ||
        !childNodes.length)
        ? null
        : compileNodes(childNodes,
          nodeLinkFn ? (
            (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement)
            && nodeLinkFn.transclude) : transcludeFn);

      if (nodeLinkFn || childLinkFn) {
        linkFns.push(i, nodeLinkFn, childLinkFn);
        linkFnFound = true;
        nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn;
      }

      //use the previous context only for the first element in the virtual group
      previousCompileContext = null;
    }

    // return a linking function if we have found anything, null otherwise
    return linkFnFound ? compositeLinkFn : null;

    function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
      var nodeLinkFn, childLinkFn, node, childScope, i, ii, idx, childBoundTranscludeFn;
      var stableNodeList;


      if (nodeLinkFnFound) {
        // copy nodeList so that if a nodeLinkFn removes or adds an element at this DOM level our
        // offsets don't get screwed up
        var nodeListLength = nodeList.length;
        stableNodeList = new Array(nodeListLength);

        // create a sparse array by only copying the elements which have a linkFn
        for (i = 0; i < linkFns.length; i += 3) {
          idx = linkFns[i];
          stableNodeList[idx] = nodeList[idx];
        }
      } else {
        stableNodeList = nodeList;
      }

      for (i = 0, ii = linkFns.length; i < ii;) {
        node = stableNodeList[linkFns[i++]];
        nodeLinkFn = linkFns[i++];
        childLinkFn = linkFns[i++];

        if (nodeLinkFn) {
          if (nodeLinkFn.scope) {
            childScope = scope.$new();
            compile.$$addScopeInfo(jqLite(node), childScope);
            var destroyBindings = nodeLinkFn.$$destroyBindings;
            if (destroyBindings) {
              nodeLinkFn.$$destroyBindings = null;
              childScope.$on('$destroyed', destroyBindings);
            }
          } else {
            childScope = scope;
          }

          if (nodeLinkFn.transcludeOnThisElement) {
            childBoundTranscludeFn = createBoundTranscludeFn(
              scope, nodeLinkFn.transclude, parentBoundTranscludeFn);

          } else if (!nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn) {
            childBoundTranscludeFn = parentBoundTranscludeFn;

          } else if (!parentBoundTranscludeFn && transcludeFn) {
            childBoundTranscludeFn = createBoundTranscludeFn(scope, transcludeFn);

          } else {
            childBoundTranscludeFn = null;
          }

          nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn,
            nodeLinkFn);

        } else if (childLinkFn) {
          childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn);
        }
      }
    }
  }
  /** 
   * init
  */
  compile(element);
}