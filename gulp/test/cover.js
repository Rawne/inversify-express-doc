/**
 * Created by Maartje on 20/10/16.
 */

(function () {
	'use strict';

	module.exports = function (GLOBAL, gulp) {
		const istanbul = require('gulp-istanbul');
		const mocha = require('gulp-mocha');
		const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

		return function () {
			return gulp.src(GLOBAL.dirs.dist.tests)
				.pipe(mocha({ui:'bdd'})) //runs tests
				.pipe(istanbul.writeReports({
					reporters: [ 'json' ]})) //this yields a basic non-sourcemapped coverage.json file
				.on('end', remapCoverageFiles); //remap
			function remapCoverageFiles() {
				return gulp.src(GLOBAL.dirs.coverage)
					.pipe(remapIstanbul({
						basePath: GLOBAL.dirs.dist_base,
						reports: {
							'text-summary': null,
							'lcovonly': GLOBAL.dirs.lcovonly
						}
					}));
			}

		}
	}
})();