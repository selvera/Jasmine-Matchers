// modules
var toBeObject = require('./toBeObject');
var toBeNonEmptyObject = require('./toBeNonEmptyObject');

// public
module.exports = function toHaveNonEmptyObject(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeNonEmptyObject(actual[key]);
};
