// modules
var toBeObject = require('./toBeObject');
var toBeArrayOfSize = require('./toBeArrayOfSize');

// public
module.exports = function toHaveArrayOfSize(key: string, size: number, actual: any): boolean {
  return toBeObject(actual) && toBeArrayOfSize(size, actual[key]);
};
