// modules
var is = require('./lib/is');

// public
module.exports = function toBeDate(actual: any): boolean {
  return is(actual, 'Date');
};
