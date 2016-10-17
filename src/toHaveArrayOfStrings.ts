// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfStrings = require('./toBeArrayOfStrings');

// public
module.exports = function toHaveArrayOfStrings(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeArrayOfStrings(actual[key]);
};
