import addMatchers from 'add-matchers';
import * as matchersByName from './matchers';

addMatchers(matchersByName);

addMatchers.asymmetric({
  after: matchersByName.toBeAfter,
  arrayOfBooleans: matchersByName.toBeArrayOfBooleans,
  arrayOfNumbers: matchersByName.toBeArrayOfNumbers,
  arrayOfObjects: matchersByName.toBeArrayOfObjects,
  arrayOfSize: matchersByName.toBeArrayOfSize,
  arrayOfStrings: matchersByName.toBeArrayOfStrings,
  before: matchersByName.toBeBefore,
  calculable: matchersByName.toBeCalculable,
  emptyArray: matchersByName.toBeEmptyArray,
  emptyObject: matchersByName.toBeEmptyObject,
  evenNumber: matchersByName.toBeEvenNumber,
  greaterThanOrEqualTo: matchersByName.toBeGreaterThanOrEqualTo,
  iso8601: matchersByName.toBeIso8601,
  jsonString: matchersByName.toBeJsonString,
  lessThanOrEqualTo: matchersByName.toBeLessThanOrEqualTo,
  longerThan: matchersByName.toBeLongerThan,
  nonEmptyArray: matchersByName.toBeNonEmptyArray,
  nonEmptyObject: matchersByName.toBeNonEmptyObject,
  nonEmptyString: matchersByName.toBeNonEmptyString,
  oddNumber: matchersByName.toBeOddNumber,
  regExp: matchersByName.toBeRegExp,
  sameLengthAs: matchersByName.toBeSameLengthAs,
  shorterThan: matchersByName.toBeShorterThan,
  whitespace: matchersByName.toBeWhitespace,
  wholeNumber: matchersByName.toBeWholeNumber,
  withinRange: matchersByName.toBeWithinRange,
  endingWith: matchersByName.toEndWith,
  startingWith: matchersByName.toStartWith
});

export default matchersByName;
