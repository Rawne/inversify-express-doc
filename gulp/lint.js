(function () {
	'use strict';

	module.exports = function (GLOBAL, gulp) {
		const tslint = require('gulp-tslint');

		return function () {
			return gulp.src([GLOBAL.dirs.src1, GLOBAL.dirs.src2, GLOBAL.dirs.src3, GLOBAL.dirs.testsrc])
				.pipe(tslint({
					tslint: require('tslint'),
					formatter: "prose"
				})).pipe(tslint.report({
					emitError:false,
					summarizeFailureOutput:true
				}))
		}
	}
})();