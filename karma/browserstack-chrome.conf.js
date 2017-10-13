const baseConfig = require('./browserstack.conf');

module.exports = function (config) {
  baseConfig({
    set(base) {
      base.browsers = [
        'chrome-61.0',
        'chrome-60.0',
        'chrome-59.0',
        'chrome-58.0',
        'chrome-57.0'
      ];
      config.set(base);
    }
  });
};
