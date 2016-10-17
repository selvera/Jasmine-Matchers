declare module NodeJS  {
  interface Global {
    any: any
  }
}

// 3rd party modules
var loader = require('jasmine-matchers-loader');

// modules
var api = require('./api');
var asymmetricMatchers = require('./asymmetricMatchers');

// public
module.exports = api.matcher;

// implementation
loader.add(api.matcher);
global.any = asymmetricMatchers;
