// modules
var is = require('./lib/is');

// public
module.exports = function toBeObject(actual: any): boolean {
  return is(actual, 'Object');
};
