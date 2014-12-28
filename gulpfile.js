var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    sequence = require('run-sequence'),
    less = require('gulp-less'),
    gutil =  require('gulp-util');

var paths = {
  dev: {
    main_js_file: './assets/js/app.js',
    main_css_file: './assets/css/app.less',
    base_js_dir: './assets/js/**',
    js: './assets/js/**/*.js',
    css: './assets/css/**/*.less'
  },
  prod: {
    js: './public/js',
    css: './public/css'
  }
};

var isProduction = gutil.env.type === "production";

gulp.task('js', function() {
  gulp.src(paths.dev.main_js_file)
    .pipe(plumber()) 
    .pipe(browserify())
    .pipe(concat('index.js'))
    .pipe(gulpif(isProduction, uglify())) // only minify if production
    .pipe(gulp.dest(paths.prod.js));
});

gulp.task('css', function() {
  gulp.src(paths.dev.main_css_file)
    .pipe(plumber())
    .pipe(less({
      compress: true
    }))
    .pipe(gulp.dest(paths.prod.css));
});

gulp.task('lint', function() {
  gulp.src(paths.dev.js)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  gulp.watch(paths.dev.base_js_dir, function() {
    sequence(
      'lint',
      'js'
    )
  });
  gulp.watch(paths.dev.css, function() {
    sequence('css');
  })
});

gulp.task('build', ['js', 'css']);
