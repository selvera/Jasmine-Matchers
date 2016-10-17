// modules
var toBeObject = require('./toBeObject');
var toBeEmptyObject = require('./toBeEmptyObject');

// public
module.exports = function toHaveEmptyObject(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeEmptyObject(actual[key]);
};
