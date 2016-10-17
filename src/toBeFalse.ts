// modules
var is = require('./lib/is');

// public
module.exports = function toBeFalse(actual: any): boolean {
  return actual === false || (is(actual, 'Boolean') && actual.valueOf() === false);
};
