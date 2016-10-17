// public
module.exports = function is(value: any, type: string): boolean {
  return Object.prototype.toString.call(value) === '[object ' + type + ']';
};
