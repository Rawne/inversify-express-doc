(function () {
	'use strict';

	module.exports = function (GLOBAL, gulp) {
		const ts = require('gulp-typescript');
		const tsProject = ts.createProject('tsconfig.json');
		const sourcemaps = require('gulp-sourcemaps');

		return function () {
				return tsProject.src()
				.pipe(sourcemaps.init())
				.pipe(tsProject())
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(GLOBAL.dirs.dist_base))
		}
}
})();
