// modules
var toBeObject = require('./toBeObject');
var toBeShorterThan = require('./toBeShorterThan');

// public
module.exports = function toHaveStringShorterThan(key: string, other: string, actual: any): boolean {
  return toBeObject(actual) && toBeShorterThan(other, actual[key]);
};
