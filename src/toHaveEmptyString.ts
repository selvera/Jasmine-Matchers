// modules
var toBeObject = require('./toBeObject');
var toBeEmptyString = require('./toBeEmptyString');

// public
module.exports = function toHaveEmptyString(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeEmptyString(actual[key]);
};
