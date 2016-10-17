// 3rd party modules
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var tsify = require('tsify');

// public
gulp.task('build-source', function() {
  return browserify({
      basedir: '.',
      debug: true,
      entries: ['index.ts'],
      cache: {},
      packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('jasmine-matchers.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-tests', function() {
  return browserify('./test/index.js')
    .bundle()
    .pipe(source('jasmine-matchers.spec.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', [
  'build-source',
  'build-tests'
]);
