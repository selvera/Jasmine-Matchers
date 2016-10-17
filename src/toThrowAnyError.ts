// public
module.exports = function toThrowAnyError(actual: any): boolean {
  try {
    actual();
    return false;
  } catch (err) {
    return true;
  }
};
