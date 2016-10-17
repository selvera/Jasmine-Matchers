// modules
var toBeObject = require('./toBeObject');

// public
module.exports = function toHaveObject(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeObject(actual[key]);
};
