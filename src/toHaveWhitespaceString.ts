// modules
var toBeObject = require('./toBeObject');
var toBeWhitespace = require('./toBeWhitespace');

// public
module.exports = function toHaveWhitespaceString(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeWhitespace(actual[key]);
};
