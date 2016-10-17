// modules
var toBeObject = require('./toBeObject');
var toBeAfter = require('./toBeAfter');

// public
module.exports = function toHaveDateAfter(key: string, date: Date, actual: any): boolean {
  return toBeObject(actual) && toBeAfter(date, actual[key]);
};
