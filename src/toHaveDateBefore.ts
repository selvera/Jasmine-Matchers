// modules
var toBeObject = require('./toBeObject');
var toBeBefore = require('./toBeBefore');

// public
module.exports = function toHaveDateBefore(key: string, date: Date, actual: any): boolean {
  return toBeObject(actual) && toBeBefore(date, actual[key]);
};
