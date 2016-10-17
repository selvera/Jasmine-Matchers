// modules
var toBeObject = require('./toBeObject');
var toBeIso8601 = require('./toBeIso8601');

// public
module.exports = function toHaveIso8601(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeIso8601(actual[key]);
}
