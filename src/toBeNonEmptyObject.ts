// modules
var is = require('./lib/is');
var keys = require('./lib/keys');

// public
module.exports = function toBeNonEmptyObject(actual: any): boolean {
  return is(actual, 'Object') && keys(actual).length > 0;
};
