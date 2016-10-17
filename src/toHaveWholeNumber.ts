// modules
var toBeObject = require('./toBeObject');
var toBeWholeNumber = require('./toBeWholeNumber');

// public
module.exports = function toHaveWholeNumber(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeWholeNumber(actual[key]);
};
