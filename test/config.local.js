module.exports = function (config) {
  config.set({
    basePath: '../',
    autoWatch: true,
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'src/*.js',

      'test/data.js',
      'test/test.js',
    ],
    concurrency: 1,
    browsers: ['PhantomJS'],

    reporters: ['progress', 'coverage', 'coveralls', 'junit', 'saucelabs'],
    preprocessors: {
      'src/*.js': ['coverage', 'babel'],
      'test/*.js': ['babel'],
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },

    plugins: [
      'karma-chai',
      'karma-coverage',
      // 'karma-chrome-launcher',
      // 'karma-firefox-launcher',
      // 'karma-junit-reporter',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-sinon',
      // 'karma-safari-launcher',
      'karma-babel-preprocessor',
      'karma-junit-reporter',
      'karma-coveralls',
      'karma-sauce-launcher',
    ],

    singleRun: false,
    coverageReporter: {
      reporters: [
        {
          type: 'html',
          dir: (process.env.CIRCLE_TEST_REPORTS || '') + 'coverage/html'
        },
        {
          type: 'lcov',
          dir: (process.env.CIRCLE_TEST_REPORTS || '') + 'coverage/lcov'
        }
      ]
    },
    junitReporter: {
      outputDir: (process.env.CIRCLE_TEST_REPORTS || 'coverage')
    }
  })
}