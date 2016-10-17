// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeWithinRange(floor: number, ceiling: number, actual: any): boolean {
  return toBeNumber(actual) && actual >= floor && actual <= ceiling;
};
