"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // runs a local dev server
var open = require('gulp-open'); // open a url in a web browser
var babel = require('gulp-babel');

var config = {
  port: 9005,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/*.js',
    xml: './data/xml/*.xml',
    txt: './data/txt/*.txt',
    dist: './dist',
    distxml: './dist/data/xml',
    disttxt: './dist/data/txt'
  }
}

// start a local dev server
gulp.task('connect', function() {
  connect.server({
    root: config.paths.dist,
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

gulp.task('open', ['connect'], function() {
  gulp.src('dist/index.html')
    .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
});

gulp.task('html', function() {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task('data', function() {
  gulp.src(config.paths.txt)
    .pipe(gulp.dest(config.paths.disttxt));
});

gulp.task('data', function() {
  gulp.src(config.paths.xml)
    .pipe(gulp.dest(config.paths.distxml));
});

gulp.task('babel', function() {
  gulp.src(config.paths.js)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.dist));
});

gulp.task('watch', function() {
   gulp.watch(config.paths.html, ['html'])
});

gulp.task('default', ['data', 'html', 'babel', 'open', 'watch']);
