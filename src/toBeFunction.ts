// modules
var is = require('./lib/is');

// public
module.exports = function toBeFunction(actual: any): boolean {
  return is(actual, 'Function');
};
