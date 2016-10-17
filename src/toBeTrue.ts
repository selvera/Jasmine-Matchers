// modules
var is = require('./lib/is');

// public
module.exports = function toBeTrue(actual: any): boolean {
  return actual === true || (is(actual, 'Boolean') && actual.valueOf() === true);
};
