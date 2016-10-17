// modules
var toBeObject = require('./toBeObject');
var toBeCalculable = require('./toBeCalculable');

// public
module.exports = function toHaveCalculable(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeCalculable(actual[key]);
};
