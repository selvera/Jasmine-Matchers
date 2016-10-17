// modules
var is = require('./lib/is');

// public
module.exports = function toBeNumber(actual: any): boolean {
  return !isNaN(parseFloat(actual)) && !is(actual, 'String');
};
