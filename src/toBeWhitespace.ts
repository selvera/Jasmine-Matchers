// modules
var toBeString = require('./toBeString');

// public
module.exports = function toBeWhitespace(actual: any): boolean {
  return toBeString(actual) && actual.search(/\S/) === -1;
};
