var gulp = require('gulp'),
  watch = require('gulp-watch'),
  connect = require('gulp-connect'),
  csscomb = require('gulp-csscomb');

gulp.task('connect', function() {
  connect.server({
    root: [__dirname],
    livereload: true,
    port: 8080
  });
});

gulp.task('html', function(){
  gulp.src('*.html')
    .pipe(connect.reload());
});

gulp.task('css', function(){
  gulp.src('css/*.css')
    .pipe(connect.reload());
});

gulp.task('autoprefixer', function () {
  var postcss      = require('gulp-postcss');
  var autoprefixer = require('autoprefixer');

  return gulp.src('css/*.css')
      .pipe(postcss([ autoprefixer({ browsers: ['last 20 versions'] }) ]))
      .pipe(csscomb('css/config-csscomb.json'))
      .pipe(gulp.dest('./dest'));
});

gulp.task('watch', function () {
  gulp.watch('css/*.css', ['css', 'autoprefixer']);
  gulp.watch('*.html', ['html']);
});

gulp.task('default', ['connect', 'html', 'css', 'autoprefixer', 'watch']);