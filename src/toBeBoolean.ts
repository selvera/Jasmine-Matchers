// modules
var is = require('./lib/is');

// public
module.exports = function toBeBoolean(actual: any): boolean {
  return is(actual, 'Boolean');
};
