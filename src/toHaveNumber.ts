// modules
var toBeObject = require('./toBeObject');
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toHaveNumber(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeNumber(actual[key]);
};
