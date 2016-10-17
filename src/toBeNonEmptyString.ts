// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeNonEmptyString(actual: any): boolean {
  return toBeString(actual) && actual.length > 0;
};
