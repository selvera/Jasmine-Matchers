// public
module.exports = function toBeJsonString(actual: any): boolean {
  try {
    return JSON.parse(actual) !== null;
  } catch (err) {
    return false;
  }
};
