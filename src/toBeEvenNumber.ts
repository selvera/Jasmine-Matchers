// modules
var toBeNumber = require('./toBeNumber');

// public
module.exports = function toBeEvenNumber(actual: any): boolean {
  return toBeNumber(actual) && actual % 2 === 0;
};
