var toBeObject = require('./toBeObject');
var toBeOddNumber = require('./toBeOddNumber');

// public
module.exports = function toHaveOddNumber(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeOddNumber(actual[key]);
};
