// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeGreaterThanOrEqualTo(otherNumber: number, actual: any): boolean {
  return toBeNumber(actual) && actual >= otherNumber;
};
