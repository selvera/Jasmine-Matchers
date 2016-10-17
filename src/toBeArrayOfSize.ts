// modules
var toBeArray = require('./toBeArray');

// public
module.exports = function toBeArrayOfSize(size: number, actual: any): boolean {
  return toBeArray(actual) && actual.length === size;
};
