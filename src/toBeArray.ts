// modules
var is = require('./lib/is');

// public
module.exports = function toBeArray(actual: any): boolean {
  return is(actual, 'Array');
};
