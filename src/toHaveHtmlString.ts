// modules
var toBeObject = require('./toBeObject');
var toBeHtmlString = require('./toBeHtmlString');

// public
module.exports = function toHaveHtmlString(key: string, actual: any): boolean {
  return toBeObject(actual) && toBeHtmlString(actual[key]);
};
