// modules
var any = require('./lib/any');
var toBeString = require('./toBeString');

// public
module.exports = function toBeIso8601(actual: any): boolean {
  return toBeString(actual) && any(patterns, matches) && new Date(actual).toString() !== 'Invalid Date';

  function matches(pattern: string): boolean {
    var regex = '^' + expand(pattern) + '$';
    return actual.search(new RegExp(regex)) !== -1;
  }
}

// implementation
var patterns = [
  'nnnn-nn-nn',
  'nnnn-nn-nnTnn:nn',
  'nnnn-nn-nnTnn:nn:nn',
  'nnnn-nn-nnTnn:nn:nn.nnn',
  'nnnn-nn-nnTnn:nn:nn.nnnZ'
];

function expand(pattern: string): string {
  return pattern
    .split('-').join('\\-')
    .split('.').join('\\.')
    .split('nnnn').join('([0-9]{4})')
    .split('nnn').join('([0-9]{3})')
    .split('nn').join('([0-9]{2})');
}
