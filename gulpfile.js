'use strict';

const GLOBAL = require('./gulp/config/gulpConfig');

const gulp = require('gulp');

//gulp tasks
gulp.task('clean', require(GLOBAL.dirs.gulp + 'clean')(GLOBAL, gulp));
gulp.task('lint', ['clean'], require(GLOBAL.dirs.gulp + 'lint')(GLOBAL, gulp));
gulp.task('build', ['lint'], require(GLOBAL.dirs.gulp + 'build')(GLOBAL, gulp));
gulp.task('copytemplates', ['build'], function() {
   gulp.src('./src/**/*')
   .pipe(gulp.dest(GLOBAL.dirs.dist_base));
});
gulp.task('test:instrument', ['copytemplates'], require(GLOBAL.dirs.gulp + 'test/instrument')(GLOBAL, gulp));
gulp.task('test:cover', ['test:instrument'], require(GLOBAL.dirs.gulp + 'test/cover')(GLOBAL, gulp));
gulp.task('test', ['test:cover']);
gulp.task('default', ['test']);
