// modules
var is = require('./lib/is');

// public
module.exports = function toBeString(actual: any): boolean {
  return is(actual, 'String');
};
