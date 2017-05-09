(function () {
	'use strict';
	module.exports = function (GLOBAL, gulp) {
		const clean = require('gulp-clean');
		return function () {
			return gulp.src(GLOBAL.dirs.dist_base, {read: false})
				.pipe(clean({force:true}));
		}
	}
})();
