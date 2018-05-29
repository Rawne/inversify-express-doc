module.exports = {
  dirs: {
    gulp: './gulp/',
    base: 'dist/',
    dist_base: './dist/',
    src: './src/',
    src1: './src/*.ts',
    src2: './src/**/*.ts',
    src3: './src/**/**/*.ts',
    testsrc: './test/**/*.ts',
    dist: {
      src: './dist/',
      tests: './dist/**/*tests.js',
      instrument: './dist/**/*.js'
    },
    coverage: './coverage/coverage-final.json',
    lcovonly:'./coverage/lcov.info'
  }
};
