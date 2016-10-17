// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfNumbers = require('./toBeArrayOfNumbers');

// public
module.exports = function toHaveArrayOfNumbers(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeArrayOfNumbers(actual[key]);
};
