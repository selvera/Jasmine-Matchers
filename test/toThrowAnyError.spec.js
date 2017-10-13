describe('toThrowAnyError', () => {
  describe('when supplied a function', () => {
    describe('when function errors when invoked', () => {
      let throwError;
      let badReference;
      beforeEach(function () {
        throwError = function () {
          throw new Error('wut?');
        };
        badReference = function () {
          return some.unreachable.value; // eslint-disable-line no-undef
        };
      });
      it('should confirm', function () {
        expect(throwError).toThrowAnyError();
        expect(badReference).toThrowAnyError();
      });
    });
    describe('when function does NOT error when invoked', () => {
      let noErrors;
      beforeEach(function () {
        noErrors = function () {};
      });
      it('should deny', function () {
        expect(noErrors).not.toThrowAnyError();
      });
    });
  });
});
