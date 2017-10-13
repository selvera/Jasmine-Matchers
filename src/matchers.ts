const is = (type: string) => (value: any): boolean =>
  Object.prototype.toString.call(value) === `[object ${type}]`;
const isArray = is('Array');
const isBoolean = is('Boolean');
const isBooleanObject = (trueOrFalse: boolean) => (value: any): boolean =>
  isBoolean(value) && value.valueOf() === trueOrFalse;
const isDate = is('Date');
const isFalse = isBooleanObject(false);
const isFunction = is('Function');
const isObject = is('Object');
const isString = is('String');
const isTrue = isBooleanObject(true);

const memberMatcherFor = (toBeX: (actual: any) => boolean) => (
  key: string,
  actual: any
): boolean => isObject(actual) && toBeX(actual[key]);

const reduce = (
  collection: any[] | object,
  fn: (
    memo: any,
    value: any,
    key: number | string,
    collection: any[] | object
  ) => any,
  memo: any
): any => {
  if (collection instanceof Array) {
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

const keys = (object: object): string[] =>
  reduce(object, (keyNames, value, key) => keyNames.concat(key), []);

const every = (array: any[], truthTest): boolean => {
  for (let i = 0, len = array.length; i < len; i++) {
    if (!truthTest(array[i])) {
      return false;
    }
  }
  return true;
};

const isMatch = (pattern: string, actual: any): boolean => {
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

export const toBeBefore = (otherDate: any, actual: any): boolean =>
  toBeDate(actual) &&
  toBeDate(otherDate) &&
  actual.getTime() < otherDate.getTime();

export const toBeAfter = (otherDate: any, actual: any): boolean =>
  toBeBefore(actual, otherDate);

export const toBeArray = isArray;

export const toBeBoolean = isBoolean;

export const toBeFunction = isFunction;

export const toBeObject = isObject;

export const toBeString = isString;

export const toBeNumber = (actual: any): boolean =>
  !isNaN(parseFloat(actual)) && !isString(actual);

export const toBeArrayOfBooleans = (actual: any): boolean =>
  toBeArray(actual) && every(actual, toBeBoolean);

export const toBeArrayOfNumbers = (actual: any): boolean =>
  toBeArray(actual) && every(actual, toBeNumber);

export const toBeArrayOfObjects = (actual: any): boolean =>
  toBeArray(actual) && every(actual, toBeObject);

export const toBeArrayOfSize = (size: number, actual: any): boolean =>
  toBeArray(actual) && actual.length === size;

export const toBeArrayOfStrings = (actual: any): boolean =>
  toBeArray(actual) && every(actual, toBeString);

export const toBeCalculable = (actual: any): boolean => !isNaN(actual * 2);

export const toBeEmptyArray = (actual: any): boolean =>
  toBeArrayOfSize(0, actual);

export const toBeEmptyObject = (actual: any): boolean =>
  isObject(actual) && keys(actual).length === 0;

export const toBeEmptyString = (actual: any): boolean => actual === '';

export const toBeEvenNumber = (actual: any): boolean =>
  toBeNumber(actual) && actual % 2 === 0;

export const toBeFalse = (actual: any): boolean =>
  actual === false || isFalse(actual);

export const toBeGreaterThanOrEqualTo = (
  otherNumber: number,
  actual: any
): boolean => toBeNumber(actual) && actual >= otherNumber;

export const toBeHtmlString = (actual: any): boolean =>
  toBeString(actual) && actual.search(/<("[^"]*"|'[^']*'|[^'">])*>/) !== -1;

export const toBeValidDate = (actual: any): boolean =>
  isDate(actual) && !isNaN(actual.getTime());

export const toBeIso8601 = (actual: any): boolean =>
  toBeString(actual) &&
  (isMatch('1999-12-31', actual) ||
    isMatch('1999-12-31T23:59', actual) ||
    isMatch('1999-12-31T23:59:59', actual) ||
    isMatch('1999-12-31T23:59:59.000', actual) ||
    isMatch('1999-12-31T23:59:59.000Z', actual)) &&
  toBeValidDate(new Date(actual));

export const toBeJsonString = (actual: any): boolean => {
  try {
    return JSON.parse(actual) !== null;
  } catch (err) {
    return false;
  }
};

export const toBeLessThanOrEqualTo = (
  otherNumber: number,
  actual: any
): boolean => toBeNumber(actual) && actual <= otherNumber;

export const toBeLongerThan = (otherString: string, actual: any): boolean =>
  toBeString(actual) &&
  toBeString(otherString) &&
  actual.length > otherString.length;

export const toBeNear = (
  otherNumber: number,
  epsilon: number,
  actual: any
): boolean =>
  toBeNumber(actual) &&
  actual >= otherNumber - epsilon &&
  actual <= otherNumber + epsilon;

export const toBeNonEmptyArray = (actual: any): boolean =>
  isArray(actual) && actual.length > 0;

export const toBeNonEmptyObject = (actual: any): boolean =>
  isObject(actual) && keys(actual).length > 0;

export const toBeNonEmptyString = (actual: any): boolean =>
  toBeString(actual) && actual.length > 0;

export const toBeOddNumber = (actual: any): boolean =>
  toBeNumber(actual) && actual % 2 !== 0;

export const toBeRegExp = (actual: any): boolean => actual instanceof RegExp;

export const toBeSameLengthAs = (otherString: string, actual: any): boolean =>
  toBeString(actual) &&
  toBeString(otherString) &&
  actual.length === otherString.length;

export const toBeShorterThan = (otherString: string, actual: any): boolean =>
  toBeString(actual) &&
  toBeString(otherString) &&
  actual.length < otherString.length;

export const toBeTrue = (actual: any): boolean =>
  actual === true || isTrue(actual);

export const toBeWhitespace = (actual: any): boolean =>
  toBeString(actual) && actual.search(/\S/) === -1;

export const toBeWholeNumber = (actual: any): boolean =>
  toBeNumber(actual) && (actual === 0 || actual % 1 === 0);

export const toBeWithinRange = (
  floor: number,
  ceiling: number,
  actual: any
): boolean => toBeNumber(actual) && actual >= floor && actual <= ceiling;

export const toEndWith = (subString: string, actual: any): boolean =>
  toBeNonEmptyString(actual) &&
  toBeNonEmptyString(subString) &&
  actual.slice(actual.length - subString.length, actual.length) === subString;

export const toHaveArray = memberMatcherFor(toBeArray);

export const toHaveArrayOfBooleans = memberMatcherFor(toBeArrayOfBooleans);

export const toHaveArrayOfNumbers = memberMatcherFor(toBeArrayOfNumbers);

export const toHaveArrayOfObjects = memberMatcherFor(toBeArrayOfObjects);

export const toHaveArrayOfSize = (
  key: string,
  size: number,
  actual: any
): boolean => toBeObject(actual) && toBeArrayOfSize(size, actual[key]);

export const toHaveArrayOfStrings = memberMatcherFor(toBeArrayOfStrings);

export const toHaveBoolean = memberMatcherFor(toBeBoolean);

export const toHaveCalculable = memberMatcherFor(toBeCalculable);

export const toHaveDate = memberMatcherFor(toBeDate);

export const toHaveDateAfter = (
  key: string,
  date: Date,
  actual: any
): boolean => toBeObject(actual) && toBeAfter(date, actual[key]);

export const toHaveDateBefore = (
  key: string,
  date: Date,
  actual: any
): boolean => toBeObject(actual) && toBeBefore(date, actual[key]);

export const toHaveEmptyArray = memberMatcherFor(toBeEmptyArray);

export const toHaveEmptyObject = memberMatcherFor(toBeEmptyObject);

export const toHaveEmptyString = memberMatcherFor(toBeEmptyString);

export const toHaveEvenNumber = memberMatcherFor(toBeEvenNumber);

export const toHaveFalse = memberMatcherFor(toBeFalse);

export const toHaveHtmlString = memberMatcherFor(toBeHtmlString);

export const toHaveIso8601 = memberMatcherFor(toBeIso8601);

export const toHaveJsonString = memberMatcherFor(toBeJsonString);

export const toHaveMember = (key: string, actual: any): boolean =>
  toBeString(key) && toBeObject(actual) && key in actual;

export const toHaveMethod = memberMatcherFor(toBeFunction);

export const toHaveNonEmptyArray = memberMatcherFor(toBeNonEmptyArray);

export const toHaveNonEmptyObject = memberMatcherFor(toBeNonEmptyObject);

export const toHaveNonEmptyString = memberMatcherFor(toBeNonEmptyString);

export const toHaveNumber = memberMatcherFor(toBeNumber);

export const toHaveNumberWithinRange = (
  key: string,
  floor: number,
  ceiling: number,
  actual: any
): boolean =>
  toBeObject(actual) && toBeWithinRange(floor, ceiling, actual[key]);

export const toHaveObject = memberMatcherFor(toBeObject);

export const toHaveOddNumber = memberMatcherFor(toBeOddNumber);

export const toHaveString = memberMatcherFor(toBeString);

export const toHaveStringLongerThan = (
  key: string,
  other: string,
  actual: any
): boolean => toBeObject(actual) && toBeLongerThan(other, actual[key]);

export const toHaveStringSameLengthAs = (
  key: string,
  other: string,
  actual: any
): boolean => toBeObject(actual) && toBeSameLengthAs(other, actual[key]);

export const toHaveStringShorterThan = (
  key: string,
  other: string,
  actual: any
): boolean => toBeObject(actual) && toBeShorterThan(other, actual[key]);

export const toHaveTrue = memberMatcherFor(toBeTrue);

export const toHaveUndefined = (key: string, actual: any): boolean =>
  toBeObject(actual) &&
  toHaveMember(key, actual) &&
  typeof actual[key] === 'undefined';

export const toHaveWhitespaceString = memberMatcherFor(toBeWhitespace);

export const toHaveWholeNumber = memberMatcherFor(toBeWholeNumber);

export const toStartWith = (subString: string, actual: any): boolean =>
  toBeNonEmptyString(actual) &&
  toBeNonEmptyString(subString) &&
  actual.slice(0, subString.length) === subString;

export const toThrowAnyError = (actual: () => void): boolean => {
  try {
    actual();
    return false;
  } catch (err) {
    return true;
  }
};

export const toThrowErrorOfType = (
  type: string,
  actual: () => void
): boolean => {
  try {
    actual();
    return false;
  } catch (err) {
    return err.name === type;
  }
};
