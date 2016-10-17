// modules
var toBeObject = require('./toBeObject');
var toBeFunction = require('./toBeFunction');

// public
module.exports = function toHaveMethod(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeFunction(actual[key]);
};
