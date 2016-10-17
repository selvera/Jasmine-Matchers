// modules
var toBeObject = require('./toBeObject');
var toBeString = require('./toBeString');

// public
module.exports = function toHaveMember(key: string, actual: any): boolean {
  return toBeString(key) && toBeObject(actual) && key in actual;
};
