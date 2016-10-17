// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeShorterThan(otherString: string, actual: any): boolean {
  return toBeString(actual) && toBeString(otherString) && actual.length < otherString.length;
};
