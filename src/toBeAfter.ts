// modules
var toBeBefore = require('./toBeBefore');

// public
module.exports = function toBeAfter(otherDate: Date, actual: any): boolean {
  return toBeBefore(actual, otherDate);
};
