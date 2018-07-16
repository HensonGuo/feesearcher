var gulp = require('gulp');
var jshint = require('gulp-jshint')

gulp.task('lint', function(){
	gulp.src(['**/*.js', '!node_modules/**/*.js', '!bin/**/*.js'])
    .pipe(jshint({
          esnext: true
      }))
    .pipe(jshint.reporter('default', { verbose: true}))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['lint']);