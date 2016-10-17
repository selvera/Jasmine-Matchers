// modules
var toBeObject = require('./toBeObject');
var toBeEmptyArray = require('./toBeEmptyArray');

// public
module.exports = function toHaveEmptyArray(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeEmptyArray(actual[key]);
};
