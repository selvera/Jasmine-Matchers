// modules
var toBeObject = require('./toBeObject');
var toBeFalse = require('./toBeFalse');

// public
module.exports = function toHaveFalse(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeFalse(actual[key]);
};
