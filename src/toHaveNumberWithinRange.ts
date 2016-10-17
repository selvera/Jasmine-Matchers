// modules
var toBeObject = require('./toBeObject');
var toBeWithinRange = require('./toBeWithinRange');

// public
module.exports = function toHaveNumberWithinRange(key: string, floor: number, ceiling: number, actual: any): boolean {
  return toBeObject(actual) && toBeWithinRange(floor, ceiling, actual[key]);
};
