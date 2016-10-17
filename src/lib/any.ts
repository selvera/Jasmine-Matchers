// public
module.exports = function every(array: any[], truthTest: Function): boolean {
  for (var i = 0, len = array.length; i < len; i++) {
    if (truthTest(array[i])) {
      return true;
    }
  }
  return false;
};
