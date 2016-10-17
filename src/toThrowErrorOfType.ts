// public
module.exports = function toThrowErrorOfType(type: string, actual: any): boolean {
  try {
    actual();
    return false;
  } catch (err) {
    return err.name === type;
  }
};
