const baseConfig = require('./browserstack.conf');

module.exports = function (config) {
  baseConfig({
    set(base) {
      base.browsers = [
        'iphone-10.0',
        'iphone-9.1',
        'iphone-8.3',
        'iphone-7.0',
        'iphone-6.0'
        // 'iphone-5.1', // does not support new Date('ISO 8601')
        // 'iphone-5.0' // browser does not launch
      ];
      config.set(base);
    }
  });
};
