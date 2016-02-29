var gulp = require('gulp'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    csscomb = require('gulp-csscomb'),
    postcss = require('gulp-postcss'),
    stylus = require ('gulp-stylus'),
    autoprefixer = require('autoprefixer'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    concat = require('gulp-concat-util');

gulp.task('connect', function() {
  connect.server({
    root: [__dirname],
    livereload: true,
    port: 8080
  });
});

gulp.task('html', function(){
  gulp.src('src/pages/**/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('./build/pages'))
    .pipe(connect.reload());
});

gulp.task('stylus', function() {
  gulp.src('src/stylus/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('src/css'));
})

gulp.task('css', function(){
  gulp.src('src/css/**/*.css')
    .pipe(postcss([ autoprefixer({ browsers: ['last 20 versions'] }) ]))
    .pipe(csscomb('src/css/config-csscomb.json'))
    .pipe(concat.header('/* ============================= START <%= file.relative %> ============================= */\n'))
    .pipe(concat.footer('\n/* ============================= END <%= file.relative %> ============================= */\n'))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(cssmin())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./build/css'))
    .pipe(connect.reload());
});

gulp.task('img', function () {
    gulp.src('src/img/**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('build/img'))
        .pipe(connect.reload());
});
gulp.task('fonts', function() {
    gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'))
});
gulp.task('js', function(){
  return gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/stylus/**/*.styl', ['stylus']);
  gulp.watch('src/css/**/*.css', ['css']);
  gulp.watch('src/img/**/*.*', ['img']);
  gulp.watch('src/fonts/**/*.*', ['fonts']);
  gulp.watch('src/pages/**/*.html', ['html']);
});

gulp.task('default', ['connect', 'html', 'stylus', 'css', 'img', 'fonts', 'js', 'watch']);