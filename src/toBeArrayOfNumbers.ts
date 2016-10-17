// modules
var every = require('./lib/every');
var toBeArray = require('./toBeArray');
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeArrayOfNumbers(actual: any): boolean {
  return toBeArray(actual) && every(actual, toBeNumber);
};
