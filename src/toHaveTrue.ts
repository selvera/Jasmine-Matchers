// modules
var toBeObject = require('./toBeObject');
var toBeTrue = require('./toBeTrue');

// public
module.exports = function toHaveTrue(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeTrue(actual[key]);
};
