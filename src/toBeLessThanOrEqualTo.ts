// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeLessThanOrEqualTo(otherNumber: number, actual: any): boolean {
  return toBeNumber(actual) && actual <= otherNumber;
};
