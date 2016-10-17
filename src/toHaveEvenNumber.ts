// modules
var toBeObject = require('./toBeObject');
var toBeEvenNumber = require('./toBeEvenNumber');

// public
module.exports = function toHaveEvenNumber(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeEvenNumber(actual[key]);
};
