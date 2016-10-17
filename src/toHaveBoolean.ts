// modules
var toBeObject = require('./toBeObject');
var toBeBoolean = require('./toBeBoolean');

// public
module.exports = function toHaveBoolean(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeBoolean(actual[key]);
};
