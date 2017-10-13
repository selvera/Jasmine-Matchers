(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// modules
var createRegister = require('./src/create-register');
var jasmineV1 = require('./src/jasmine-v1');
var jasmineV2 = require('./src/jasmine-v2');
var jest = require('./src/jest');

// public
module.exports = createRegister({
  jasmineV1: jasmineV1,
  jasmineV2: jasmineV2,
  jest: jest
}, global);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./src/create-register":3,"./src/jasmine-v1":4,"./src/jasmine-v2":5,"./src/jest":8}],2:[function(require,module,exports){
(function (global){
// public
module.exports = addAsymmetricMatchers;

// implementation
function addAsymmetricMatchers(matchersByName) {
  /* eslint guard-for-in: 0 */
  global.any = global.any || {};
  for (var name in matchersByName) {
    addAsymmetricMatcher(name, matchersByName[name]);
  }
}

function addAsymmetricMatcher(name, matcher) {
  global.any[name] = function () {
    var args = [].slice.call(arguments);
    return {
      asymmetricMatch: function (actual) {
        var clone = args.slice();
        clone.push(actual);
        return matcher.apply(this, clone);
      }
    };
  };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
// modules
var addAsymmetricMatchers = require('./add-asymmetric-matchers');

// public
module.exports = createRegister;

// implementation
function createRegister(frameworks, globals) {
  var adaptersByNumberOfArgs;

  if (globals.expect && globals.expect.extend) {
    adaptersByNumberOfArgs = frameworks.jest.getAdapters(globals);
  } else if (globals.jasmine && globals.jasmine.addMatchers) {
    adaptersByNumberOfArgs = frameworks.jasmineV2.getAdapters(globals);
  } else if (globals.jasmine) {
    adaptersByNumberOfArgs = frameworks.jasmineV1.getAdapters(globals);
  } else {
    throw new Error('jasmine-expect cannot find jest, jasmine v2.x, or jasmine v1.x');
  }

  addMatchers.asymmetric = addAsymmetricMatchers;

  return addMatchers;

  function addMatchers(matchersByName) {
    /* eslint guard-for-in: 0 */
    for (var name in matchersByName) {
      var matcherFunction = matchersByName[name];
      var numberOfArgs = matcherFunction.length;
      var adapter = adaptersByNumberOfArgs[numberOfArgs];
      adapter(name, matcherFunction);
    }
  }
}

},{"./add-asymmetric-matchers":2}],4:[function(require,module,exports){
module.exports = {
  getAdapters: function (globals) {
    return {
      1: createFactory(adapterForActual),
      2: createFactory(adapterForActualAndExpected),
      3: createFactory(adapterForActualAndTwoExpected),
      4: createFactory(adapterForKeyAndActualAndTwoExpected)
    };

    function createFactory(adapter) {
      return function (name, matcher) {
        var matchersByName = {};
        matchersByName[name] = adapter(name, matcher);
        globals.beforeEach(function () {
          this.addMatchers(matchersByName);
        });
        return matchersByName;
      };
    }

    function adapterForActual(name, matcher) {
      return function (optionalMessage) {
        return matcher(this.actual, optionalMessage);
      };
    }

    function adapterForActualAndExpected(name, matcher) {
      return function (expected, optionalMessage) {
        return matcher(expected, this.actual, optionalMessage);
      };
    }

    function adapterForActualAndTwoExpected(name, matcher) {
      return function (expected1, expected2, optionalMessage) {
        return matcher(expected1, expected2, this.actual, optionalMessage);
      };
    }

    function adapterForKeyAndActualAndTwoExpected(name, matcher) {
      return function (key, expected1, expected2, optionalMessage) {
        return matcher(key, expected1, expected2, this.actual, optionalMessage);
      };
    }
  }
};

},{}],5:[function(require,module,exports){
var matcherFactory = require('./matcher-factory');
var memberMatcherFactory = require('./member-matcher-factory');

module.exports = {
  getAdapters: function (globals) {
    return {
      1: createFactory(getAdapter(1)),
      2: createFactory(getAdapter(2)),
      3: createFactory(getAdapter(3)),
      4: createFactory(getAdapter(4))
    };

    function createFactory(adapter) {
      return function (name, matcher) {
        var matchersByName = {};
        matchersByName[name] = adapter(name, matcher);
        globals.beforeEach(function () {
          globals.jasmine.addMatchers(matchersByName);
        });
        return matchersByName;
      };
    }

    function getAdapter(argsCount) {
      return function (name, matcher) {
        var factory = isMemberMatcher(name) ? memberMatcherFactory : matcherFactory;
        return factory[argsCount](name, matcher);
      };
    }

    function isMemberMatcher(name) {
      return name.search(/^toHave/) !== -1;
    }
  }
};

},{"./matcher-factory":6,"./member-matcher-factory":7}],6:[function(require,module,exports){
module.exports = {
  1: forActual,
  2: forActualAndExpected,
  3: forActualAndTwoExpected
};

function forActual(name, matcher) {
  return function (util) {
    return {
      compare: function (actual, optionalMessage) {
        var passes = matcher(actual);
        return {
          pass: passes,
          message: (
            optionalMessage ?
            util.buildFailureMessage(name, passes, actual, optionalMessage) :
            util.buildFailureMessage(name, passes, actual)
          )
        };
      }
    };
  };
}

function forActualAndExpected(name, matcher) {
  return function (util) {
    return {
      compare: function (actual, expected, optionalMessage) {
        var passes = matcher(expected, actual);
        return {
          pass: passes,
          message: (
            optionalMessage ?
            util.buildFailureMessage(name, passes, actual, expected, optionalMessage) :
            util.buildFailureMessage(name, passes, actual, expected)
          )
        };
      }
    };
  };
}

function forActualAndTwoExpected(name, matcher) {
  return function (util) {
    return {
      compare: function (actual, expected1, expected2, optionalMessage) {
        var passes = matcher(expected1, expected2, actual);
        return {
          pass: passes,
          message: (
            optionalMessage ?
            util.buildFailureMessage(name, passes, actual, expected1, expected2, optionalMessage) :
            util.buildFailureMessage(name, passes, actual, expected1, expected2)
          )
        };
      }
    };
  };
}

},{}],7:[function(require,module,exports){
module.exports = {
  2: forKeyAndActual,
  3: forKeyAndActualAndExpected,
  4: forKeyAndActualAndTwoExpected
};

function forKeyAndActual(name, matcher) {
  return function (util) {
    return {
      compare: function (actual, key, optionalMessage) {
        var passes = matcher(key, actual);
        return {
          pass: passes,
          message: util.buildFailureMessage(name, passes, actual, optionalMessage || key)
        };
      }
    };
  };
}

function forKeyAndActualAndExpected(name, matcher) {
  return function (util) {
    return {
      compare: function (actual, key, expected, optionalMessage) {
        var passes = matcher(key, expected, actual);
        var message = (optionalMessage ?
          util.buildFailureMessage(name, passes, actual, expected, optionalMessage) :
          util.buildFailureMessage(name, passes, actual, expected)
        );
        return {
          pass: passes,
          message: formatErrorMessage(name, message, key)
        };
      }
    };
  };
}

function forKeyAndActualAndTwoExpected(name, matcher) {
  return function (util) {
    return {
      compare: function (actual, key, expected1, expected2, optionalMessage) {
        var passes = matcher(key, expected1, expected2, actual);
        var message = (optionalMessage ?
          util.buildFailureMessage(name, passes, actual, expected1, expected2, optionalMessage) :
          util.buildFailureMessage(name, passes, actual, expected1, expected2)
        );
        return {
          pass: passes,
          message: formatErrorMessage(name, message, key)
        };
      }
    };
  };
}

function formatErrorMessage(name, message, key) {
  if (name.search(/^toHave/) !== -1) {
    return message
      .replace('Expected', 'Expected member "' + key + '" of')
      .replace(' to have ', ' to be ');
  }
  return message;
}

},{}],8:[function(require,module,exports){
var matcherFactory = require('./matcher-factory');
var memberMatcherFactory = require('./member-matcher-factory');

module.exports = {
  getAdapters: function (globals) {
    return {
      1: createFactory(getAdapter(1)),
      2: createFactory(getAdapter(2)),
      3: createFactory(getAdapter(3)),
      4: createFactory(getAdapter(4))
    };

    function createFactory(adapter) {
      return function (name, matcher) {
        var matchersByName = {};
        matchersByName[name] = adapter(name, matcher);
        globals.expect.extend(matchersByName);
        return matchersByName;
      };
    }

    function getAdapter(argsCount) {
      return function (name, matcher) {
        var factory = isMemberMatcher(name) ? memberMatcherFactory : matcherFactory;
        return factory[argsCount](name, matcher);
      };
    }

    function isMemberMatcher(name) {
      return name.search(/^toHave/) !== -1;
    }
  }
};

},{"./matcher-factory":9,"./member-matcher-factory":10}],9:[function(require,module,exports){
module.exports = {
  1: adapterForActual,
  2: adapterForActualAndExpected,
  3: adapterForActualAndTwoExpected
};

function adapterForActual(name, matcher) {
  return function (received) {
    var pass = matcher(received);
    var infix = pass ? ' not ' : ' ';
    var message = 'expected ' + this.utils.printReceived(received) + infix + getLongName(name);
    return {
      message: function () {
        return message;
      },
      pass: pass
    };
  };
}

function adapterForActualAndExpected(name, matcher) {
  return function (received, expected) {
    var pass = matcher(expected, received);
    var infix = pass ? ' not ' : ' ';
    var message = 'expected ' + this.utils.printReceived(received) + infix + getLongName(name) + ' ' + this.utils.printExpected(expected);
    return {
      message: function () {
        return message;
      },
      pass: pass
    };
  };
}

function adapterForActualAndTwoExpected(name, matcher) {
  return function (received, expected1, expected2) {
    var pass = matcher(expected1, expected2, received);
    var infix = pass ? ' not ' : ' ';
    var message = 'expected ' + this.utils.printReceived(received) + infix + getLongName(name) + ' ' + this.utils.printExpected(expected1) + ', ' + this.utils.printExpected(expected2);
    return {
      message: function () {
        return message;
      },
      pass: pass
    };
  };
}

function getLongName(name) {
  return name.replace(/\B([A-Z])/g, ' $1').toLowerCase();
}

},{}],10:[function(require,module,exports){
module.exports = {
  2: forKeyAndActual,
  3: forKeyAndActualAndExpected,
  4: forKeyAndActualAndTwoExpected
};

function forKeyAndActual(name, matcher) {
  return function (received, key) {
    var pass = matcher(key, received);
    var infix = pass ? ' not ' : ' ';
    var message = 'expected member "' + key + '" of ' + this.utils.printReceived(received) + infix + getLongName(name);
    return {
      message: function () {
        return message;
      },
      pass: pass
    };
  };
}

function forKeyAndActualAndExpected(name, matcher) {
  return function (received, key, expected) {
    var pass = matcher(key, expected, received);
    var infix = pass ? ' not ' : ' ';
    var message = 'expected member "' + key + '" of ' + this.utils.printReceived(received) + infix + getLongName(name) + ' ' + this.utils.printExpected(expected);
    return {
      message: function () {
        return message;
      },
      pass: pass
    };
  };
}

function forKeyAndActualAndTwoExpected(name, matcher) {
  return function (received, key, expected1, expected2) {
    var pass = matcher(key, expected1, expected2, received);
    var infix = pass ? ' not ' : ' ';
    var message = 'expected member "' + key + '" of ' + this.utils.printReceived(received) + infix + getLongName(name) + ' ' + this.utils.printExpected(expected1) + ', ' + this.utils.printExpected(expected2);
    return {
      message: function () {
        return message;
      },
      pass: pass
    };
  };
}

function getLongName(name) {
  return name.replace(/\B([A-Z])/g, ' $1').toLowerCase();
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addMatchers = require('add-matchers');

var _addMatchers2 = _interopRequireDefault(_addMatchers);

var _matchers = require('./matchers');

var matchersByName = _interopRequireWildcard(_matchers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _addMatchers2.default)(matchersByName);

_addMatchers2.default.asymmetric({
  after: matchersByName.toBeAfter,
  arrayOfBooleans: matchersByName.toBeArrayOfBooleans,
  arrayOfNumbers: matchersByName.toBeArrayOfNumbers,
  arrayOfObjects: matchersByName.toBeArrayOfObjects,
  arrayOfSize: matchersByName.toBeArrayOfSize,
  arrayOfStrings: matchersByName.toBeArrayOfStrings,
  before: matchersByName.toBeBefore,
  calculable: matchersByName.toBeCalculable,
  emptyArray: matchersByName.toBeEmptyArray,
  emptyObject: matchersByName.toBeEmptyObject,
  evenNumber: matchersByName.toBeEvenNumber,
  greaterThanOrEqualTo: matchersByName.toBeGreaterThanOrEqualTo,
  iso8601: matchersByName.toBeIso8601,
  jsonString: matchersByName.toBeJsonString,
  lessThanOrEqualTo: matchersByName.toBeLessThanOrEqualTo,
  longerThan: matchersByName.toBeLongerThan,
  nonEmptyArray: matchersByName.toBeNonEmptyArray,
  nonEmptyObject: matchersByName.toBeNonEmptyObject,
  nonEmptyString: matchersByName.toBeNonEmptyString,
  oddNumber: matchersByName.toBeOddNumber,
  regExp: matchersByName.toBeRegExp,
  sameLengthAs: matchersByName.toBeSameLengthAs,
  shorterThan: matchersByName.toBeShorterThan,
  whitespace: matchersByName.toBeWhitespace,
  wholeNumber: matchersByName.toBeWholeNumber,
  withinRange: matchersByName.toBeWithinRange,
  endingWith: matchersByName.toEndWith,
  startingWith: matchersByName.toStartWith
});

exports.default = matchersByName;

},{"./matchers":12,"add-matchers":1}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var is = function is(type) {
  return function (value) {
    return Object.prototype.toString.call(value) === '[object ' + type + ']';
  };
};
var isArray = is('Array');
var isBoolean = is('Boolean');
var isBooleanObject = function isBooleanObject(trueOrFalse) {
  return function (value) {
    return isBoolean(value) && value.valueOf() === trueOrFalse;
  };
};
var isDate = is('Date');
var isFalse = isBooleanObject(false);
var isFunction = is('Function');
var isObject = is('Object');
var isString = is('String');
var isTrue = isBooleanObject(true);

var memberMatcherFor = function memberMatcherFor(toBeX) {
  return function (key, actual) {
    return isObject(actual) && toBeX(actual[key]);
  };
};

var reduce = function reduce(collection, fn, memo) {
  if (isArray(collection)) {
    for (var i = 0, len = collection.length; i < len; i++) {
      memo = fn(memo, collection[i], i, collection);
    }
  } else {
    for (var key in collection) {
      if ({}.hasOwnProperty.call(collection, key)) {
        memo = fn(memo, collection[key], key, collection);
      }
    }
  }
  return memo;
};

var keys = function keys(object) {
  return reduce(object, function (keyNames, value, key) {
    return keyNames.concat(key);
  }, []);
};

var every = function every(array, truthTest) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (!truthTest(array[i])) {
      return false;
    }
  }
  return true;
};

var isMatch = function isMatch(pattern, actual) {
  var patterns = {
    '1999-12-31': /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
    '1999-12-31T23:59': /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})$/,
    '1999-12-31T23:59:59': /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})$/,
    '1999-12-31T23:59:59.000': /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})$/,
    '1999-12-31T23:59:59.000Z': /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})Z$/
  };
  return actual.search(patterns[pattern]) !== -1;
};

var toBeDate = exports.toBeDate = isDate;
var toBeBefore = exports.toBeBefore = function toBeBefore(otherDate, actual) {
  return toBeDate(actual) && toBeDate(otherDate) && actual.getTime() < otherDate.getTime();
};
var toBeAfter = exports.toBeAfter = function toBeAfter(otherDate, actual) {
  return toBeBefore(actual, otherDate);
};

var toBeArray = exports.toBeArray = isArray;
var toBeBoolean = exports.toBeBoolean = isBoolean;
var toBeFunction = exports.toBeFunction = isFunction;
var toBeObject = exports.toBeObject = isObject;
var toBeString = exports.toBeString = isString;
var toBeNumber = exports.toBeNumber = function toBeNumber(actual) {
  return !isNaN(parseFloat(actual)) && !isString(actual);
};

var toBeArrayOfBooleans = exports.toBeArrayOfBooleans = function toBeArrayOfBooleans(actual) {
  return toBeArray(actual) && every(actual, toBeBoolean);
};

var toBeArrayOfNumbers = exports.toBeArrayOfNumbers = function toBeArrayOfNumbers(actual) {
  return toBeArray(actual) && every(actual, toBeNumber);
};

var toBeArrayOfObjects = exports.toBeArrayOfObjects = function toBeArrayOfObjects(actual) {
  return toBeArray(actual) && every(actual, toBeObject);
};

var toBeArrayOfSize = exports.toBeArrayOfSize = function toBeArrayOfSize(size, actual) {
  return toBeArray(actual) && actual.length === size;
};

var toBeArrayOfStrings = exports.toBeArrayOfStrings = function toBeArrayOfStrings(actual) {
  return toBeArray(actual) && every(actual, toBeString);
};

var toBeCalculable = exports.toBeCalculable = function toBeCalculable(actual) {
  return !isNaN(actual * 2);
};

var toBeEmptyArray = exports.toBeEmptyArray = function toBeEmptyArray(actual) {
  return toBeArrayOfSize(0, actual);
};

var toBeEmptyObject = exports.toBeEmptyObject = function toBeEmptyObject(actual) {
  return isObject(actual) && keys(actual).length === 0;
};

var toBeEmptyString = exports.toBeEmptyString = function toBeEmptyString(actual) {
  return actual === '';
};

var toBeEvenNumber = exports.toBeEvenNumber = function toBeEvenNumber(actual) {
  return toBeNumber(actual) && actual % 2 === 0;
};

var toBeFalse = exports.toBeFalse = function toBeFalse(actual) {
  return actual === false || isFalse(actual);
}; // eslint-disable-line new-cap

var toBeGreaterThanOrEqualTo = exports.toBeGreaterThanOrEqualTo = function toBeGreaterThanOrEqualTo(otherNumber, actual) {
  return toBeNumber(actual) && actual >= otherNumber;
};

var toBeHtmlString = exports.toBeHtmlString = function toBeHtmlString(actual) {
  return toBeString(actual) && actual.search(/<("[^"]*"|'[^']*'|[^'">])*>/) !== -1;
};

var toBeValidDate = exports.toBeValidDate = function toBeValidDate(actual) {
  return isDate(actual) && !isNaN(actual.getTime());
};

var toBeIso8601 = exports.toBeIso8601 = function toBeIso8601(actual) {
  return toBeString(actual) && (isMatch('1999-12-31', actual) || isMatch('1999-12-31T23:59', actual) || isMatch('1999-12-31T23:59:59', actual) || isMatch('1999-12-31T23:59:59.000', actual) || isMatch('1999-12-31T23:59:59.000Z', actual)) && toBeValidDate(new Date(actual));
};

var toBeJsonString = exports.toBeJsonString = function toBeJsonString(actual) {
  try {
    return JSON.parse(actual) !== null;
  } catch (err) {
    return false;
  }
};

var toBeLessThanOrEqualTo = exports.toBeLessThanOrEqualTo = function toBeLessThanOrEqualTo(otherNumber, actual) {
  return toBeNumber(actual) && actual <= otherNumber;
};

var toBeLongerThan = exports.toBeLongerThan = function toBeLongerThan(otherString, actual) {
  return toBeString(actual) && toBeString(otherString) && actual.length > otherString.length;
};

var toBeNear = exports.toBeNear = function toBeNear(number, epsilon, actual) {
  return toBeNumber(actual) && actual >= number - epsilon && actual <= number + epsilon;
};

var toBeNonEmptyArray = exports.toBeNonEmptyArray = function toBeNonEmptyArray(actual) {
  return isArray(actual) && actual.length > 0;
};

var toBeNonEmptyObject = exports.toBeNonEmptyObject = function toBeNonEmptyObject(actual) {
  return isObject(actual) && keys(actual).length > 0;
};

var toBeNonEmptyString = exports.toBeNonEmptyString = function toBeNonEmptyString(actual) {
  return toBeString(actual) && actual.length > 0;
};

var toBeOddNumber = exports.toBeOddNumber = function toBeOddNumber(actual) {
  return toBeNumber(actual) && actual % 2 !== 0;
};

var toBeRegExp = exports.toBeRegExp = function toBeRegExp(actual) {
  return actual instanceof RegExp;
};

var toBeSameLengthAs = exports.toBeSameLengthAs = function toBeSameLengthAs(otherString, actual) {
  return toBeString(actual) && toBeString(otherString) && actual.length === otherString.length;
};

var toBeShorterThan = exports.toBeShorterThan = function toBeShorterThan(otherString, actual) {
  return toBeString(actual) && toBeString(otherString) && actual.length < otherString.length;
};

var toBeTrue = exports.toBeTrue = function toBeTrue(actual) {
  return actual === true || isTrue(actual);
}; // eslint-disable-line new-cap

var toBeWhitespace = exports.toBeWhitespace = function toBeWhitespace(actual) {
  return toBeString(actual) && actual.search(/\S/) === -1;
};

var toBeWholeNumber = exports.toBeWholeNumber = function toBeWholeNumber(actual) {
  return toBeNumber(actual) && (actual === 0 || actual % 1 === 0);
};

var toBeWithinRange = exports.toBeWithinRange = function toBeWithinRange(floor, ceiling, actual) {
  return toBeNumber(actual) && actual >= floor && actual <= ceiling;
};

var toEndWith = exports.toEndWith = function toEndWith(subString, actual) {
  return toBeNonEmptyString(actual) && toBeNonEmptyString(subString) && actual.slice(actual.length - subString.length, actual.length) === subString;
};

var toHaveArray = exports.toHaveArray = memberMatcherFor(toBeArray);

var toHaveArrayOfBooleans = exports.toHaveArrayOfBooleans = memberMatcherFor(toBeArrayOfBooleans);

var toHaveArrayOfNumbers = exports.toHaveArrayOfNumbers = memberMatcherFor(toBeArrayOfNumbers);

var toHaveArrayOfObjects = exports.toHaveArrayOfObjects = memberMatcherFor(toBeArrayOfObjects);

var toHaveArrayOfSize = exports.toHaveArrayOfSize = function toHaveArrayOfSize(key, size, actual) {
  return toBeObject(actual) && toBeArrayOfSize(size, actual[key]);
};

var toHaveArrayOfStrings = exports.toHaveArrayOfStrings = memberMatcherFor(toBeArrayOfStrings);

var toHaveBoolean = exports.toHaveBoolean = memberMatcherFor(toBeBoolean);

var toHaveCalculable = exports.toHaveCalculable = memberMatcherFor(toBeCalculable);

var toHaveDate = exports.toHaveDate = memberMatcherFor(toBeDate);

var toHaveDateAfter = exports.toHaveDateAfter = function toHaveDateAfter(key, date, actual) {
  return toBeObject(actual) && toBeAfter(date, actual[key]);
};

var toHaveDateBefore = exports.toHaveDateBefore = function toHaveDateBefore(key, date, actual) {
  return toBeObject(actual) && toBeBefore(date, actual[key]);
};

var toHaveEmptyArray = exports.toHaveEmptyArray = memberMatcherFor(toBeEmptyArray);

var toHaveEmptyObject = exports.toHaveEmptyObject = memberMatcherFor(toBeEmptyObject);

var toHaveEmptyString = exports.toHaveEmptyString = memberMatcherFor(toBeEmptyString);

var toHaveEvenNumber = exports.toHaveEvenNumber = memberMatcherFor(toBeEvenNumber);

var toHaveFalse = exports.toHaveFalse = memberMatcherFor(toBeFalse);

var toHaveHtmlString = exports.toHaveHtmlString = memberMatcherFor(toBeHtmlString);

var toHaveIso8601 = exports.toHaveIso8601 = memberMatcherFor(toBeIso8601);

var toHaveJsonString = exports.toHaveJsonString = memberMatcherFor(toBeJsonString);

var toHaveMember = exports.toHaveMember = function toHaveMember(key, actual) {
  return toBeString(key) && toBeObject(actual) && key in actual;
};

var toHaveMethod = exports.toHaveMethod = memberMatcherFor(toBeFunction);

var toHaveNonEmptyArray = exports.toHaveNonEmptyArray = memberMatcherFor(toBeNonEmptyArray);

var toHaveNonEmptyObject = exports.toHaveNonEmptyObject = memberMatcherFor(toBeNonEmptyObject);

var toHaveNonEmptyString = exports.toHaveNonEmptyString = memberMatcherFor(toBeNonEmptyString);

var toHaveNumber = exports.toHaveNumber = memberMatcherFor(toBeNumber);

var toHaveNumberWithinRange = exports.toHaveNumberWithinRange = function toHaveNumberWithinRange(key, floor, ceiling, actual) {
  return toBeObject(actual) && toBeWithinRange(floor, ceiling, actual[key]);
};

var toHaveObject = exports.toHaveObject = memberMatcherFor(toBeObject);

var toHaveOddNumber = exports.toHaveOddNumber = memberMatcherFor(toBeOddNumber);

var toHaveString = exports.toHaveString = memberMatcherFor(toBeString);

var toHaveStringLongerThan = exports.toHaveStringLongerThan = function toHaveStringLongerThan(key, other, actual) {
  return toBeObject(actual) && toBeLongerThan(other, actual[key]);
};

var toHaveStringSameLengthAs = exports.toHaveStringSameLengthAs = function toHaveStringSameLengthAs(key, other, actual) {
  return toBeObject(actual) && toBeSameLengthAs(other, actual[key]);
};

var toHaveStringShorterThan = exports.toHaveStringShorterThan = function toHaveStringShorterThan(key, other, actual) {
  return toBeObject(actual) && toBeShorterThan(other, actual[key]);
};

var toHaveTrue = exports.toHaveTrue = memberMatcherFor(toBeTrue);

var toHaveUndefined = exports.toHaveUndefined = function toHaveUndefined(key, actual) {
  return toBeObject(actual) && toHaveMember(key, actual) && typeof actual[key] === 'undefined';
};

var toHaveWhitespaceString = exports.toHaveWhitespaceString = memberMatcherFor(toBeWhitespace);

var toHaveWholeNumber = exports.toHaveWholeNumber = memberMatcherFor(toBeWholeNumber);

var toStartWith = exports.toStartWith = function toStartWith(subString, actual) {
  return toBeNonEmptyString(actual) && toBeNonEmptyString(subString) && actual.slice(0, subString.length) === subString;
};

var toThrowAnyError = exports.toThrowAnyError = function toThrowAnyError(actual) {
  try {
    actual();
    return false;
  } catch (err) {
    return true;
  }
};

var toThrowErrorOfType = exports.toThrowErrorOfType = function toThrowErrorOfType(type, actual) {
  try {
    actual();
    return false;
  } catch (err) {
    return err.name === type;
  }
};

},{}]},{},[11]);
