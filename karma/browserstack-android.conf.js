const baseConfig = require('./browserstack.conf');

module.exports = function (config) {
  baseConfig({
    set(base) {
      base.browsers = [
        'android-8.0',
        'android-7.1',
        'android-7.0',
        'android-6.0',
        'android-5.1'
      ];
      config.set(base);
    }
  });
};
