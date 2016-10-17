// modules
var toBeObject = require('./toBeObject');
var toBeString = require('./toBeString');

// public
module.exports = function toHaveString(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeString(actual[key]);
};
