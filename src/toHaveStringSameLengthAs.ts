// modules
var toBeObject = require('./toBeObject');
var toBeSameLengthAs = require('./toBeSameLengthAs');

// public
module.exports = function toHaveStringSameLengthAs(key: string, other: string, actual: any): boolean {
  return toBeObject(actual) && toBeSameLengthAs(other, actual[key]);
};
