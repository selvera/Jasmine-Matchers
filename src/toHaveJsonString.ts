// modules
var toBeObject = require('./toBeObject');
var toBeJsonString = require('./toBeJsonString');

// public
module.exports = function toHaveJsonString(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeJsonString(actual[key]);
};
