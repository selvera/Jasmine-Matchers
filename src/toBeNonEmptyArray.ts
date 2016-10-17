// modules
var is = require('./lib/is');

// public
module.exports = function toBeNonEmptyArray(actual: any): boolean {
  return is(actual, 'Array') && actual.length > 0;
};
