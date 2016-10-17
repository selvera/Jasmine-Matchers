// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfBooleans = require('./toBeArrayOfBooleans');

// public
module.exports = function toHaveArrayOfBooleans(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeArrayOfBooleans(actual[key]);
};
