// modules
var reduce = require('./reduce');

// public
module.exports = function keys(object: Object): string[] {
  return reduce(object, appendKey, []);
};

function appendKey (keys: string[], value: any, key: string): string[] {
  return keys.concat(key);
}
