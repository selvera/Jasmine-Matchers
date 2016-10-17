// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyString = require('./toBeNonEmptyString');

// public
module.exports = function toHaveNonEmptyString(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeNonEmptyString(actual[key]);
};
