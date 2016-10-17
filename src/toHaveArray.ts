// modules
var toBeObject = require('./toBeObject');
var toBeArray = require('./toBeArray');

// public
module.exports = function toHaveArray(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeArray(actual[key]);
};
