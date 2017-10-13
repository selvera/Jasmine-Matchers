const is = type => value => Object.prototype.toString.call(value) === `[object ${type}]`;
const isArray = is('Array');
const isBoolean = is('Boolean');
const isBooleanObject = trueOrFalse => value => isBoolean(value) && value.valueOf() === trueOrFalse;
const isDate = is('Date');
const isFalse = isBooleanObject(false);
const isFunction = is('Function');
const isObject = is('Object');
const isString = is('String');
const isTrue = isBooleanObject(true);

const memberMatcherFor = toBeX => (key, actual) => isObject(actual) && toBeX(actual[key]);

const reduce = (collection, fn, memo) => {
  if (isArray(collection)) {
    for (let i = 0, len = collection.length; i < len; i++) {
      memo = fn(memo, collection[i], i, collection);
    }
  } else {
    for (const key in collection) {
      if ({}.hasOwnProperty.call(collection, key)) {
        memo = fn(memo, collection[key], key, collection);
      }
    }
  }
  return memo;
};

const keys = object => reduce(object, (keyNames, value, key) => keyNames.concat(key), []);

const every = (array, truthTest) => {
  for (let i = 0, len = array.length; i < len; i++) {
    if (!truthTest(array[i])) {
      return false;
    }
  }
  return true;
};

const isMatch = (pattern, actual) => {
  const patterns = {
    '1999-12-31': /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
    '1999-12-31T23:59': /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})$/,
    '1999-12-31T23:59:59': /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})$/,
    '1999-12-31T23:59:59.000': /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})$/,
    '1999-12-31T23:59:59.000Z': /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})Z$/
  };
  return actual.search(patterns[pattern]) !== -1;
};

export const toBeDate = isDate;
export const toBeBefore = (otherDate, actual) => toBeDate(actual) && toBeDate(otherDate) && actual.getTime() < otherDate.getTime();
export const toBeAfter = (otherDate, actual) => toBeBefore(actual, otherDate);

export const toBeArray = isArray;
export const toBeBoolean = isBoolean;
export const toBeFunction = isFunction;
export const toBeObject = isObject;
export const toBeString = isString;
export const toBeNumber = actual => !isNaN(parseFloat(actual)) && !isString(actual);

export const toBeArrayOfBooleans = actual => toBeArray(actual) && every(actual, toBeBoolean);

export const toBeArrayOfNumbers = actual => toBeArray(actual) && every(actual, toBeNumber);

export const toBeArrayOfObjects = actual => toBeArray(actual) && every(actual, toBeObject);

export const toBeArrayOfSize = (size, actual) => toBeArray(actual) && actual.length === size;

export const toBeArrayOfStrings = actual => toBeArray(actual) && every(actual, toBeString);

export const toBeCalculable = actual => !isNaN(actual * 2);

export const toBeEmptyArray = actual => toBeArrayOfSize(0, actual);

export const toBeEmptyObject = actual => isObject(actual) && keys(actual).length === 0;

export const toBeEmptyString = actual => actual === '';

export const toBeEvenNumber = actual => toBeNumber(actual) && actual % 2 === 0;

export const toBeFalse = actual => actual === false || isFalse(actual); // eslint-disable-line new-cap

export const toBeGreaterThanOrEqualTo = (otherNumber, actual) => toBeNumber(actual) && actual >= otherNumber;

export const toBeHtmlString = actual => toBeString(actual) && actual.search(/<("[^"]*"|'[^']*'|[^'">])*>/) !== -1;

export const toBeValidDate = actual => isDate(actual) && !isNaN(actual.getTime());

export const toBeIso8601 = actual =>
  toBeString(actual) && (
    isMatch('1999-12-31', actual) ||
    isMatch('1999-12-31T23:59', actual) ||
    isMatch('1999-12-31T23:59:59', actual) ||
    isMatch('1999-12-31T23:59:59.000', actual) ||
    isMatch('1999-12-31T23:59:59.000Z', actual)
  ) && toBeValidDate(new Date(actual));

export const toBeJsonString = actual => {
  try {
    return JSON.parse(actual) !== null;
  } catch (err) {
    return false;
  }
};

export const toBeLessThanOrEqualTo = (otherNumber, actual) => toBeNumber(actual) && actual <= otherNumber;

export const toBeLongerThan = (otherString, actual) => toBeString(actual) && toBeString(otherString) && actual.length > otherString.length;

export const toBeNear = (number, epsilon, actual) => toBeNumber(actual) && actual >= number - epsilon && actual <= number + epsilon;

export const toBeNonEmptyArray = actual => isArray(actual) && actual.length > 0;

export const toBeNonEmptyObject = actual => isObject(actual) && keys(actual).length > 0;

export const toBeNonEmptyString = actual => toBeString(actual) && actual.length > 0;

export const toBeOddNumber = actual => toBeNumber(actual) && actual % 2 !== 0;

export const toBeRegExp = actual => actual instanceof RegExp;

export const toBeSameLengthAs = (otherString, actual) => toBeString(actual) && toBeString(otherString) && actual.length === otherString.length;

export const toBeShorterThan = (otherString, actual) => toBeString(actual) && toBeString(otherString) && actual.length < otherString.length;

export const toBeTrue = actual => actual === true || isTrue(actual); // eslint-disable-line new-cap

export const toBeWhitespace = actual => toBeString(actual) && actual.search(/\S/) === -1;

export const toBeWholeNumber = actual => toBeNumber(actual) && (actual === 0 || actual % 1 === 0);

export const toBeWithinRange = (floor, ceiling, actual) => toBeNumber(actual) && actual >= floor && actual <= ceiling;

export const toEndWith = (subString, actual) => toBeNonEmptyString(actual) && toBeNonEmptyString(subString) && actual.slice(actual.length - subString.length, actual.length) === subString;

export const toHaveArray = memberMatcherFor(toBeArray);

export const toHaveArrayOfBooleans = memberMatcherFor(toBeArrayOfBooleans);

export const toHaveArrayOfNumbers = memberMatcherFor(toBeArrayOfNumbers);

export const toHaveArrayOfObjects = memberMatcherFor(toBeArrayOfObjects);

export const toHaveArrayOfSize = (key, size, actual) => toBeObject(actual) && toBeArrayOfSize(size, actual[key]);

export const toHaveArrayOfStrings = memberMatcherFor(toBeArrayOfStrings);

export const toHaveBoolean = memberMatcherFor(toBeBoolean);

export const toHaveCalculable = memberMatcherFor(toBeCalculable);

export const toHaveDate = memberMatcherFor(toBeDate);

export const toHaveDateAfter = (key, date, actual) => toBeObject(actual) && toBeAfter(date, actual[key]);

export const toHaveDateBefore = (key, date, actual) => toBeObject(actual) && toBeBefore(date, actual[key]);

export const toHaveEmptyArray = memberMatcherFor(toBeEmptyArray);

export const toHaveEmptyObject = memberMatcherFor(toBeEmptyObject);

export const toHaveEmptyString = memberMatcherFor(toBeEmptyString);

export const toHaveEvenNumber = memberMatcherFor(toBeEvenNumber);

export const toHaveFalse = memberMatcherFor(toBeFalse);

export const toHaveHtmlString = memberMatcherFor(toBeHtmlString);

export const toHaveIso8601 = memberMatcherFor(toBeIso8601);

export const toHaveJsonString = memberMatcherFor(toBeJsonString);

export const toHaveMember = (key, actual) => toBeString(key) && toBeObject(actual) && key in actual;

export const toHaveMethod = memberMatcherFor(toBeFunction);

export const toHaveNonEmptyArray = memberMatcherFor(toBeNonEmptyArray);

export const toHaveNonEmptyObject = memberMatcherFor(toBeNonEmptyObject);

export const toHaveNonEmptyString = memberMatcherFor(toBeNonEmptyString);

export const toHaveNumber = memberMatcherFor(toBeNumber);

export const toHaveNumberWithinRange = (key, floor, ceiling, actual) => toBeObject(actual) && toBeWithinRange(floor, ceiling, actual[key]);

export const toHaveObject = memberMatcherFor(toBeObject);

export const toHaveOddNumber = memberMatcherFor(toBeOddNumber);

export const toHaveString = memberMatcherFor(toBeString);

export const toHaveStringLongerThan = (key, other, actual) => toBeObject(actual) && toBeLongerThan(other, actual[key]);

export const toHaveStringSameLengthAs = (key, other, actual) => toBeObject(actual) && toBeSameLengthAs(other, actual[key]);

export const toHaveStringShorterThan = (key, other, actual) => toBeObject(actual) && toBeShorterThan(other, actual[key]);

export const toHaveTrue = memberMatcherFor(toBeTrue);

export const toHaveUndefined = (key, actual) => toBeObject(actual) && toHaveMember(key, actual) && typeof actual[key] === 'undefined';

export const toHaveWhitespaceString = memberMatcherFor(toBeWhitespace);

export const toHaveWholeNumber = memberMatcherFor(toBeWholeNumber);

export const toStartWith = (subString, actual) => toBeNonEmptyString(actual) && toBeNonEmptyString(subString) && actual.slice(0, subString.length) === subString;

export const toThrowAnyError = actual => {
  try {
    actual();
    return false;
  } catch (err) {
    return true;
  }
};

export const toThrowErrorOfType = (type, actual) => {
  try {
    actual();
    return false;
  } catch (err) {
    return err.name === type;
  }
};
