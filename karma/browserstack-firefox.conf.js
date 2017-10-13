const baseConfig = require('./browserstack.conf');

module.exports = function (config) {
  baseConfig({
    set(base) {
      base.browsers = [
        'firefox-57.0 beta',
        'firefox-56.0',
        'firefox-55.0',
        'firefox-54.0',
        'firefox-53.0'
      ];
      config.set(base);
    }
  });
};
