// modules
var toBeObject = require('./toBeObject');
var toBeDate = require('./toBeDate');

// public
module.exports = function toHaveDate(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeDate(actual[key]);
};
