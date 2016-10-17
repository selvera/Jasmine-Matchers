// modules
var toBeDate = require('./toBeDate');

// public
module.exports = function toBeBefore(otherDate: Date, actual: any): boolean {
  return toBeDate(actual) && toBeDate(otherDate) && actual.getTime() < otherDate.getTime();
};
