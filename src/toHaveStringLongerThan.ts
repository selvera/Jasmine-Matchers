// modules
var toBeObject = require('./toBeObject');
var toBeLongerThan = require('./toBeLongerThan');

// public
module.exports = function toHaveStringLongerThan(key: string, other: string, actual: any): boolean {
  return toBeObject(actual) && toBeLongerThan(other, actual[key]);
};
