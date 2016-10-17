// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeOddNumber(actual: any): boolean {
  return toBeNumber(actual) && actual % 2 !== 0;
};
