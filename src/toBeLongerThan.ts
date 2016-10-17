// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeLongerThan(otherString: string, actual: any): boolean {
  return toBeString(actual) && toBeString(otherString) && actual.length > otherString.length;
};
