(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// public
module.exports = require('./src');

},{"./src":10}],2:[function(require,module,exports){
'use strict';

module.exports = require('./src');

},{"./src":3}],3:[function(require,module,exports){
'use strict';

var adapters = typeof jasmine.addMatchers === 'function' ?
    require('./jasmine-v2') :
    require('./jasmine-v1');

module.exports = {
    add: addMatchers
};

function addMatchers(matchers) {
    for (var matcherName in matchers) {
        addMatcher(matcherName, matchers[matcherName]);
    }
}

function addMatcher(name, matcher) {
    var adapter = adapters[matcher.length];
    return adapter(name, matcher);
}

},{"./jasmine-v1":4,"./jasmine-v2":5}],4:[function(require,module,exports){
'use strict';

module.exports = {
    1: createFactory(forActual),
    2: createFactory(forActualAndExpected),
    3: createFactory(forActualAndTwoExpected),
    4: createFactory(forKeyAndActualAndTwoExpected)
};

function createFactory(adapter) {
    return function jasmineV1MatcherFactory(name, matcher) {
        var matcherByName = new JasmineV1Matcher(name, adapter, matcher);
        beforeEach(function() {
            this.addMatchers(matcherByName);
        });
        return matcherByName;
    };
}

function JasmineV1Matcher(name, adapter, matcher) {
    this[name] = adapter(name, matcher);
}

function forActual(name, matcher) {
    return function(optionalMessage) {
        return matcher(this.actual, optionalMessage);
    };
}

function forActualAndExpected(name, matcher) {
    return function(expected, optionalMessage) {
        return matcher(expected, this.actual, optionalMessage);
    };
}

function forActualAndTwoExpected(name, matcher) {
    return function(expected1, expected2, optionalMessage) {
        return matcher(expected1, expected2, this.actual, optionalMessage);
    };
}

function forKeyAndActualAndTwoExpected(name, matcher) {
    return function(key, expected1, expected2, optionalMessage) {
        return matcher(key, expected1, expected2, this.actual, optionalMessage);
    };
}

},{}],5:[function(require,module,exports){
'use strict';

var matcherFactory = require('./matcherFactory');
var memberMatcherFactory = require('./memberMatcherFactory');

module.exports = {
    1: createFactory(getAdapter(1)),
    2: createFactory(getAdapter(2)),
    3: createFactory(getAdapter(3)),
    4: createFactory(getAdapter(4))
};

function createFactory(adapter) {
    return function jasmineV2MatcherFactory(name, matcher) {
        var matcherByName = new JasmineV2Matcher(name, adapter, matcher);
        beforeEach(function() {
            jasmine.addMatchers(matcherByName);
        });
        return matcherByName;
    };
}

function JasmineV2Matcher(name, adapter, matcher) {
    this[name] = adapter(name, matcher);
}

function getAdapter(argsCount) {
    return function adapter(name, matcher) {
        var factory = isMemberMatcher(name) ? memberMatcherFactory : matcherFactory;
        return factory[argsCount](name, matcher);
    };
}

function isMemberMatcher(name) {
    return name.search(/^toHave/) !== -1;
}

},{"./matcherFactory":6,"./memberMatcherFactory":7}],6:[function(require,module,exports){
'use strict';

module.exports = {
    1: forActual,
    2: forActualAndExpected,
    3: forActualAndTwoExpected
};

function forActual(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, optionalMessage) {
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
    return function(util) {
        return {
            compare: function(actual, expected, optionalMessage) {
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
    return function(util) {
        return {
            compare: function(actual, expected1, expected2, optionalMessage) {
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
'use strict';

module.exports = {
    2: forKeyAndActual,
    3: forKeyAndActualAndExpected,
    4: forKeyAndActualAndTwoExpected
};

function forKeyAndActual(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, key, optionalMessage) {
                var passes = matcher(key, actual);
                var message = name.search(/^toHave/) !== -1 ? key : optionalMessage;
                return {
                    pass: passes,
                    message: (
                        message ?
                        util.buildFailureMessage(name, passes, actual, message) :
                        util.buildFailureMessage(name, passes, actual)
                    )
                };
            }
        };
    };
}

function forKeyAndActualAndExpected(name, matcher) {
    return function(util) {
        return {
            compare: function(actual, key, expected, optionalMessage) {
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
    return function(util) {
        return {
            compare: function(actual, key, expected1, expected2, optionalMessage) {
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
// public
module.exports = {
    asymmetricMatcher: [{
            name: 'after',
            matcher: 'toBeAfter'
        }, {
            name: 'arrayOfBooleans',
            matcher: 'toBeArrayOfBooleans'
        }, {
            name: 'arrayOfNumbers',
            matcher: 'toBeArrayOfNumbers'
        }, {
            name: 'arrayOfObjects',
            matcher: 'toBeArrayOfObjects'
        }, {
            name: 'arrayOfSize',
            matcher: 'toBeArrayOfSize'
        }, {
            name: 'arrayOfStrings',
            matcher: 'toBeArrayOfStrings'
        }, {
            name: 'before',
            matcher: 'toBeBefore'
        }, {
            name: 'calculable',
            matcher: 'toBeCalculable'
        }, {
            name: 'emptyArray',
            matcher: 'toBeEmptyArray'
        }, {
            name: 'emptyObject',
            matcher: 'toBeEmptyObject'
        }, {
            name: 'evenNumber',
            matcher: 'toBeEvenNumber'
        }, {
            name: 'greaterThanOrEqualTo',
            matcher: 'toBeGreaterThanOrEqualTo'
        }, {
            name: 'iso8601',
            matcher: 'toBeIso8601'
        }, {
            name: 'jsonString',
            matcher: 'toBeJsonString'
        }, {
            name: 'lessThanOrEqualTo',
            matcher: 'toBeLessThanOrEqualTo'
        }, {
            name: 'longerThan',
            matcher: 'toBeLongerThan'
        }, {
            name: 'nonEmptyArray',
            matcher: 'toBeNonEmptyArray'
        }, {
            name: 'nonEmptyObject',
            matcher: 'toBeNonEmptyObject'
        }, {
            name: 'nonEmptyString',
            matcher: 'toBeNonEmptyString'
        }, {
            name: 'oddNumber',
            matcher: 'toBeOddNumber'
        }, {
            name: 'sameLengthAs',
            matcher: 'toBeSameLengthAs'
        }, {
            name: 'shorterThan',
            matcher: 'toBeShorterThan'
        }, {
            name: 'whitespace',
            matcher: 'toBeWhitespace'
        }, {
            name: 'wholeNumber',
            matcher: 'toBeWholeNumber'
        }, {
            name: 'withinRange',
            matcher: 'toBeWithinRange'
        }, {
            name: 'endingWith',
            matcher: 'toEndWith'
        }, {
            name: 'startingWith',
            matcher: 'toStartWith'
        }],
    matcher: {
        toBeAfter: require('./toBeAfter'),
        toBeArray: require('./toBeArray'),
        toBeArrayOfBooleans: require('./toBeArrayOfBooleans'),
        toBeArrayOfNumbers: require('./toBeArrayOfNumbers'),
        toBeArrayOfObjects: require('./toBeArrayOfObjects'),
        toBeArrayOfSize: require('./toBeArrayOfSize'),
        toBeArrayOfStrings: require('./toBeArrayOfStrings'),
        toBeBefore: require('./toBeBefore'),
        toBeBoolean: require('./toBeBoolean'),
        toBeCalculable: require('./toBeCalculable'),
        toBeDate: require('./toBeDate'),
        toBeEmptyArray: require('./toBeEmptyArray'),
        toBeEmptyObject: require('./toBeEmptyObject'),
        toBeEmptyString: require('./toBeEmptyString'),
        toBeEvenNumber: require('./toBeEvenNumber'),
        toBeFalse: require('./toBeFalse'),
        toBeFunction: require('./toBeFunction'),
        toBeGreaterThanOrEqualTo: require('./toBeGreaterThanOrEqualTo'),
        toBeHtmlString: require('./toBeHtmlString'),
        toBeIso8601: require('./toBeIso8601'),
        toBeJsonString: require('./toBeJsonString'),
        toBeLessThanOrEqualTo: require('./toBeLessThanOrEqualTo'),
        toBeLongerThan: require('./toBeLongerThan'),
        toBeNonEmptyArray: require('./toBeNonEmptyArray'),
        toBeNonEmptyObject: require('./toBeNonEmptyObject'),
        toBeNonEmptyString: require('./toBeNonEmptyString'),
        toBeNumber: require('./toBeNumber'),
        toBeObject: require('./toBeObject'),
        toBeOddNumber: require('./toBeOddNumber'),
        toBeSameLengthAs: require('./toBeSameLengthAs'),
        toBeShorterThan: require('./toBeShorterThan'),
        toBeString: require('./toBeString'),
        toBeTrue: require('./toBeTrue'),
        toBeWhitespace: require('./toBeWhitespace'),
        toBeWholeNumber: require('./toBeWholeNumber'),
        toBeWithinRange: require('./toBeWithinRange'),
        toEndWith: require('./toEndWith'),
        toHaveArray: require('./toHaveArray'),
        toHaveArrayOfBooleans: require('./toHaveArrayOfBooleans'),
        toHaveArrayOfNumbers: require('./toHaveArrayOfNumbers'),
        toHaveArrayOfObjects: require('./toHaveArrayOfObjects'),
        toHaveArrayOfSize: require('./toHaveArrayOfSize'),
        toHaveArrayOfStrings: require('./toHaveArrayOfStrings'),
        toHaveBoolean: require('./toHaveBoolean'),
        toHaveCalculable: require('./toHaveCalculable'),
        toHaveDate: require('./toHaveDate'),
        toHaveDateAfter: require('./toHaveDateAfter'),
        toHaveDateBefore: require('./toHaveDateBefore'),
        toHaveEmptyArray: require('./toHaveEmptyArray'),
        toHaveEmptyObject: require('./toHaveEmptyObject'),
        toHaveEmptyString: require('./toHaveEmptyString'),
        toHaveEvenNumber: require('./toHaveEvenNumber'),
        toHaveFalse: require('./toHaveFalse'),
        toHaveHtmlString: require('./toHaveHtmlString'),
        toHaveIso8601: require('./toHaveIso8601'),
        toHaveJsonString: require('./toHaveJsonString'),
        toHaveMember: require('./toHaveMember'),
        toHaveMethod: require('./toHaveMethod'),
        toHaveNonEmptyArray: require('./toHaveNonEmptyArray'),
        toHaveNonEmptyObject: require('./toHaveNonEmptyObject'),
        toHaveNonEmptyString: require('./toHaveNonEmptyString'),
        toHaveNumber: require('./toHaveNumber'),
        toHaveNumberWithinRange: require('./toHaveNumberWithinRange'),
        toHaveObject: require('./toHaveObject'),
        toHaveOddNumber: require('./toHaveOddNumber'),
        toHaveString: require('./toHaveString'),
        toHaveStringLongerThan: require('./toHaveStringLongerThan'),
        toHaveStringSameLengthAs: require('./toHaveStringSameLengthAs'),
        toHaveStringShorterThan: require('./toHaveStringShorterThan'),
        toHaveTrue: require('./toHaveTrue'),
        toHaveWhitespaceString: require('./toHaveWhitespaceString'),
        toHaveWholeNumber: require('./toHaveWholeNumber'),
        toStartWith: require('./toStartWith'),
        toThrowAnyError: require('./toThrowAnyError'),
        toThrowErrorOfType: require('./toThrowErrorOfType')
    }
};

},{"./toBeAfter":16,"./toBeArray":17,"./toBeArrayOfBooleans":18,"./toBeArrayOfNumbers":19,"./toBeArrayOfObjects":20,"./toBeArrayOfSize":21,"./toBeArrayOfStrings":22,"./toBeBefore":23,"./toBeBoolean":24,"./toBeCalculable":25,"./toBeDate":26,"./toBeEmptyArray":27,"./toBeEmptyObject":28,"./toBeEmptyString":29,"./toBeEvenNumber":30,"./toBeFalse":31,"./toBeFunction":32,"./toBeGreaterThanOrEqualTo":33,"./toBeHtmlString":34,"./toBeIso8601":35,"./toBeJsonString":36,"./toBeLessThanOrEqualTo":37,"./toBeLongerThan":38,"./toBeNonEmptyArray":39,"./toBeNonEmptyObject":40,"./toBeNonEmptyString":41,"./toBeNumber":42,"./toBeObject":43,"./toBeOddNumber":44,"./toBeSameLengthAs":45,"./toBeShorterThan":46,"./toBeString":47,"./toBeTrue":48,"./toBeWhitespace":49,"./toBeWholeNumber":50,"./toBeWithinRange":51,"./toEndWith":52,"./toHaveArray":53,"./toHaveArrayOfBooleans":54,"./toHaveArrayOfNumbers":55,"./toHaveArrayOfObjects":56,"./toHaveArrayOfSize":57,"./toHaveArrayOfStrings":58,"./toHaveBoolean":59,"./toHaveCalculable":60,"./toHaveDate":61,"./toHaveDateAfter":62,"./toHaveDateBefore":63,"./toHaveEmptyArray":64,"./toHaveEmptyObject":65,"./toHaveEmptyString":66,"./toHaveEvenNumber":67,"./toHaveFalse":68,"./toHaveHtmlString":69,"./toHaveIso8601":70,"./toHaveJsonString":71,"./toHaveMember":72,"./toHaveMethod":73,"./toHaveNonEmptyArray":74,"./toHaveNonEmptyObject":75,"./toHaveNonEmptyString":76,"./toHaveNumber":77,"./toHaveNumberWithinRange":78,"./toHaveObject":79,"./toHaveOddNumber":80,"./toHaveString":81,"./toHaveStringLongerThan":82,"./toHaveStringSameLengthAs":83,"./toHaveStringShorterThan":84,"./toHaveTrue":85,"./toHaveWhitespaceString":86,"./toHaveWholeNumber":87,"./toStartWith":88,"./toThrowAnyError":89,"./toThrowErrorOfType":90}],9:[function(require,module,exports){
// modules
var reduce = require('./lib/reduce');
var api = require('./api');
// public
module.exports = reduce(api.asymmetricMatcher, register, {});
// implementation
function register(any, asymMatcher) {
    var matcher = api.matcher[asymMatcher.matcher];
    any[asymMatcher.name] = createFactory(matcher);
    return any;
}
function createFactory(matcher) {
    return function asymmetricMatcherFactory() {
        var args = [].slice.call(arguments);
        return {
            asymmetricMatch: function asymmetricMatcher(actual) {
                var clone = args.slice();
                clone.push(actual);
                return matcher.apply(this, clone);
            }
        };
    };
}

},{"./api":8,"./lib/reduce":15}],10:[function(require,module,exports){
(function (global){
// 3rd party modules
var loader = require('jasmine-matchers-loader');
// modules
var api = require('./api');
var asymmetricMatchers = require('./asymmetricMatchers');
// public
module.exports = api.matcher;
// implementation
loader.add(api.matcher);
global.any = asymmetricMatchers;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./api":8,"./asymmetricMatchers":9,"jasmine-matchers-loader":2}],11:[function(require,module,exports){
// public
module.exports = function every(array, truthTest) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (truthTest(array[i])) {
            return true;
        }
    }
    return false;
};

},{}],12:[function(require,module,exports){
// public
module.exports = function every(array, truthTest) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (!truthTest(array[i])) {
            return false;
        }
    }
    return true;
};

},{}],13:[function(require,module,exports){
// public
module.exports = function is(value, type) {
    return Object.prototype.toString.call(value) === '[object ' + type + ']';
};

},{}],14:[function(require,module,exports){
// modules
var reduce = require('./reduce');
// public
module.exports = function keys(object) {
    return reduce(object, appendKey, []);
};
function appendKey(keys, value, key) {
    return keys.concat(key);
}

},{"./reduce":15}],15:[function(require,module,exports){
// modules
var is = require('./is');
// public
module.exports = function reduce(collection, fn, memo) {
    if (is(collection, 'Array')) {
        for (var i = 0, len = collection.length; i < len; i++) {
            memo = fn(memo, collection[i], i, collection);
        }
    }
    else {
        for (var key in collection) {
            if ({}.hasOwnProperty.call(collection, key)) {
                memo = fn(memo, collection[key], key, collection);
            }
        }
    }
    return memo;
};

},{"./is":13}],16:[function(require,module,exports){
// modules
var toBeBefore = require('./toBeBefore');
// public
module.exports = function toBeAfter(otherDate, actual) {
    return toBeBefore(actual, otherDate);
};

},{"./toBeBefore":23}],17:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeArray(actual) {
    return is(actual, 'Array');
};

},{"./lib/is":13}],18:[function(require,module,exports){
// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeBoolean = require('./toBeBoolean');
// public
module.exports = function toBeArrayOfBooleans(actual) {
    return toBeArray(actual) && every(actual, toBeBoolean);
};

},{"./lib/every":12,"./toBeArray":17,"./toBeBoolean":24}],19:[function(require,module,exports){
// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeNumber = require('./toBeNumber');
// public
module.exports = function toBeArrayOfNumbers(actual) {
    return toBeArray(actual) && every(actual, toBeNumber);
};

},{"./lib/every":12,"./toBeArray":17,"./toBeNumber":42}],20:[function(require,module,exports){
// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeObject = require('./toBeObject');
// public
module.exports = function toBeArrayOfObjects(actual) {
    return toBeArray(actual) && every(actual, toBeObject);
};

},{"./lib/every":12,"./toBeArray":17,"./toBeObject":43}],21:[function(require,module,exports){
// modules
var toBeArray = require('./toBeArray');
// public
module.exports = function toBeArrayOfSize(size, actual) {
    return toBeArray(actual) && actual.length === size;
};

},{"./toBeArray":17}],22:[function(require,module,exports){
// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeString = require('./toBeString');
// public
module.exports = function toBeArrayOfStrings(actual) {
    return toBeArray(actual) && every(actual, toBeString);
};

},{"./lib/every":12,"./toBeArray":17,"./toBeString":47}],23:[function(require,module,exports){
// modules
var toBeDate = require('./toBeDate');
// public
module.exports = function toBeBefore(otherDate, actual) {
    return toBeDate(actual) && toBeDate(otherDate) && actual.getTime() < otherDate.getTime();
};

},{"./toBeDate":26}],24:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeBoolean(actual) {
    return is(actual, 'Boolean');
};

},{"./lib/is":13}],25:[function(require,module,exports){
// public
module.exports = function toBeCalculable(actual) {
    // Assert subject can be used in Mathemetic calculations despite not being a
    // Number, for example `"1" * "2" === 2` whereas `"wut?" * 2 === NaN`.
    return !isNaN(actual * 2);
};

},{}],26:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeDate(actual) {
    return is(actual, 'Date');
};

},{"./lib/is":13}],27:[function(require,module,exports){
// modules
var toBeArrayOfSize = require('./toBeArrayOfSize');
// public
module.exports = function toBeEmptyArray(actual) {
    return toBeArrayOfSize(0, actual);
};

},{"./toBeArrayOfSize":21}],28:[function(require,module,exports){
// modules
var is = require('./lib/is');
var keys = require('./lib/keys');
// public
module.exports = function toBeEmptyObject(actual) {
    return is(actual, 'Object') && keys(actual).length === 0;
};

},{"./lib/is":13,"./lib/keys":14}],29:[function(require,module,exports){
// public
module.exports = function toBeEmptyString(actual) {
    return actual === '';
};

},{}],30:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');
// public
module.exports = function toBeEvenNumber(actual) {
    return toBeNumber(actual) && actual % 2 === 0;
};

},{"./toBeNumber":42}],31:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeFalse(actual) {
    return actual === false || (is(actual, 'Boolean') && actual.valueOf() === false);
};

},{"./lib/is":13}],32:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeFunction(actual) {
    return is(actual, 'Function');
};

},{"./lib/is":13}],33:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');
// public
module.exports = function toBeGreaterThanOrEqualTo(otherNumber, actual) {
    return toBeNumber(actual) && actual >= otherNumber;
};

},{"./toBeNumber":42}],34:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');
// public
module.exports = function toBeHtmlString(actual) {
    // <           start with opening tag "<"
    //  (          start group 1
    //    "[^"]*"  allow string in "double quotes"
    //    |        OR
    //    '[^']*'  allow string in "single quotes"
    //    |        OR
    //    [^'">]   cant contains one single quotes, double quotes and ">"
    //  )          end group 1
    //  *          0 or more
    // >           end with closing tag ">"
    return toBeString(actual) && actual.search(/<("[^"]*"|'[^']*'|[^'">])*>/) !== -1;
};

},{"./toBeString":47}],35:[function(require,module,exports){
// modules
var any = require('./lib/any');
var toBeString = require('./toBeString');
// public
module.exports = function toBeIso8601(actual) {
    return toBeString(actual) && any(patterns, matches) && new Date(actual).toString() !== 'Invalid Date';
    function matches(pattern) {
        var regex = '^' + expand(pattern) + '$';
        return actual.search(new RegExp(regex)) !== -1;
    }
};
// implementation
var patterns = [
    'nnnn-nn-nn',
    'nnnn-nn-nnTnn:nn',
    'nnnn-nn-nnTnn:nn:nn',
    'nnnn-nn-nnTnn:nn:nn.nnn',
    'nnnn-nn-nnTnn:nn:nn.nnnZ'
];
function expand(pattern) {
    return pattern
        .split('-').join('\\-')
        .split('.').join('\\.')
        .split('nnnn').join('([0-9]{4})')
        .split('nnn').join('([0-9]{3})')
        .split('nn').join('([0-9]{2})');
}

},{"./lib/any":11,"./toBeString":47}],36:[function(require,module,exports){
// public
module.exports = function toBeJsonString(actual) {
    try {
        return JSON.parse(actual) !== null;
    }
    catch (err) {
        return false;
    }
};

},{}],37:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');
// public
module.exports = function toBeLessThanOrEqualTo(otherNumber, actual) {
    return toBeNumber(actual) && actual <= otherNumber;
};

},{"./toBeNumber":42}],38:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');
// public
module.exports = function toBeLongerThan(otherString, actual) {
    return toBeString(actual) && toBeString(otherString) && actual.length > otherString.length;
};

},{"./toBeString":47}],39:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeNonEmptyArray(actual) {
    return is(actual, 'Array') && actual.length > 0;
};

},{"./lib/is":13}],40:[function(require,module,exports){
// modules
var is = require('./lib/is');
var keys = require('./lib/keys');
// public
module.exports = function toBeNonEmptyObject(actual) {
    return is(actual, 'Object') && keys(actual).length > 0;
};

},{"./lib/is":13,"./lib/keys":14}],41:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');
// public
module.exports = function toBeNonEmptyString(actual) {
    return toBeString(actual) && actual.length > 0;
};

},{"./toBeString":47}],42:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeNumber(actual) {
    return !isNaN(parseFloat(actual)) && !is(actual, 'String');
};

},{"./lib/is":13}],43:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeObject(actual) {
    return is(actual, 'Object');
};

},{"./lib/is":13}],44:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');
// public
module.exports = function toBeOddNumber(actual) {
    return toBeNumber(actual) && actual % 2 !== 0;
};

},{"./toBeNumber":42}],45:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');
// public
module.exports = function toBeSameLengthAs(otherString, actual) {
    return toBeString(actual) && toBeString(otherString) && actual.length === otherString.length;
};

},{"./toBeString":47}],46:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');
// public
module.exports = function toBeShorterThan(otherString, actual) {
    return toBeString(actual) && toBeString(otherString) && actual.length < otherString.length;
};

},{"./toBeString":47}],47:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeString(actual) {
    return is(actual, 'String');
};

},{"./lib/is":13}],48:[function(require,module,exports){
// modules
var is = require('./lib/is');
// public
module.exports = function toBeTrue(actual) {
    return actual === true || (is(actual, 'Boolean') && actual.valueOf() === true);
};

},{"./lib/is":13}],49:[function(require,module,exports){
// modules
var toBeString = require('./toBeString');
// public
module.exports = function toBeWhitespace(actual) {
    return toBeString(actual) && actual.search(/\S/) === -1;
};

},{"./toBeString":47}],50:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');
// public
module.exports = function toBeWholeNumber(actual) {
    return toBeNumber(actual) && (actual === 0 || actual % 1 === 0);
};

},{"./toBeNumber":42}],51:[function(require,module,exports){
// modules
var toBeNumber = require('./toBeNumber');
// public
module.exports = function toBeWithinRange(floor, ceiling, actual) {
    return toBeNumber(actual) && actual >= floor && actual <= ceiling;
};

},{"./toBeNumber":42}],52:[function(require,module,exports){
// modules
var toBeNonEmptyString = require('./toBeNonEmptyString');
// public
module.exports = function toEndWith(subString, actual) {
    if (!toBeNonEmptyString(actual) || !toBeNonEmptyString(subString)) {
        return false;
    }
    return actual.slice(actual.length - subString.length, actual.length) === subString;
};

},{"./toBeNonEmptyString":41}],53:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArray = require('./toBeArray');
// public
module.exports = function toHaveArray(key, actual) {
    return toBeObject(actual) && toBeArray(actual[key]);
};

},{"./toBeArray":17,"./toBeObject":43}],54:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfBooleans = require('./toBeArrayOfBooleans');
// public
module.exports = function toHaveArrayOfBooleans(key, actual) {
    return toBeObject(actual) && toBeArrayOfBooleans(actual[key]);
};

},{"./toBeArrayOfBooleans":18,"./toBeObject":43}],55:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfNumbers = require('./toBeArrayOfNumbers');
// public
module.exports = function toHaveArrayOfNumbers(key, actual) {
    return toBeObject(actual) && toBeArrayOfNumbers(actual[key]);
};

},{"./toBeArrayOfNumbers":19,"./toBeObject":43}],56:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfObjects = require('./toBeArrayOfObjects');
// public
module.exports = function toHaveArrayOfObjects(key, actual) {
    return toBeObject(actual) && toBeArrayOfObjects(actual[key]);
};

},{"./toBeArrayOfObjects":20,"./toBeObject":43}],57:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfSize = require('./toBeArrayOfSize');
// public
module.exports = function toHaveArrayOfSize(key, size, actual) {
    return toBeObject(actual) && toBeArrayOfSize(size, actual[key]);
};

},{"./toBeArrayOfSize":21,"./toBeObject":43}],58:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfStrings = require('./toBeArrayOfStrings');
// public
module.exports = function toHaveArrayOfStrings(key, actual) {
    return toBeObject(actual) && toBeArrayOfStrings(actual[key]);
};

},{"./toBeArrayOfStrings":22,"./toBeObject":43}],59:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeBoolean = require('./toBeBoolean');
// public
module.exports = function toHaveBoolean(key, actual) {
    return toBeObject(actual) && toBeBoolean(actual[key]);
};

},{"./toBeBoolean":24,"./toBeObject":43}],60:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeCalculable = require('./toBeCalculable');
// public
module.exports = function toHaveCalculable(key, actual) {
    return toBeObject(actual) && toBeCalculable(actual[key]);
};

},{"./toBeCalculable":25,"./toBeObject":43}],61:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeDate = require('./toBeDate');
// public
module.exports = function toHaveDate(key, actual) {
    return toBeObject(actual) && toBeDate(actual[key]);
};

},{"./toBeDate":26,"./toBeObject":43}],62:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeAfter = require('./toBeAfter');
// public
module.exports = function toHaveDateAfter(key, date, actual) {
    return toBeObject(actual) && toBeAfter(date, actual[key]);
};

},{"./toBeAfter":16,"./toBeObject":43}],63:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeBefore = require('./toBeBefore');
// public
module.exports = function toHaveDateBefore(key, date, actual) {
    return toBeObject(actual) && toBeBefore(date, actual[key]);
};

},{"./toBeBefore":23,"./toBeObject":43}],64:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeEmptyArray = require('./toBeEmptyArray');
// public
module.exports = function toHaveEmptyArray(key, actual) {
    return toBeObject(actual) && toBeEmptyArray(actual[key]);
};

},{"./toBeEmptyArray":27,"./toBeObject":43}],65:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeEmptyObject = require('./toBeEmptyObject');
// public
module.exports = function toHaveEmptyObject(key, actual) {
    return toBeObject(actual) && toBeEmptyObject(actual[key]);
};

},{"./toBeEmptyObject":28,"./toBeObject":43}],66:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeEmptyString = require('./toBeEmptyString');
// public
module.exports = function toHaveEmptyString(key, actual) {
    return toBeObject(actual) && toBeEmptyString(actual[key]);
};

},{"./toBeEmptyString":29,"./toBeObject":43}],67:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeEvenNumber = require('./toBeEvenNumber');
// public
module.exports = function toHaveEvenNumber(key, actual) {
    return toBeObject(actual) && toBeEvenNumber(actual[key]);
};

},{"./toBeEvenNumber":30,"./toBeObject":43}],68:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeFalse = require('./toBeFalse');
// public
module.exports = function toHaveFalse(key, actual) {
    return toBeObject(actual) && toBeFalse(actual[key]);
};

},{"./toBeFalse":31,"./toBeObject":43}],69:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeHtmlString = require('./toBeHtmlString');
// public
module.exports = function toHaveHtmlString(key, actual) {
    return toBeObject(actual) && toBeHtmlString(actual[key]);
};

},{"./toBeHtmlString":34,"./toBeObject":43}],70:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeIso8601 = require('./toBeIso8601');
// public
module.exports = function toHaveIso8601(key, actual) {
    return toBeObject(actual) && toBeIso8601(actual[key]);
};

},{"./toBeIso8601":35,"./toBeObject":43}],71:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeJsonString = require('./toBeJsonString');
// public
module.exports = function toHaveJsonString(key, actual) {
    return toBeObject(actual) && toBeJsonString(actual[key]);
};

},{"./toBeJsonString":36,"./toBeObject":43}],72:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeString = require('./toBeString');
// public
module.exports = function toHaveMember(key, actual) {
    return toBeString(key) && toBeObject(actual) && key in actual;
};

},{"./toBeObject":43,"./toBeString":47}],73:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeFunction = require('./toBeFunction');
// public
module.exports = function toHaveMethod(key, actual) {
    return toBeObject(actual) && toBeFunction(actual[key]);
};

},{"./toBeFunction":32,"./toBeObject":43}],74:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyArray = require('./toBeNonEmptyArray');
// public
module.exports = function toHaveNonEmptyArray(key, actual) {
    return toBeObject(actual) && toBeNonEmptyArray(actual[key]);
};

},{"./toBeNonEmptyArray":39,"./toBeObject":43}],75:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyObject = require('./toBeNonEmptyObject');
// public
module.exports = function toHaveNonEmptyObject(key, actual) {
    return toBeObject(actual) && toBeNonEmptyObject(actual[key]);
};

},{"./toBeNonEmptyObject":40,"./toBeObject":43}],76:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyString = require('./toBeNonEmptyString');
// public
module.exports = function toHaveNonEmptyString(key, actual) {
    return toBeObject(actual) && toBeNonEmptyString(actual[key]);
};

},{"./toBeNonEmptyString":41,"./toBeObject":43}],77:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeNumber = require('./toBeNumber');
// public
module.exports = function toHaveNumber(key, actual) {
    return toBeObject(actual) && toBeNumber(actual[key]);
};

},{"./toBeNumber":42,"./toBeObject":43}],78:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeWithinRange = require('./toBeWithinRange');
// public
module.exports = function toHaveNumberWithinRange(key, floor, ceiling, actual) {
    return toBeObject(actual) && toBeWithinRange(floor, ceiling, actual[key]);
};

},{"./toBeObject":43,"./toBeWithinRange":51}],79:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
// public
module.exports = function toHaveObject(key, actual) {
    return toBeObject(actual) && toBeObject(actual[key]);
};

},{"./toBeObject":43}],80:[function(require,module,exports){
var toBeObject = require('./toBeObject');
var toBeOddNumber = require('./toBeOddNumber');
// public
module.exports = function toHaveOddNumber(key, actual) {
    return toBeObject(actual) && toBeOddNumber(actual[key]);
};

},{"./toBeObject":43,"./toBeOddNumber":44}],81:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeString = require('./toBeString');
// public
module.exports = function toHaveString(key, actual) {
    return toBeObject(actual) && toBeString(actual[key]);
};

},{"./toBeObject":43,"./toBeString":47}],82:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeLongerThan = require('./toBeLongerThan');
// public
module.exports = function toHaveStringLongerThan(key, other, actual) {
    return toBeObject(actual) && toBeLongerThan(other, actual[key]);
};

},{"./toBeLongerThan":38,"./toBeObject":43}],83:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeSameLengthAs = require('./toBeSameLengthAs');
// public
module.exports = function toHaveStringSameLengthAs(key, other, actual) {
    return toBeObject(actual) && toBeSameLengthAs(other, actual[key]);
};

},{"./toBeObject":43,"./toBeSameLengthAs":45}],84:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeShorterThan = require('./toBeShorterThan');
// public
module.exports = function toHaveStringShorterThan(key, other, actual) {
    return toBeObject(actual) && toBeShorterThan(other, actual[key]);
};

},{"./toBeObject":43,"./toBeShorterThan":46}],85:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeTrue = require('./toBeTrue');
// public
module.exports = function toHaveTrue(key, actual) {
    return toBeObject(actual) && toBeTrue(actual[key]);
};

},{"./toBeObject":43,"./toBeTrue":48}],86:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeWhitespace = require('./toBeWhitespace');
// public
module.exports = function toHaveWhitespaceString(key, actual) {
    return toBeObject(actual) && toBeWhitespace(actual[key]);
};

},{"./toBeObject":43,"./toBeWhitespace":49}],87:[function(require,module,exports){
// modules
var toBeObject = require('./toBeObject');
var toBeWholeNumber = require('./toBeWholeNumber');
// public
module.exports = function toHaveWholeNumber(key, actual) {
    return toBeObject(actual) && toBeWholeNumber(actual[key]);
};

},{"./toBeObject":43,"./toBeWholeNumber":50}],88:[function(require,module,exports){
// modules
var toBeNonEmptyString = require('./toBeNonEmptyString');
// public
module.exports = function toStartWith(subString, actual) {
    if (!toBeNonEmptyString(actual) || !toBeNonEmptyString(subString)) {
        return false;
    }
    return actual.slice(0, subString.length) === subString;
};

},{"./toBeNonEmptyString":41}],89:[function(require,module,exports){
// public
module.exports = function toThrowAnyError(actual) {
    try {
        actual();
        return false;
    }
    catch (err) {
        return true;
    }
};

},{}],90:[function(require,module,exports){
// public
module.exports = function toThrowErrorOfType(type, actual) {
    try {
        actual();
        return false;
    }
    catch (err) {
        return err.name === type;
    }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC50cyIsIm5vZGVfbW9kdWxlcy9qYXNtaW5lLW1hdGNoZXJzLWxvYWRlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qYXNtaW5lLW1hdGNoZXJzLWxvYWRlci9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvamFzbWluZS1tYXRjaGVycy1sb2FkZXIvc3JjL2phc21pbmUtdjEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvamFzbWluZS1tYXRjaGVycy1sb2FkZXIvc3JjL2phc21pbmUtdjIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvamFzbWluZS1tYXRjaGVycy1sb2FkZXIvc3JjL2phc21pbmUtdjIvbWF0Y2hlckZhY3RvcnkuanMiLCJub2RlX21vZHVsZXMvamFzbWluZS1tYXRjaGVycy1sb2FkZXIvc3JjL2phc21pbmUtdjIvbWVtYmVyTWF0Y2hlckZhY3RvcnkuanMiLCJzcmMvYXBpLnRzIiwic3JjL2FzeW1tZXRyaWNNYXRjaGVycy50cyIsInNyYy9pbmRleC50cyIsInNyYy9saWIvYW55LnRzIiwic3JjL2xpYi9ldmVyeS50cyIsInNyYy9saWIvaXMudHMiLCJzcmMvbGliL2tleXMudHMiLCJzcmMvbGliL3JlZHVjZS50cyIsInNyYy90b0JlQWZ0ZXIudHMiLCJzcmMvdG9CZUFycmF5LnRzIiwic3JjL3RvQmVBcnJheU9mQm9vbGVhbnMudHMiLCJzcmMvdG9CZUFycmF5T2ZOdW1iZXJzLnRzIiwic3JjL3RvQmVBcnJheU9mT2JqZWN0cy50cyIsInNyYy90b0JlQXJyYXlPZlNpemUudHMiLCJzcmMvdG9CZUFycmF5T2ZTdHJpbmdzLnRzIiwic3JjL3RvQmVCZWZvcmUudHMiLCJzcmMvdG9CZUJvb2xlYW4udHMiLCJzcmMvdG9CZUNhbGN1bGFibGUudHMiLCJzcmMvdG9CZURhdGUudHMiLCJzcmMvdG9CZUVtcHR5QXJyYXkudHMiLCJzcmMvdG9CZUVtcHR5T2JqZWN0LnRzIiwic3JjL3RvQmVFbXB0eVN0cmluZy50cyIsInNyYy90b0JlRXZlbk51bWJlci50cyIsInNyYy90b0JlRmFsc2UudHMiLCJzcmMvdG9CZUZ1bmN0aW9uLnRzIiwic3JjL3RvQmVHcmVhdGVyVGhhbk9yRXF1YWxUby50cyIsInNyYy90b0JlSHRtbFN0cmluZy50cyIsInNyYy90b0JlSXNvODYwMS50cyIsInNyYy90b0JlSnNvblN0cmluZy50cyIsInNyYy90b0JlTGVzc1RoYW5PckVxdWFsVG8udHMiLCJzcmMvdG9CZUxvbmdlclRoYW4udHMiLCJzcmMvdG9CZU5vbkVtcHR5QXJyYXkudHMiLCJzcmMvdG9CZU5vbkVtcHR5T2JqZWN0LnRzIiwic3JjL3RvQmVOb25FbXB0eVN0cmluZy50cyIsInNyYy90b0JlTnVtYmVyLnRzIiwic3JjL3RvQmVPYmplY3QudHMiLCJzcmMvdG9CZU9kZE51bWJlci50cyIsInNyYy90b0JlU2FtZUxlbmd0aEFzLnRzIiwic3JjL3RvQmVTaG9ydGVyVGhhbi50cyIsInNyYy90b0JlU3RyaW5nLnRzIiwic3JjL3RvQmVUcnVlLnRzIiwic3JjL3RvQmVXaGl0ZXNwYWNlLnRzIiwic3JjL3RvQmVXaG9sZU51bWJlci50cyIsInNyYy90b0JlV2l0aGluUmFuZ2UudHMiLCJzcmMvdG9FbmRXaXRoLnRzIiwic3JjL3RvSGF2ZUFycmF5LnRzIiwic3JjL3RvSGF2ZUFycmF5T2ZCb29sZWFucy50cyIsInNyYy90b0hhdmVBcnJheU9mTnVtYmVycy50cyIsInNyYy90b0hhdmVBcnJheU9mT2JqZWN0cy50cyIsInNyYy90b0hhdmVBcnJheU9mU2l6ZS50cyIsInNyYy90b0hhdmVBcnJheU9mU3RyaW5ncy50cyIsInNyYy90b0hhdmVCb29sZWFuLnRzIiwic3JjL3RvSGF2ZUNhbGN1bGFibGUudHMiLCJzcmMvdG9IYXZlRGF0ZS50cyIsInNyYy90b0hhdmVEYXRlQWZ0ZXIudHMiLCJzcmMvdG9IYXZlRGF0ZUJlZm9yZS50cyIsInNyYy90b0hhdmVFbXB0eUFycmF5LnRzIiwic3JjL3RvSGF2ZUVtcHR5T2JqZWN0LnRzIiwic3JjL3RvSGF2ZUVtcHR5U3RyaW5nLnRzIiwic3JjL3RvSGF2ZUV2ZW5OdW1iZXIudHMiLCJzcmMvdG9IYXZlRmFsc2UudHMiLCJzcmMvdG9IYXZlSHRtbFN0cmluZy50cyIsInNyYy90b0hhdmVJc284NjAxLnRzIiwic3JjL3RvSGF2ZUpzb25TdHJpbmcudHMiLCJzcmMvdG9IYXZlTWVtYmVyLnRzIiwic3JjL3RvSGF2ZU1ldGhvZC50cyIsInNyYy90b0hhdmVOb25FbXB0eUFycmF5LnRzIiwic3JjL3RvSGF2ZU5vbkVtcHR5T2JqZWN0LnRzIiwic3JjL3RvSGF2ZU5vbkVtcHR5U3RyaW5nLnRzIiwic3JjL3RvSGF2ZU51bWJlci50cyIsInNyYy90b0hhdmVOdW1iZXJXaXRoaW5SYW5nZS50cyIsInNyYy90b0hhdmVPYmplY3QudHMiLCJzcmMvdG9IYXZlT2RkTnVtYmVyLnRzIiwic3JjL3RvSGF2ZVN0cmluZy50cyIsInNyYy90b0hhdmVTdHJpbmdMb25nZXJUaGFuLnRzIiwic3JjL3RvSGF2ZVN0cmluZ1NhbWVMZW5ndGhBcy50cyIsInNyYy90b0hhdmVTdHJpbmdTaG9ydGVyVGhhbi50cyIsInNyYy90b0hhdmVUcnVlLnRzIiwic3JjL3RvSGF2ZVdoaXRlc3BhY2VTdHJpbmcudHMiLCJzcmMvdG9IYXZlV2hvbGVOdW1iZXIudHMiLCJzcmMvdG9TdGFydFdpdGgudHMiLCJzcmMvdG9UaHJvd0FueUVycm9yLnRzIiwic3JjL3RvVGhyb3dFcnJvck9mVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFNBQVM7QUFDVCxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7O0FDRGxDO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7QUFDSCxDQUFDLENBQUM7OztBQ1JGLFNBQVM7QUFDVCxNQUFNLENBQUMsT0FBTyxHQUFHLDRCQUE0QixJQUFZLEVBQUUsTUFBVztJQUNwRSxJQUFJLENBQUM7UUFDSCxNQUFNLEVBQUUsQ0FBQztRQUNULE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFFO0lBQUEsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNiLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztJQUMzQixDQUFDO0FBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhZGFwdGVycyA9IHR5cGVvZiBqYXNtaW5lLmFkZE1hdGNoZXJzID09PSAnZnVuY3Rpb24nID9cbiAgICByZXF1aXJlKCcuL2phc21pbmUtdjInKSA6XG4gICAgcmVxdWlyZSgnLi9qYXNtaW5lLXYxJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFkZDogYWRkTWF0Y2hlcnNcbn07XG5cbmZ1bmN0aW9uIGFkZE1hdGNoZXJzKG1hdGNoZXJzKSB7XG4gICAgZm9yICh2YXIgbWF0Y2hlck5hbWUgaW4gbWF0Y2hlcnMpIHtcbiAgICAgICAgYWRkTWF0Y2hlcihtYXRjaGVyTmFtZSwgbWF0Y2hlcnNbbWF0Y2hlck5hbWVdKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZE1hdGNoZXIobmFtZSwgbWF0Y2hlcikge1xuICAgIHZhciBhZGFwdGVyID0gYWRhcHRlcnNbbWF0Y2hlci5sZW5ndGhdO1xuICAgIHJldHVybiBhZGFwdGVyKG5hbWUsIG1hdGNoZXIpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAxOiBjcmVhdGVGYWN0b3J5KGZvckFjdHVhbCksXG4gICAgMjogY3JlYXRlRmFjdG9yeShmb3JBY3R1YWxBbmRFeHBlY3RlZCksXG4gICAgMzogY3JlYXRlRmFjdG9yeShmb3JBY3R1YWxBbmRUd29FeHBlY3RlZCksXG4gICAgNDogY3JlYXRlRmFjdG9yeShmb3JLZXlBbmRBY3R1YWxBbmRUd29FeHBlY3RlZClcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnkoYWRhcHRlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiBqYXNtaW5lVjFNYXRjaGVyRmFjdG9yeShuYW1lLCBtYXRjaGVyKSB7XG4gICAgICAgIHZhciBtYXRjaGVyQnlOYW1lID0gbmV3IEphc21pbmVWMU1hdGNoZXIobmFtZSwgYWRhcHRlciwgbWF0Y2hlcik7XG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmFkZE1hdGNoZXJzKG1hdGNoZXJCeU5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXJCeU5hbWU7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gSmFzbWluZVYxTWF0Y2hlcihuYW1lLCBhZGFwdGVyLCBtYXRjaGVyKSB7XG4gICAgdGhpc1tuYW1lXSA9IGFkYXB0ZXIobmFtZSwgbWF0Y2hlcik7XG59XG5cbmZ1bmN0aW9uIGZvckFjdHVhbChuYW1lLCBtYXRjaGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9wdGlvbmFsTWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlcih0aGlzLmFjdHVhbCwgb3B0aW9uYWxNZXNzYWdlKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBmb3JBY3R1YWxBbmRFeHBlY3RlZChuYW1lLCBtYXRjaGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGV4cGVjdGVkLCBvcHRpb25hbE1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXIoZXhwZWN0ZWQsIHRoaXMuYWN0dWFsLCBvcHRpb25hbE1lc3NhZ2UpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGZvckFjdHVhbEFuZFR3b0V4cGVjdGVkKG5hbWUsIG1hdGNoZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZXhwZWN0ZWQxLCBleHBlY3RlZDIsIG9wdGlvbmFsTWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlcihleHBlY3RlZDEsIGV4cGVjdGVkMiwgdGhpcy5hY3R1YWwsIG9wdGlvbmFsTWVzc2FnZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZm9yS2V5QW5kQWN0dWFsQW5kVHdvRXhwZWN0ZWQobmFtZSwgbWF0Y2hlcikge1xuICAgIHJldHVybiBmdW5jdGlvbihrZXksIGV4cGVjdGVkMSwgZXhwZWN0ZWQyLCBvcHRpb25hbE1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXIoa2V5LCBleHBlY3RlZDEsIGV4cGVjdGVkMiwgdGhpcy5hY3R1YWwsIG9wdGlvbmFsTWVzc2FnZSk7XG4gICAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG1hdGNoZXJGYWN0b3J5ID0gcmVxdWlyZSgnLi9tYXRjaGVyRmFjdG9yeScpO1xudmFyIG1lbWJlck1hdGNoZXJGYWN0b3J5ID0gcmVxdWlyZSgnLi9tZW1iZXJNYXRjaGVyRmFjdG9yeScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAxOiBjcmVhdGVGYWN0b3J5KGdldEFkYXB0ZXIoMSkpLFxuICAgIDI6IGNyZWF0ZUZhY3RvcnkoZ2V0QWRhcHRlcigyKSksXG4gICAgMzogY3JlYXRlRmFjdG9yeShnZXRBZGFwdGVyKDMpKSxcbiAgICA0OiBjcmVhdGVGYWN0b3J5KGdldEFkYXB0ZXIoNCkpXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVGYWN0b3J5KGFkYXB0ZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gamFzbWluZVYyTWF0Y2hlckZhY3RvcnkobmFtZSwgbWF0Y2hlcikge1xuICAgICAgICB2YXIgbWF0Y2hlckJ5TmFtZSA9IG5ldyBKYXNtaW5lVjJNYXRjaGVyKG5hbWUsIGFkYXB0ZXIsIG1hdGNoZXIpO1xuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgamFzbWluZS5hZGRNYXRjaGVycyhtYXRjaGVyQnlOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXRjaGVyQnlOYW1lO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIEphc21pbmVWMk1hdGNoZXIobmFtZSwgYWRhcHRlciwgbWF0Y2hlcikge1xuICAgIHRoaXNbbmFtZV0gPSBhZGFwdGVyKG5hbWUsIG1hdGNoZXIpO1xufVxuXG5mdW5jdGlvbiBnZXRBZGFwdGVyKGFyZ3NDb3VudCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBhZGFwdGVyKG5hbWUsIG1hdGNoZXIpIHtcbiAgICAgICAgdmFyIGZhY3RvcnkgPSBpc01lbWJlck1hdGNoZXIobmFtZSkgPyBtZW1iZXJNYXRjaGVyRmFjdG9yeSA6IG1hdGNoZXJGYWN0b3J5O1xuICAgICAgICByZXR1cm4gZmFjdG9yeVthcmdzQ291bnRdKG5hbWUsIG1hdGNoZXIpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGlzTWVtYmVyTWF0Y2hlcihuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUuc2VhcmNoKC9edG9IYXZlLykgIT09IC0xO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAxOiBmb3JBY3R1YWwsXG4gICAgMjogZm9yQWN0dWFsQW5kRXhwZWN0ZWQsXG4gICAgMzogZm9yQWN0dWFsQW5kVHdvRXhwZWN0ZWRcbn07XG5cbmZ1bmN0aW9uIGZvckFjdHVhbChuYW1lLCBtYXRjaGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHV0aWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uKGFjdHVhbCwgb3B0aW9uYWxNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhc3NlcyA9IG1hdGNoZXIoYWN0dWFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBwYXNzOiBwYXNzZXMsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IChcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWxNZXNzYWdlID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwuYnVpbGRGYWlsdXJlTWVzc2FnZShuYW1lLCBwYXNzZXMsIGFjdHVhbCwgb3B0aW9uYWxNZXNzYWdlKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmJ1aWxkRmFpbHVyZU1lc3NhZ2UobmFtZSwgcGFzc2VzLCBhY3R1YWwpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGZvckFjdHVhbEFuZEV4cGVjdGVkKG5hbWUsIG1hdGNoZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odXRpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZCwgb3B0aW9uYWxNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhc3NlcyA9IG1hdGNoZXIoZXhwZWN0ZWQsIGFjdHVhbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcGFzczogcGFzc2VzLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAoXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsTWVzc2FnZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmJ1aWxkRmFpbHVyZU1lc3NhZ2UobmFtZSwgcGFzc2VzLCBhY3R1YWwsIGV4cGVjdGVkLCBvcHRpb25hbE1lc3NhZ2UpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwuYnVpbGRGYWlsdXJlTWVzc2FnZShuYW1lLCBwYXNzZXMsIGFjdHVhbCwgZXhwZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGZvckFjdHVhbEFuZFR3b0V4cGVjdGVkKG5hbWUsIG1hdGNoZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odXRpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsLCBleHBlY3RlZDEsIGV4cGVjdGVkMiwgb3B0aW9uYWxNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhc3NlcyA9IG1hdGNoZXIoZXhwZWN0ZWQxLCBleHBlY3RlZDIsIGFjdHVhbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcGFzczogcGFzc2VzLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAoXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbmFsTWVzc2FnZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmJ1aWxkRmFpbHVyZU1lc3NhZ2UobmFtZSwgcGFzc2VzLCBhY3R1YWwsIGV4cGVjdGVkMSwgZXhwZWN0ZWQyLCBvcHRpb25hbE1lc3NhZ2UpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwuYnVpbGRGYWlsdXJlTWVzc2FnZShuYW1lLCBwYXNzZXMsIGFjdHVhbCwgZXhwZWN0ZWQxLCBleHBlY3RlZDIpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIDI6IGZvcktleUFuZEFjdHVhbCxcbiAgICAzOiBmb3JLZXlBbmRBY3R1YWxBbmRFeHBlY3RlZCxcbiAgICA0OiBmb3JLZXlBbmRBY3R1YWxBbmRUd29FeHBlY3RlZFxufTtcblxuZnVuY3Rpb24gZm9yS2V5QW5kQWN0dWFsKG5hbWUsIG1hdGNoZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odXRpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsLCBrZXksIG9wdGlvbmFsTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXNzZXMgPSBtYXRjaGVyKGtleSwgYWN0dWFsKTtcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IG5hbWUuc2VhcmNoKC9edG9IYXZlLykgIT09IC0xID8ga2V5IDogb3B0aW9uYWxNZXNzYWdlO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBhc3M6IHBhc3NlcyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogKFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmJ1aWxkRmFpbHVyZU1lc3NhZ2UobmFtZSwgcGFzc2VzLCBhY3R1YWwsIG1lc3NhZ2UpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwuYnVpbGRGYWlsdXJlTWVzc2FnZShuYW1lLCBwYXNzZXMsIGFjdHVhbClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZm9yS2V5QW5kQWN0dWFsQW5kRXhwZWN0ZWQobmFtZSwgbWF0Y2hlcikge1xuICAgIHJldHVybiBmdW5jdGlvbih1dGlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21wYXJlOiBmdW5jdGlvbihhY3R1YWwsIGtleSwgZXhwZWN0ZWQsIG9wdGlvbmFsTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXNzZXMgPSBtYXRjaGVyKGtleSwgZXhwZWN0ZWQsIGFjdHVhbCk7XG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSAob3B0aW9uYWxNZXNzYWdlID9cbiAgICAgICAgICAgICAgICAgICAgdXRpbC5idWlsZEZhaWx1cmVNZXNzYWdlKG5hbWUsIHBhc3NlcywgYWN0dWFsLCBleHBlY3RlZCwgb3B0aW9uYWxNZXNzYWdlKSA6XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuYnVpbGRGYWlsdXJlTWVzc2FnZShuYW1lLCBwYXNzZXMsIGFjdHVhbCwgZXhwZWN0ZWQpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBhc3M6IHBhc3NlcyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZm9ybWF0RXJyb3JNZXNzYWdlKG5hbWUsIG1lc3NhZ2UsIGtleSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGZvcktleUFuZEFjdHVhbEFuZFR3b0V4cGVjdGVkKG5hbWUsIG1hdGNoZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odXRpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGFyZTogZnVuY3Rpb24oYWN0dWFsLCBrZXksIGV4cGVjdGVkMSwgZXhwZWN0ZWQyLCBvcHRpb25hbE1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFzc2VzID0gbWF0Y2hlcihrZXksIGV4cGVjdGVkMSwgZXhwZWN0ZWQyLCBhY3R1YWwpO1xuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gKG9wdGlvbmFsTWVzc2FnZSA/XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuYnVpbGRGYWlsdXJlTWVzc2FnZShuYW1lLCBwYXNzZXMsIGFjdHVhbCwgZXhwZWN0ZWQxLCBleHBlY3RlZDIsIG9wdGlvbmFsTWVzc2FnZSkgOlxuICAgICAgICAgICAgICAgICAgICB1dGlsLmJ1aWxkRmFpbHVyZU1lc3NhZ2UobmFtZSwgcGFzc2VzLCBhY3R1YWwsIGV4cGVjdGVkMSwgZXhwZWN0ZWQyKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBwYXNzOiBwYXNzZXMsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGZvcm1hdEVycm9yTWVzc2FnZShuYW1lLCBtZXNzYWdlLCBrZXkpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvck1lc3NhZ2UobmFtZSwgbWVzc2FnZSwga2V5KSB7XG4gICAgaWYgKG5hbWUuc2VhcmNoKC9edG9IYXZlLykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlXG4gICAgICAgICAgICAucmVwbGFjZSgnRXhwZWN0ZWQnLCAnRXhwZWN0ZWQgbWVtYmVyIFwiJyArIGtleSArICdcIiBvZicpXG4gICAgICAgICAgICAucmVwbGFjZSgnIHRvIGhhdmUgJywgJyB0byBiZSAnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2U7XG59XG4iLCIvLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBhc3ltbWV0cmljTWF0Y2hlcjogW3tcbiAgICBuYW1lOiAnYWZ0ZXInLFxuICAgIG1hdGNoZXI6ICd0b0JlQWZ0ZXInXG4gIH0sIHtcbiAgICBuYW1lOiAnYXJyYXlPZkJvb2xlYW5zJyxcbiAgICBtYXRjaGVyOiAndG9CZUFycmF5T2ZCb29sZWFucydcbiAgfSwge1xuICAgIG5hbWU6ICdhcnJheU9mTnVtYmVycycsXG4gICAgbWF0Y2hlcjogJ3RvQmVBcnJheU9mTnVtYmVycydcbiAgfSwge1xuICAgIG5hbWU6ICdhcnJheU9mT2JqZWN0cycsXG4gICAgbWF0Y2hlcjogJ3RvQmVBcnJheU9mT2JqZWN0cydcbiAgfSwge1xuICAgIG5hbWU6ICdhcnJheU9mU2l6ZScsXG4gICAgbWF0Y2hlcjogJ3RvQmVBcnJheU9mU2l6ZSdcbiAgfSwge1xuICAgIG5hbWU6ICdhcnJheU9mU3RyaW5ncycsXG4gICAgbWF0Y2hlcjogJ3RvQmVBcnJheU9mU3RyaW5ncydcbiAgfSwge1xuICAgIG5hbWU6ICdiZWZvcmUnLFxuICAgIG1hdGNoZXI6ICd0b0JlQmVmb3JlJ1xuICB9LCB7XG4gICAgbmFtZTogJ2NhbGN1bGFibGUnLFxuICAgIG1hdGNoZXI6ICd0b0JlQ2FsY3VsYWJsZSdcbiAgfSwge1xuICAgIG5hbWU6ICdlbXB0eUFycmF5JyxcbiAgICBtYXRjaGVyOiAndG9CZUVtcHR5QXJyYXknXG4gIH0sIHtcbiAgICBuYW1lOiAnZW1wdHlPYmplY3QnLFxuICAgIG1hdGNoZXI6ICd0b0JlRW1wdHlPYmplY3QnXG4gIH0sIHtcbiAgICBuYW1lOiAnZXZlbk51bWJlcicsXG4gICAgbWF0Y2hlcjogJ3RvQmVFdmVuTnVtYmVyJ1xuICB9LCB7XG4gICAgbmFtZTogJ2dyZWF0ZXJUaGFuT3JFcXVhbFRvJyxcbiAgICBtYXRjaGVyOiAndG9CZUdyZWF0ZXJUaGFuT3JFcXVhbFRvJ1xuICB9LCB7XG4gICAgbmFtZTogJ2lzbzg2MDEnLFxuICAgIG1hdGNoZXI6ICd0b0JlSXNvODYwMSdcbiAgfSwge1xuICAgIG5hbWU6ICdqc29uU3RyaW5nJyxcbiAgICBtYXRjaGVyOiAndG9CZUpzb25TdHJpbmcnXG4gIH0sIHtcbiAgICBuYW1lOiAnbGVzc1RoYW5PckVxdWFsVG8nLFxuICAgIG1hdGNoZXI6ICd0b0JlTGVzc1RoYW5PckVxdWFsVG8nXG4gIH0sIHtcbiAgICBuYW1lOiAnbG9uZ2VyVGhhbicsXG4gICAgbWF0Y2hlcjogJ3RvQmVMb25nZXJUaGFuJ1xuICB9LCB7XG4gICAgbmFtZTogJ25vbkVtcHR5QXJyYXknLFxuICAgIG1hdGNoZXI6ICd0b0JlTm9uRW1wdHlBcnJheSdcbiAgfSwge1xuICAgIG5hbWU6ICdub25FbXB0eU9iamVjdCcsXG4gICAgbWF0Y2hlcjogJ3RvQmVOb25FbXB0eU9iamVjdCdcbiAgfSwge1xuICAgIG5hbWU6ICdub25FbXB0eVN0cmluZycsXG4gICAgbWF0Y2hlcjogJ3RvQmVOb25FbXB0eVN0cmluZydcbiAgfSwge1xuICAgIG5hbWU6ICdvZGROdW1iZXInLFxuICAgIG1hdGNoZXI6ICd0b0JlT2RkTnVtYmVyJ1xuICB9LCB7XG4gICAgbmFtZTogJ3NhbWVMZW5ndGhBcycsXG4gICAgbWF0Y2hlcjogJ3RvQmVTYW1lTGVuZ3RoQXMnXG4gIH0sIHtcbiAgICBuYW1lOiAnc2hvcnRlclRoYW4nLFxuICAgIG1hdGNoZXI6ICd0b0JlU2hvcnRlclRoYW4nXG4gIH0sIHtcbiAgICBuYW1lOiAnd2hpdGVzcGFjZScsXG4gICAgbWF0Y2hlcjogJ3RvQmVXaGl0ZXNwYWNlJ1xuICB9LCB7XG4gICAgbmFtZTogJ3dob2xlTnVtYmVyJyxcbiAgICBtYXRjaGVyOiAndG9CZVdob2xlTnVtYmVyJ1xuICB9LCB7XG4gICAgbmFtZTogJ3dpdGhpblJhbmdlJyxcbiAgICBtYXRjaGVyOiAndG9CZVdpdGhpblJhbmdlJ1xuICB9LCB7XG4gICAgbmFtZTogJ2VuZGluZ1dpdGgnLFxuICAgIG1hdGNoZXI6ICd0b0VuZFdpdGgnXG4gIH0sIHtcbiAgICBuYW1lOiAnc3RhcnRpbmdXaXRoJyxcbiAgICBtYXRjaGVyOiAndG9TdGFydFdpdGgnXG4gIH1dLFxuICBtYXRjaGVyOiB7XG4gICAgdG9CZUFmdGVyOiByZXF1aXJlKCcuL3RvQmVBZnRlcicpLFxuICAgIHRvQmVBcnJheTogcmVxdWlyZSgnLi90b0JlQXJyYXknKSxcbiAgICB0b0JlQXJyYXlPZkJvb2xlYW5zOiByZXF1aXJlKCcuL3RvQmVBcnJheU9mQm9vbGVhbnMnKSxcbiAgICB0b0JlQXJyYXlPZk51bWJlcnM6IHJlcXVpcmUoJy4vdG9CZUFycmF5T2ZOdW1iZXJzJyksXG4gICAgdG9CZUFycmF5T2ZPYmplY3RzOiByZXF1aXJlKCcuL3RvQmVBcnJheU9mT2JqZWN0cycpLFxuICAgIHRvQmVBcnJheU9mU2l6ZTogcmVxdWlyZSgnLi90b0JlQXJyYXlPZlNpemUnKSxcbiAgICB0b0JlQXJyYXlPZlN0cmluZ3M6IHJlcXVpcmUoJy4vdG9CZUFycmF5T2ZTdHJpbmdzJyksXG4gICAgdG9CZUJlZm9yZTogcmVxdWlyZSgnLi90b0JlQmVmb3JlJyksXG4gICAgdG9CZUJvb2xlYW46IHJlcXVpcmUoJy4vdG9CZUJvb2xlYW4nKSxcbiAgICB0b0JlQ2FsY3VsYWJsZTogcmVxdWlyZSgnLi90b0JlQ2FsY3VsYWJsZScpLFxuICAgIHRvQmVEYXRlOiByZXF1aXJlKCcuL3RvQmVEYXRlJyksXG4gICAgdG9CZUVtcHR5QXJyYXk6IHJlcXVpcmUoJy4vdG9CZUVtcHR5QXJyYXknKSxcbiAgICB0b0JlRW1wdHlPYmplY3Q6IHJlcXVpcmUoJy4vdG9CZUVtcHR5T2JqZWN0JyksXG4gICAgdG9CZUVtcHR5U3RyaW5nOiByZXF1aXJlKCcuL3RvQmVFbXB0eVN0cmluZycpLFxuICAgIHRvQmVFdmVuTnVtYmVyOiByZXF1aXJlKCcuL3RvQmVFdmVuTnVtYmVyJyksXG4gICAgdG9CZUZhbHNlOiByZXF1aXJlKCcuL3RvQmVGYWxzZScpLFxuICAgIHRvQmVGdW5jdGlvbjogcmVxdWlyZSgnLi90b0JlRnVuY3Rpb24nKSxcbiAgICB0b0JlR3JlYXRlclRoYW5PckVxdWFsVG86IHJlcXVpcmUoJy4vdG9CZUdyZWF0ZXJUaGFuT3JFcXVhbFRvJyksXG4gICAgdG9CZUh0bWxTdHJpbmc6IHJlcXVpcmUoJy4vdG9CZUh0bWxTdHJpbmcnKSxcbiAgICB0b0JlSXNvODYwMTogcmVxdWlyZSgnLi90b0JlSXNvODYwMScpLFxuICAgIHRvQmVKc29uU3RyaW5nOiByZXF1aXJlKCcuL3RvQmVKc29uU3RyaW5nJyksXG4gICAgdG9CZUxlc3NUaGFuT3JFcXVhbFRvOiByZXF1aXJlKCcuL3RvQmVMZXNzVGhhbk9yRXF1YWxUbycpLFxuICAgIHRvQmVMb25nZXJUaGFuOiByZXF1aXJlKCcuL3RvQmVMb25nZXJUaGFuJyksXG4gICAgdG9CZU5vbkVtcHR5QXJyYXk6IHJlcXVpcmUoJy4vdG9CZU5vbkVtcHR5QXJyYXknKSxcbiAgICB0b0JlTm9uRW1wdHlPYmplY3Q6IHJlcXVpcmUoJy4vdG9CZU5vbkVtcHR5T2JqZWN0JyksXG4gICAgdG9CZU5vbkVtcHR5U3RyaW5nOiByZXF1aXJlKCcuL3RvQmVOb25FbXB0eVN0cmluZycpLFxuICAgIHRvQmVOdW1iZXI6IHJlcXVpcmUoJy4vdG9CZU51bWJlcicpLFxuICAgIHRvQmVPYmplY3Q6IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpLFxuICAgIHRvQmVPZGROdW1iZXI6IHJlcXVpcmUoJy4vdG9CZU9kZE51bWJlcicpLFxuICAgIHRvQmVTYW1lTGVuZ3RoQXM6IHJlcXVpcmUoJy4vdG9CZVNhbWVMZW5ndGhBcycpLFxuICAgIHRvQmVTaG9ydGVyVGhhbjogcmVxdWlyZSgnLi90b0JlU2hvcnRlclRoYW4nKSxcbiAgICB0b0JlU3RyaW5nOiByZXF1aXJlKCcuL3RvQmVTdHJpbmcnKSxcbiAgICB0b0JlVHJ1ZTogcmVxdWlyZSgnLi90b0JlVHJ1ZScpLFxuICAgIHRvQmVXaGl0ZXNwYWNlOiByZXF1aXJlKCcuL3RvQmVXaGl0ZXNwYWNlJyksXG4gICAgdG9CZVdob2xlTnVtYmVyOiByZXF1aXJlKCcuL3RvQmVXaG9sZU51bWJlcicpLFxuICAgIHRvQmVXaXRoaW5SYW5nZTogcmVxdWlyZSgnLi90b0JlV2l0aGluUmFuZ2UnKSxcbiAgICB0b0VuZFdpdGg6IHJlcXVpcmUoJy4vdG9FbmRXaXRoJyksXG4gICAgdG9IYXZlQXJyYXk6IHJlcXVpcmUoJy4vdG9IYXZlQXJyYXknKSxcbiAgICB0b0hhdmVBcnJheU9mQm9vbGVhbnM6IHJlcXVpcmUoJy4vdG9IYXZlQXJyYXlPZkJvb2xlYW5zJyksXG4gICAgdG9IYXZlQXJyYXlPZk51bWJlcnM6IHJlcXVpcmUoJy4vdG9IYXZlQXJyYXlPZk51bWJlcnMnKSxcbiAgICB0b0hhdmVBcnJheU9mT2JqZWN0czogcmVxdWlyZSgnLi90b0hhdmVBcnJheU9mT2JqZWN0cycpLFxuICAgIHRvSGF2ZUFycmF5T2ZTaXplOiByZXF1aXJlKCcuL3RvSGF2ZUFycmF5T2ZTaXplJyksXG4gICAgdG9IYXZlQXJyYXlPZlN0cmluZ3M6IHJlcXVpcmUoJy4vdG9IYXZlQXJyYXlPZlN0cmluZ3MnKSxcbiAgICB0b0hhdmVCb29sZWFuOiByZXF1aXJlKCcuL3RvSGF2ZUJvb2xlYW4nKSxcbiAgICB0b0hhdmVDYWxjdWxhYmxlOiByZXF1aXJlKCcuL3RvSGF2ZUNhbGN1bGFibGUnKSxcbiAgICB0b0hhdmVEYXRlOiByZXF1aXJlKCcuL3RvSGF2ZURhdGUnKSxcbiAgICB0b0hhdmVEYXRlQWZ0ZXI6IHJlcXVpcmUoJy4vdG9IYXZlRGF0ZUFmdGVyJyksXG4gICAgdG9IYXZlRGF0ZUJlZm9yZTogcmVxdWlyZSgnLi90b0hhdmVEYXRlQmVmb3JlJyksXG4gICAgdG9IYXZlRW1wdHlBcnJheTogcmVxdWlyZSgnLi90b0hhdmVFbXB0eUFycmF5JyksXG4gICAgdG9IYXZlRW1wdHlPYmplY3Q6IHJlcXVpcmUoJy4vdG9IYXZlRW1wdHlPYmplY3QnKSxcbiAgICB0b0hhdmVFbXB0eVN0cmluZzogcmVxdWlyZSgnLi90b0hhdmVFbXB0eVN0cmluZycpLFxuICAgIHRvSGF2ZUV2ZW5OdW1iZXI6IHJlcXVpcmUoJy4vdG9IYXZlRXZlbk51bWJlcicpLFxuICAgIHRvSGF2ZUZhbHNlOiByZXF1aXJlKCcuL3RvSGF2ZUZhbHNlJyksXG4gICAgdG9IYXZlSHRtbFN0cmluZzogcmVxdWlyZSgnLi90b0hhdmVIdG1sU3RyaW5nJyksXG4gICAgdG9IYXZlSXNvODYwMTogcmVxdWlyZSgnLi90b0hhdmVJc284NjAxJyksXG4gICAgdG9IYXZlSnNvblN0cmluZzogcmVxdWlyZSgnLi90b0hhdmVKc29uU3RyaW5nJyksXG4gICAgdG9IYXZlTWVtYmVyOiByZXF1aXJlKCcuL3RvSGF2ZU1lbWJlcicpLFxuICAgIHRvSGF2ZU1ldGhvZDogcmVxdWlyZSgnLi90b0hhdmVNZXRob2QnKSxcbiAgICB0b0hhdmVOb25FbXB0eUFycmF5OiByZXF1aXJlKCcuL3RvSGF2ZU5vbkVtcHR5QXJyYXknKSxcbiAgICB0b0hhdmVOb25FbXB0eU9iamVjdDogcmVxdWlyZSgnLi90b0hhdmVOb25FbXB0eU9iamVjdCcpLFxuICAgIHRvSGF2ZU5vbkVtcHR5U3RyaW5nOiByZXF1aXJlKCcuL3RvSGF2ZU5vbkVtcHR5U3RyaW5nJyksXG4gICAgdG9IYXZlTnVtYmVyOiByZXF1aXJlKCcuL3RvSGF2ZU51bWJlcicpLFxuICAgIHRvSGF2ZU51bWJlcldpdGhpblJhbmdlOiByZXF1aXJlKCcuL3RvSGF2ZU51bWJlcldpdGhpblJhbmdlJyksXG4gICAgdG9IYXZlT2JqZWN0OiByZXF1aXJlKCcuL3RvSGF2ZU9iamVjdCcpLFxuICAgIHRvSGF2ZU9kZE51bWJlcjogcmVxdWlyZSgnLi90b0hhdmVPZGROdW1iZXInKSxcbiAgICB0b0hhdmVTdHJpbmc6IHJlcXVpcmUoJy4vdG9IYXZlU3RyaW5nJyksXG4gICAgdG9IYXZlU3RyaW5nTG9uZ2VyVGhhbjogcmVxdWlyZSgnLi90b0hhdmVTdHJpbmdMb25nZXJUaGFuJyksXG4gICAgdG9IYXZlU3RyaW5nU2FtZUxlbmd0aEFzOiByZXF1aXJlKCcuL3RvSGF2ZVN0cmluZ1NhbWVMZW5ndGhBcycpLFxuICAgIHRvSGF2ZVN0cmluZ1Nob3J0ZXJUaGFuOiByZXF1aXJlKCcuL3RvSGF2ZVN0cmluZ1Nob3J0ZXJUaGFuJyksXG4gICAgdG9IYXZlVHJ1ZTogcmVxdWlyZSgnLi90b0hhdmVUcnVlJyksXG4gICAgdG9IYXZlV2hpdGVzcGFjZVN0cmluZzogcmVxdWlyZSgnLi90b0hhdmVXaGl0ZXNwYWNlU3RyaW5nJyksXG4gICAgdG9IYXZlV2hvbGVOdW1iZXI6IHJlcXVpcmUoJy4vdG9IYXZlV2hvbGVOdW1iZXInKSxcbiAgICB0b1N0YXJ0V2l0aDogcmVxdWlyZSgnLi90b1N0YXJ0V2l0aCcpLFxuICAgIHRvVGhyb3dBbnlFcnJvcjogcmVxdWlyZSgnLi90b1Rocm93QW55RXJyb3InKSxcbiAgICB0b1Rocm93RXJyb3JPZlR5cGU6IHJlcXVpcmUoJy4vdG9UaHJvd0Vycm9yT2ZUeXBlJylcbiAgfVxufTtcbiIsIi8vIG1vZHVsZXNcbnZhciByZWR1Y2UgPSByZXF1aXJlKCcuL2xpYi9yZWR1Y2UnKTtcbnZhciBhcGkgPSByZXF1aXJlKCcuL2FwaScpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gcmVkdWNlKGFwaS5hc3ltbWV0cmljTWF0Y2hlciwgcmVnaXN0ZXIsIHt9KTtcblxuLy8gaW1wbGVtZW50YXRpb25cbmZ1bmN0aW9uIHJlZ2lzdGVyKGFueSwgYXN5bU1hdGNoZXIpIHtcbiAgdmFyIG1hdGNoZXIgPSBhcGkubWF0Y2hlclthc3ltTWF0Y2hlci5tYXRjaGVyXTtcbiAgYW55W2FzeW1NYXRjaGVyLm5hbWVdID0gY3JlYXRlRmFjdG9yeShtYXRjaGVyKTtcbiAgcmV0dXJuIGFueTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmFjdG9yeShtYXRjaGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbiBhc3ltbWV0cmljTWF0Y2hlckZhY3RvcnkoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFzeW1tZXRyaWNNYXRjaDogZnVuY3Rpb24gYXN5bW1ldHJpY01hdGNoZXIoYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIGNsb25lID0gYXJncy5zbGljZSgpO1xuICAgICAgICBjbG9uZS5wdXNoKGFjdHVhbCk7XG4gICAgICAgIHJldHVybiBtYXRjaGVyLmFwcGx5KHRoaXMsIGNsb25lKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufVxuIiwiZGVjbGFyZSBtb2R1bGUgTm9kZUpTICB7XG4gIGludGVyZmFjZSBHbG9iYWwge1xuICAgIGFueTogYW55XG4gIH1cbn1cblxuLy8gM3JkIHBhcnR5IG1vZHVsZXNcbnZhciBsb2FkZXIgPSByZXF1aXJlKCdqYXNtaW5lLW1hdGNoZXJzLWxvYWRlcicpO1xuXG4vLyBtb2R1bGVzXG52YXIgYXBpID0gcmVxdWlyZSgnLi9hcGknKTtcbnZhciBhc3ltbWV0cmljTWF0Y2hlcnMgPSByZXF1aXJlKCcuL2FzeW1tZXRyaWNNYXRjaGVycycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gYXBpLm1hdGNoZXI7XG5cbi8vIGltcGxlbWVudGF0aW9uXG5sb2FkZXIuYWRkKGFwaS5tYXRjaGVyKTtcbmdsb2JhbC5hbnkgPSBhc3ltbWV0cmljTWF0Y2hlcnM7XG4iLCIvLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXZlcnkoYXJyYXk6IGFueVtdLCB0cnV0aFRlc3Q6IEZ1bmN0aW9uKTogYm9vbGVhbiB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmICh0cnV0aFRlc3QoYXJyYXlbaV0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBldmVyeShhcnJheTogYW55W10sIHRydXRoVGVzdDogRnVuY3Rpb24pIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCF0cnV0aFRlc3QoYXJyYXlbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcbiIsIi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpcyh2YWx1ZTogYW55LCB0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0ICcgKyB0eXBlICsgJ10nO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciByZWR1Y2UgPSByZXF1aXJlKCcuL3JlZHVjZScpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ga2V5cyhvYmplY3Q6IE9iamVjdCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIHJlZHVjZShvYmplY3QsIGFwcGVuZEtleSwgW10pO1xufTtcblxuZnVuY3Rpb24gYXBwZW5kS2V5IChrZXlzOiBzdHJpbmdbXSwgdmFsdWU6IGFueSwga2V5OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBrZXlzLmNvbmNhdChrZXkpO1xufVxuIiwiLy8gbW9kdWxlc1xudmFyIGlzID0gcmVxdWlyZSgnLi9pcycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVkdWNlKGNvbGxlY3Rpb246IGFueVtdLCBmbjogRnVuY3Rpb24sIG1lbW86IGFueSk6IGFueSB7XG4gIGlmIChpcyhjb2xsZWN0aW9uLCAnQXJyYXknKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2xsZWN0aW9uLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBtZW1vID0gZm4obWVtbywgY29sbGVjdGlvbltpXSwgaSwgY29sbGVjdGlvbik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGtleSBpbiBjb2xsZWN0aW9uKSB7XG4gICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChjb2xsZWN0aW9uLCBrZXkpKSB7XG4gICAgICAgIG1lbW8gPSBmbihtZW1vLCBjb2xsZWN0aW9uW2tleV0sIGtleSwgY29sbGVjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBtZW1vO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlQmVmb3JlID0gcmVxdWlyZSgnLi90b0JlQmVmb3JlJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlQWZ0ZXIob3RoZXJEYXRlOiBEYXRlLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZUJlZm9yZShhY3R1YWwsIG90aGVyRGF0ZSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIGlzID0gcmVxdWlyZSgnLi9saWIvaXMnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVBcnJheShhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXMoYWN0dWFsLCAnQXJyYXknKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgZXZlcnkgPSByZXF1aXJlKCcuL2xpYi9ldmVyeScpO1xudmFyIHRvQmVBcnJheSA9IHJlcXVpcmUoJy4vdG9CZUFycmF5Jyk7XG52YXIgdG9CZUJvb2xlYW4gPSByZXF1aXJlKCcuL3RvQmVCb29sZWFuJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlQXJyYXlPZkJvb2xlYW5zKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlQXJyYXkoYWN0dWFsKSAmJiBldmVyeShhY3R1YWwsIHRvQmVCb29sZWFuKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgZXZlcnkgPSByZXF1aXJlKCcuL2xpYi9ldmVyeScpO1xudmFyIHRvQmVBcnJheSA9IHJlcXVpcmUoJy4vdG9CZUFycmF5Jyk7XG52YXIgdG9CZU51bWJlciA9IHJlcXVpcmUoJy4vdG9CZU51bWJlcicpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZUFycmF5T2ZOdW1iZXJzKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlQXJyYXkoYWN0dWFsKSAmJiBldmVyeShhY3R1YWwsIHRvQmVOdW1iZXIpO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciBldmVyeSA9IHJlcXVpcmUoJy4vbGliL2V2ZXJ5Jyk7XG52YXIgdG9CZUFycmF5ID0gcmVxdWlyZSgnLi90b0JlQXJyYXknKTtcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlQXJyYXlPZk9iamVjdHMoYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVBcnJheShhY3R1YWwpICYmIGV2ZXJ5KGFjdHVhbCwgdG9CZU9iamVjdCk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVBcnJheSA9IHJlcXVpcmUoJy4vdG9CZUFycmF5Jyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlQXJyYXlPZlNpemUoc2l6ZTogbnVtYmVyLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZUFycmF5KGFjdHVhbCkgJiYgYWN0dWFsLmxlbmd0aCA9PT0gc2l6ZTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgZXZlcnkgPSByZXF1aXJlKCcuL2xpYi9ldmVyeScpO1xudmFyIHRvQmVBcnJheSA9IHJlcXVpcmUoJy4vdG9CZUFycmF5Jyk7XG52YXIgdG9CZVN0cmluZyA9IHJlcXVpcmUoJy4vdG9CZVN0cmluZycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZUFycmF5T2ZTdHJpbmdzKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlQXJyYXkoYWN0dWFsKSAmJiBldmVyeShhY3R1YWwsIHRvQmVTdHJpbmcpO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlRGF0ZSA9IHJlcXVpcmUoJy4vdG9CZURhdGUnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVCZWZvcmUob3RoZXJEYXRlOiBEYXRlLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZURhdGUoYWN0dWFsKSAmJiB0b0JlRGF0ZShvdGhlckRhdGUpICYmIGFjdHVhbC5nZXRUaW1lKCkgPCBvdGhlckRhdGUuZ2V0VGltZSgpO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciBpcyA9IHJlcXVpcmUoJy4vbGliL2lzJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlQm9vbGVhbihhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXMoYWN0dWFsLCAnQm9vbGVhbicpO1xufTtcbiIsIi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlQ2FsY3VsYWJsZShhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICAvLyBBc3NlcnQgc3ViamVjdCBjYW4gYmUgdXNlZCBpbiBNYXRoZW1ldGljIGNhbGN1bGF0aW9ucyBkZXNwaXRlIG5vdCBiZWluZyBhXG4gIC8vIE51bWJlciwgZm9yIGV4YW1wbGUgYFwiMVwiICogXCIyXCIgPT09IDJgIHdoZXJlYXMgYFwid3V0P1wiICogMiA9PT0gTmFOYC5cbiAgcmV0dXJuICFpc05hTihhY3R1YWwgKiAyKTtcbn1cbiIsIi8vIG1vZHVsZXNcbnZhciBpcyA9IHJlcXVpcmUoJy4vbGliL2lzJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlRGF0ZShhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXMoYWN0dWFsLCAnRGF0ZScpO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlQXJyYXlPZlNpemUgPSByZXF1aXJlKCcuL3RvQmVBcnJheU9mU2l6ZScpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZUVtcHR5QXJyYXkoYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVBcnJheU9mU2l6ZSgwLCBhY3R1YWwpO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciBpcyA9IHJlcXVpcmUoJy4vbGliL2lzJyk7XG52YXIga2V5cyA9IHJlcXVpcmUoJy4vbGliL2tleXMnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVFbXB0eU9iamVjdChhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXMoYWN0dWFsLCAnT2JqZWN0JykgJiYga2V5cyhhY3R1YWwpLmxlbmd0aCA9PT0gMDtcbn07XG4iLCIvLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZUVtcHR5U3RyaW5nKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBhY3R1YWwgPT09ICcnO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlTnVtYmVyID0gcmVxdWlyZSgnLi90b0JlTnVtYmVyJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlRXZlbk51bWJlcihhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU51bWJlcihhY3R1YWwpICYmIGFjdHVhbCAlIDIgPT09IDA7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIGlzID0gcmVxdWlyZSgnLi9saWIvaXMnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVGYWxzZShhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gYWN0dWFsID09PSBmYWxzZSB8fCAoaXMoYWN0dWFsLCAnQm9vbGVhbicpICYmIGFjdHVhbC52YWx1ZU9mKCkgPT09IGZhbHNlKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgaXMgPSByZXF1aXJlKCcuL2xpYi9pcycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZUZ1bmN0aW9uKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBpcyhhY3R1YWwsICdGdW5jdGlvbicpO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlTnVtYmVyID0gcmVxdWlyZSgnLi90b0JlTnVtYmVyJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlR3JlYXRlclRoYW5PckVxdWFsVG8ob3RoZXJOdW1iZXI6IG51bWJlciwgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVOdW1iZXIoYWN0dWFsKSAmJiBhY3R1YWwgPj0gb3RoZXJOdW1iZXI7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVTdHJpbmcgPSByZXF1aXJlKCcuL3RvQmVTdHJpbmcnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVIdG1sU3RyaW5nKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIC8vIDwgICAgICAgICAgIHN0YXJ0IHdpdGggb3BlbmluZyB0YWcgXCI8XCJcbiAgLy8gICggICAgICAgICAgc3RhcnQgZ3JvdXAgMVxuICAvLyAgICBcIlteXCJdKlwiICBhbGxvdyBzdHJpbmcgaW4gXCJkb3VibGUgcXVvdGVzXCJcbiAgLy8gICAgfCAgICAgICAgT1JcbiAgLy8gICAgJ1teJ10qJyAgYWxsb3cgc3RyaW5nIGluIFwic2luZ2xlIHF1b3Rlc1wiXG4gIC8vICAgIHwgICAgICAgIE9SXG4gIC8vICAgIFteJ1wiPl0gICBjYW50IGNvbnRhaW5zIG9uZSBzaW5nbGUgcXVvdGVzLCBkb3VibGUgcXVvdGVzIGFuZCBcIj5cIlxuICAvLyAgKSAgICAgICAgICBlbmQgZ3JvdXAgMVxuICAvLyAgKiAgICAgICAgICAwIG9yIG1vcmVcbiAgLy8gPiAgICAgICAgICAgZW5kIHdpdGggY2xvc2luZyB0YWcgXCI+XCJcbiAgcmV0dXJuIHRvQmVTdHJpbmcoYWN0dWFsKSAmJiBhY3R1YWwuc2VhcmNoKC88KFwiW15cIl0qXCJ8J1teJ10qJ3xbXidcIj5dKSo+LykgIT09IC0xO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciBhbnkgPSByZXF1aXJlKCcuL2xpYi9hbnknKTtcbnZhciB0b0JlU3RyaW5nID0gcmVxdWlyZSgnLi90b0JlU3RyaW5nJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlSXNvODYwMShhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZVN0cmluZyhhY3R1YWwpICYmIGFueShwYXR0ZXJucywgbWF0Y2hlcykgJiYgbmV3IERhdGUoYWN0dWFsKS50b1N0cmluZygpICE9PSAnSW52YWxpZCBEYXRlJztcblxuICBmdW5jdGlvbiBtYXRjaGVzKHBhdHRlcm46IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHZhciByZWdleCA9ICdeJyArIGV4cGFuZChwYXR0ZXJuKSArICckJztcbiAgICByZXR1cm4gYWN0dWFsLnNlYXJjaChuZXcgUmVnRXhwKHJlZ2V4KSkgIT09IC0xO1xuICB9XG59XG5cbi8vIGltcGxlbWVudGF0aW9uXG52YXIgcGF0dGVybnMgPSBbXG4gICdubm5uLW5uLW5uJyxcbiAgJ25ubm4tbm4tbm5Ubm46bm4nLFxuICAnbm5ubi1ubi1ublRubjpubjpubicsXG4gICdubm5uLW5uLW5uVG5uOm5uOm5uLm5ubicsXG4gICdubm5uLW5uLW5uVG5uOm5uOm5uLm5ublonXG5dO1xuXG5mdW5jdGlvbiBleHBhbmQocGF0dGVybjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHBhdHRlcm5cbiAgICAuc3BsaXQoJy0nKS5qb2luKCdcXFxcLScpXG4gICAgLnNwbGl0KCcuJykuam9pbignXFxcXC4nKVxuICAgIC5zcGxpdCgnbm5ubicpLmpvaW4oJyhbMC05XXs0fSknKVxuICAgIC5zcGxpdCgnbm5uJykuam9pbignKFswLTldezN9KScpXG4gICAgLnNwbGl0KCdubicpLmpvaW4oJyhbMC05XXsyfSknKTtcbn1cbiIsIi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlSnNvblN0cmluZyhhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKGFjdHVhbCkgIT09IG51bGw7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlTnVtYmVyID0gcmVxdWlyZSgnLi90b0JlTnVtYmVyJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlTGVzc1RoYW5PckVxdWFsVG8ob3RoZXJOdW1iZXI6IG51bWJlciwgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVOdW1iZXIoYWN0dWFsKSAmJiBhY3R1YWwgPD0gb3RoZXJOdW1iZXI7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVTdHJpbmcgPSByZXF1aXJlKCcuL3RvQmVTdHJpbmcnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVMb25nZXJUaGFuKG90aGVyU3RyaW5nOiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlU3RyaW5nKGFjdHVhbCkgJiYgdG9CZVN0cmluZyhvdGhlclN0cmluZykgJiYgYWN0dWFsLmxlbmd0aCA+IG90aGVyU3RyaW5nLmxlbmd0aDtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgaXMgPSByZXF1aXJlKCcuL2xpYi9pcycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZU5vbkVtcHR5QXJyYXkoYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzKGFjdHVhbCwgJ0FycmF5JykgJiYgYWN0dWFsLmxlbmd0aCA+IDA7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIGlzID0gcmVxdWlyZSgnLi9saWIvaXMnKTtcbnZhciBrZXlzID0gcmVxdWlyZSgnLi9saWIva2V5cycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZU5vbkVtcHR5T2JqZWN0KGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBpcyhhY3R1YWwsICdPYmplY3QnKSAmJiBrZXlzKGFjdHVhbCkubGVuZ3RoID4gMDtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZVN0cmluZyA9IHJlcXVpcmUoJy4vdG9CZVN0cmluZycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZU5vbkVtcHR5U3RyaW5nKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlU3RyaW5nKGFjdHVhbCkgJiYgYWN0dWFsLmxlbmd0aCA+IDA7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIGlzID0gcmVxdWlyZSgnLi9saWIvaXMnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVOdW1iZXIoYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KGFjdHVhbCkpICYmICFpcyhhY3R1YWwsICdTdHJpbmcnKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgaXMgPSByZXF1aXJlKCcuL2xpYi9pcycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZU9iamVjdChhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXMoYWN0dWFsLCAnT2JqZWN0Jyk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVOdW1iZXIgPSByZXF1aXJlKCcuL3RvQmVOdW1iZXInKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVPZGROdW1iZXIoYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVOdW1iZXIoYWN0dWFsKSAmJiBhY3R1YWwgJSAyICE9PSAwO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlU3RyaW5nID0gcmVxdWlyZSgnLi90b0JlU3RyaW5nJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlU2FtZUxlbmd0aEFzKG90aGVyU3RyaW5nOiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlU3RyaW5nKGFjdHVhbCkgJiYgdG9CZVN0cmluZyhvdGhlclN0cmluZykgJiYgYWN0dWFsLmxlbmd0aCA9PT0gb3RoZXJTdHJpbmcubGVuZ3RoO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlU3RyaW5nID0gcmVxdWlyZSgnLi90b0JlU3RyaW5nJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlU2hvcnRlclRoYW4ob3RoZXJTdHJpbmc6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVTdHJpbmcoYWN0dWFsKSAmJiB0b0JlU3RyaW5nKG90aGVyU3RyaW5nKSAmJiBhY3R1YWwubGVuZ3RoIDwgb3RoZXJTdHJpbmcubGVuZ3RoO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciBpcyA9IHJlcXVpcmUoJy4vbGliL2lzJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlU3RyaW5nKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBpcyhhY3R1YWwsICdTdHJpbmcnKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgaXMgPSByZXF1aXJlKCcuL2xpYi9pcycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZVRydWUoYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIGFjdHVhbCA9PT0gdHJ1ZSB8fCAoaXMoYWN0dWFsLCAnQm9vbGVhbicpICYmIGFjdHVhbC52YWx1ZU9mKCkgPT09IHRydWUpO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlU3RyaW5nID0gcmVxdWlyZSgnLi90b0JlU3RyaW5nJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0JlV2hpdGVzcGFjZShhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZVN0cmluZyhhY3R1YWwpICYmIGFjdHVhbC5zZWFyY2goL1xcUy8pID09PSAtMTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU51bWJlciA9IHJlcXVpcmUoJy4vdG9CZU51bWJlcicpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9CZVdob2xlTnVtYmVyKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlTnVtYmVyKGFjdHVhbCkgJiYgKFxuICAgIGFjdHVhbCA9PT0gMCB8fCBhY3R1YWwgJSAxID09PSAwXG4gICk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVOdW1iZXIgPSByZXF1aXJlKCcuL3RvQmVOdW1iZXInKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvQmVXaXRoaW5SYW5nZShmbG9vcjogbnVtYmVyLCBjZWlsaW5nOiBudW1iZXIsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlTnVtYmVyKGFjdHVhbCkgJiYgYWN0dWFsID49IGZsb29yICYmIGFjdHVhbCA8PSBjZWlsaW5nO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlTm9uRW1wdHlTdHJpbmcgPSByZXF1aXJlKCcuL3RvQmVOb25FbXB0eVN0cmluZycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9FbmRXaXRoKHN1YlN0cmluZzogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICBpZiAoIXRvQmVOb25FbXB0eVN0cmluZyhhY3R1YWwpIHx8ICF0b0JlTm9uRW1wdHlTdHJpbmcoc3ViU3RyaW5nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gYWN0dWFsLnNsaWNlKGFjdHVhbC5sZW5ndGggLSBzdWJTdHJpbmcubGVuZ3RoLCBhY3R1YWwubGVuZ3RoKSA9PT0gc3ViU3RyaW5nO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZUFycmF5ID0gcmVxdWlyZSgnLi90b0JlQXJyYXknKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZUFycmF5KGtleTogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU9iamVjdChhY3R1YWwpICYmIHRvQmVBcnJheShhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlQXJyYXlPZkJvb2xlYW5zID0gcmVxdWlyZSgnLi90b0JlQXJyYXlPZkJvb2xlYW5zJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVBcnJheU9mQm9vbGVhbnMoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZUFycmF5T2ZCb29sZWFucyhhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlQXJyYXlPZk51bWJlcnMgPSByZXF1aXJlKCcuL3RvQmVBcnJheU9mTnVtYmVycycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlQXJyYXlPZk51bWJlcnMoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZUFycmF5T2ZOdW1iZXJzKGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVBcnJheU9mT2JqZWN0cyA9IHJlcXVpcmUoJy4vdG9CZUFycmF5T2ZPYmplY3RzJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVBcnJheU9mT2JqZWN0cyhrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlQXJyYXlPZk9iamVjdHMoYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZUFycmF5T2ZTaXplID0gcmVxdWlyZSgnLi90b0JlQXJyYXlPZlNpemUnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZUFycmF5T2ZTaXplKGtleTogc3RyaW5nLCBzaXplOiBudW1iZXIsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZUFycmF5T2ZTaXplKHNpemUsIGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVBcnJheU9mU3RyaW5ncyA9IHJlcXVpcmUoJy4vdG9CZUFycmF5T2ZTdHJpbmdzJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVBcnJheU9mU3RyaW5ncyhrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlQXJyYXlPZlN0cmluZ3MoYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZUJvb2xlYW4gPSByZXF1aXJlKCcuL3RvQmVCb29sZWFuJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVCb29sZWFuKGtleTogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU9iamVjdChhY3R1YWwpICYmIHRvQmVCb29sZWFuKGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVDYWxjdWxhYmxlID0gcmVxdWlyZSgnLi90b0JlQ2FsY3VsYWJsZScpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlQ2FsY3VsYWJsZShrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlQ2FsY3VsYWJsZShhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlRGF0ZSA9IHJlcXVpcmUoJy4vdG9CZURhdGUnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZURhdGUoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZURhdGUoYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZUFmdGVyID0gcmVxdWlyZSgnLi90b0JlQWZ0ZXInKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZURhdGVBZnRlcihrZXk6IHN0cmluZywgZGF0ZTogRGF0ZSwgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlQWZ0ZXIoZGF0ZSwgYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZUJlZm9yZSA9IHJlcXVpcmUoJy4vdG9CZUJlZm9yZScpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlRGF0ZUJlZm9yZShrZXk6IHN0cmluZywgZGF0ZTogRGF0ZSwgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlQmVmb3JlKGRhdGUsIGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVFbXB0eUFycmF5ID0gcmVxdWlyZSgnLi90b0JlRW1wdHlBcnJheScpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlRW1wdHlBcnJheShrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlRW1wdHlBcnJheShhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlRW1wdHlPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVFbXB0eU9iamVjdCcpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlRW1wdHlPYmplY3Qoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZUVtcHR5T2JqZWN0KGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVFbXB0eVN0cmluZyA9IHJlcXVpcmUoJy4vdG9CZUVtcHR5U3RyaW5nJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVFbXB0eVN0cmluZyhrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlRW1wdHlTdHJpbmcoYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZUV2ZW5OdW1iZXIgPSByZXF1aXJlKCcuL3RvQmVFdmVuTnVtYmVyJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVFdmVuTnVtYmVyKGtleTogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU9iamVjdChhY3R1YWwpICYmIHRvQmVFdmVuTnVtYmVyKGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVGYWxzZSA9IHJlcXVpcmUoJy4vdG9CZUZhbHNlJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVGYWxzZShrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlRmFsc2UoYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZUh0bWxTdHJpbmcgPSByZXF1aXJlKCcuL3RvQmVIdG1sU3RyaW5nJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVIdG1sU3RyaW5nKGtleTogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU9iamVjdChhY3R1YWwpICYmIHRvQmVIdG1sU3RyaW5nKGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVJc284NjAxID0gcmVxdWlyZSgnLi90b0JlSXNvODYwMScpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlSXNvODYwMShrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlSXNvODYwMShhY3R1YWxba2V5XSk7XG59XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVKc29uU3RyaW5nID0gcmVxdWlyZSgnLi90b0JlSnNvblN0cmluZycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlSnNvblN0cmluZyhrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlSnNvblN0cmluZyhhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlU3RyaW5nID0gcmVxdWlyZSgnLi90b0JlU3RyaW5nJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVNZW1iZXIoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlU3RyaW5nKGtleSkgJiYgdG9CZU9iamVjdChhY3R1YWwpICYmIGtleSBpbiBhY3R1YWw7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlRnVuY3Rpb24gPSByZXF1aXJlKCcuL3RvQmVGdW5jdGlvbicpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlTWV0aG9kKGtleTogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU9iamVjdChhY3R1YWwpICYmIHRvQmVGdW5jdGlvbihhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlTm9uRW1wdHlBcnJheSA9IHJlcXVpcmUoJy4vdG9CZU5vbkVtcHR5QXJyYXknKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZU5vbkVtcHR5QXJyYXkoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZU5vbkVtcHR5QXJyYXkoYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZU5vbkVtcHR5T2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlTm9uRW1wdHlPYmplY3QnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZU5vbkVtcHR5T2JqZWN0KGtleTogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU9iamVjdChhY3R1YWwpICYmIHRvQmVOb25FbXB0eU9iamVjdChhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlTm9uRW1wdHlTdHJpbmcgPSByZXF1aXJlKCcuL3RvQmVOb25FbXB0eVN0cmluZycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlTm9uRW1wdHlTdHJpbmcoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZU5vbkVtcHR5U3RyaW5nKGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVOdW1iZXIgPSByZXF1aXJlKCcuL3RvQmVOdW1iZXInKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZU51bWJlcihrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlTnVtYmVyKGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVXaXRoaW5SYW5nZSA9IHJlcXVpcmUoJy4vdG9CZVdpdGhpblJhbmdlJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVOdW1iZXJXaXRoaW5SYW5nZShrZXk6IHN0cmluZywgZmxvb3I6IG51bWJlciwgY2VpbGluZzogbnVtYmVyLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU9iamVjdChhY3R1YWwpICYmIHRvQmVXaXRoaW5SYW5nZShmbG9vciwgY2VpbGluZywgYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVPYmplY3Qoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZU9iamVjdChhY3R1YWxba2V5XSk7XG59O1xuIiwidmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlT2RkTnVtYmVyID0gcmVxdWlyZSgnLi90b0JlT2RkTnVtYmVyJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVPZGROdW1iZXIoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZU9kZE51bWJlcihhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlU3RyaW5nID0gcmVxdWlyZSgnLi90b0JlU3RyaW5nJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVTdHJpbmcoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZVN0cmluZyhhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlTG9uZ2VyVGhhbiA9IHJlcXVpcmUoJy4vdG9CZUxvbmdlclRoYW4nKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZVN0cmluZ0xvbmdlclRoYW4oa2V5OiBzdHJpbmcsIG90aGVyOiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZUxvbmdlclRoYW4ob3RoZXIsIGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVTYW1lTGVuZ3RoQXMgPSByZXF1aXJlKCcuL3RvQmVTYW1lTGVuZ3RoQXMnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZVN0cmluZ1NhbWVMZW5ndGhBcyhrZXk6IHN0cmluZywgb3RoZXI6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlU2FtZUxlbmd0aEFzKG90aGVyLCBhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlU2hvcnRlclRoYW4gPSByZXF1aXJlKCcuL3RvQmVTaG9ydGVyVGhhbicpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9IYXZlU3RyaW5nU2hvcnRlclRoYW4oa2V5OiBzdHJpbmcsIG90aGVyOiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZVNob3J0ZXJUaGFuKG90aGVyLCBhY3R1YWxba2V5XSk7XG59O1xuIiwiLy8gbW9kdWxlc1xudmFyIHRvQmVPYmplY3QgPSByZXF1aXJlKCcuL3RvQmVPYmplY3QnKTtcbnZhciB0b0JlVHJ1ZSA9IHJlcXVpcmUoJy4vdG9CZVRydWUnKTtcblxuLy8gcHVibGljXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvSGF2ZVRydWUoa2V5OiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiB0b0JlT2JqZWN0KGFjdHVhbCkgJiYgdG9CZVRydWUoYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlT2JqZWN0ID0gcmVxdWlyZSgnLi90b0JlT2JqZWN0Jyk7XG52YXIgdG9CZVdoaXRlc3BhY2UgPSByZXF1aXJlKCcuL3RvQmVXaGl0ZXNwYWNlJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVXaGl0ZXNwYWNlU3RyaW5nKGtleTogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdG9CZU9iamVjdChhY3R1YWwpICYmIHRvQmVXaGl0ZXNwYWNlKGFjdHVhbFtrZXldKTtcbn07XG4iLCIvLyBtb2R1bGVzXG52YXIgdG9CZU9iamVjdCA9IHJlcXVpcmUoJy4vdG9CZU9iamVjdCcpO1xudmFyIHRvQmVXaG9sZU51bWJlciA9IHJlcXVpcmUoJy4vdG9CZVdob2xlTnVtYmVyJyk7XG5cbi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b0hhdmVXaG9sZU51bWJlcihrZXk6IHN0cmluZywgYWN0dWFsOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRvQmVPYmplY3QoYWN0dWFsKSAmJiB0b0JlV2hvbGVOdW1iZXIoYWN0dWFsW2tleV0pO1xufTtcbiIsIi8vIG1vZHVsZXNcbnZhciB0b0JlTm9uRW1wdHlTdHJpbmcgPSByZXF1aXJlKCcuL3RvQmVOb25FbXB0eVN0cmluZycpO1xuXG4vLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9TdGFydFdpdGgoc3ViU3RyaW5nOiBzdHJpbmcsIGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIGlmICghdG9CZU5vbkVtcHR5U3RyaW5nKGFjdHVhbCkgfHwgIXRvQmVOb25FbXB0eVN0cmluZyhzdWJTdHJpbmcpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBhY3R1YWwuc2xpY2UoMCwgc3ViU3RyaW5nLmxlbmd0aCkgPT09IHN1YlN0cmluZztcbn07XG4iLCIvLyBwdWJsaWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9UaHJvd0FueUVycm9yKGFjdHVhbDogYW55KTogYm9vbGVhbiB7XG4gIHRyeSB7XG4gICAgYWN0dWFsKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIi8vIHB1YmxpY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b1Rocm93RXJyb3JPZlR5cGUodHlwZTogc3RyaW5nLCBhY3R1YWw6IGFueSk6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIGFjdHVhbCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIGVyci5uYW1lID09PSB0eXBlO1xuICB9XG59O1xuIl19
