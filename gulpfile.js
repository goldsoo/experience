var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var data = require('gulp-data');
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var cached = require('gulp-cached');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');

var base = {
  data: 'data',
  src: 'src',
  dist: 'dist'
};

gulp.task('server', function() {
  connect.server({
    root: base.dist,
    port: 8080
  });
});

gulp.task('scripts', function() {
  var dir = 'scripts';

  return gulp
    .src(path.join(base.src, dir, '**/*.js'))
    .pipe(cached(dir))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(path.join(base.dist, dir)));
});

gulp.task('images', function() {
  var dir = 'images';

  return gulp
    .src(path.join(base.src, dir, '**/*.{png,jpg,gif,jpeg}'))
    .pipe(cached(dir))
    .pipe(gulp.dest(path.join(base.dist, dir)));
});

gulp.task('styles', function() {
  var dir = 'styles';

  return gulp
    .src(path.join(base.src, dir, '**/*.scss'))
    .pipe(cached(dir))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass({
      outputStyle: 'expanded'
    })
    .on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(path.join(base.dist, dir)));
});

gulp.task('html', function buildHTML() {
  var dir = 'views';

  return gulp
    .src([
      path.join(base.src, dir, '**/*.pug'),
      path.join('!' + base.src, dir, 'layouts/*.pug')
    ])
    .pipe(cached(dir))
    .pipe(pug({
      pretty: true,
      basedir: path.join(base.src, 'views'),
      locals: require('./data/texts/resume.json')
    }))
    .pipe(gulp.dest(path.join(base.dist)));
});

gulp.task('data_texts', function() {
  var dir = 'texts';

  return gulp
    .src(path.join(base.data, dir, '**/*.json'))
    .pipe(cached('data-' + dir))
    .pipe(gulp.dest(path.join(base.dist, base.data, dir)));
});

gulp.task('clean', function() {
  return gulp
    .src(base.dist, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('watch', function () {
  gulp.watch(path.join(base.src, 'styles', '**/*.scss'), ['styles']);
  gulp.watch(path.join(base.src, 'views', '**/*.pug'), ['html']);
  gulp.watch(path.join(base.src, 'scripts', '**/*.js'), ['scripts']);
  gulp.watch(path.join(base.src, 'images', '**/*.{png,jpg,gif,jpeg}'), ['images']);
  gulp.watch(path.join(base.data, 'texts', '**/*.json'), ['data_texts']);
});

gulp.task('default', sequence('clean', [
  'html',
  'images',
  'styles',
  'scripts',
  'data_texts'
],
  'server',
  'watch'
));
