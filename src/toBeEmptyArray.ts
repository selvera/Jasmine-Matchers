// modules
var toBeArrayOfSize = require('./toBeArrayOfSize');

// public
module.exports = function toBeEmptyArray(actual: any): boolean {
  return toBeArrayOfSize(0, actual);
};
