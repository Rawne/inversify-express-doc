/**
 * Created by Maartje on 20/10/16.
 */
(function () {
	'use strict';

	module.exports = function (GLOBAL, gulp) {
		const istanbul = require('gulp-istanbul');

		return function () {
			return gulp.src(GLOBAL.dirs.dist.instrument)
				.pipe(istanbul())
				.pipe(istanbul.hookRequire()); //this forces any call to 'require' to return our instrumented files
		}
	}
})();