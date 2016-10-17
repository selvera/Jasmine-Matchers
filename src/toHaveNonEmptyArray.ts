// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyArray = require('./toBeNonEmptyArray');

// public
module.exports = function toHaveNonEmptyArray(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeNonEmptyArray(actual[key]);
};
