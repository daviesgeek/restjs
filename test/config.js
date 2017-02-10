module.exports = function (config) {
  var customLaunchers = {
    "SL_Chrome": {
       base: "SauceLabs",
       browserName: "chrome",
       platform: "Windows 8.1"
    },
    "SL_Chrome_Linux": {
       base: "SauceLabs",
       browserName: "chrome",
       platform: "Linux"
    },
    "SL_Chrome_OSX": {
       base: "SauceLabs",
       browserName: "chrome",
       platform: "OS X 10.10"
    },
    "SL_Firefox": {
       base: "SauceLabs",
       browserName: "firefox",
       platform: "Windows 8.1"
    },
    "SL_Firefox_Linux": {
       base: "SauceLabs",
       browserName: "firefox",
       platform: "Linux"
    },
    "SL_Firefox_OSX": {
       base: "SauceLabs",
       browserName: "firefox",
       platform: "OS X 10.10"
    },

    "SL_IE_10": {
       base: "SauceLabs",
       browserName: "internet explorer",
       platform: "Windows 8",
       version: "10"
    },
    "SL_IE_11": {
       base: "SauceLabs",
       browserName: "internet explorer",
       platform: "Windows 8.1",
       version: "11"
    },
    "SL_Opera": {
       base: "SauceLabs",
       browserName: "opera",
       platform: "Windows 7"
    },
    "SL_Opera_Linux": {
       base: "SauceLabs",
       browserName: "opera",
       platform: "Linux"
    },
    "SL_Safari_6": {
       base: "SauceLabs",
       browserName: "safari",
       platform: "OS X 10.8",
       version: "6"
    },
    "SL_Safari_7": {
       base: "SauceLabs",
       browserName: "safari",
       platform: "OS X 10.9",
       version: "7"
    },
    "SL_Safari_8": {
       base: "SauceLabs",
       browserName: "safari",
       platform: "OS X 10.10",
       version: "8"
    },
  }

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
    browsers: ['PhantomJS'].concat(Object.keys(customLaunchers)),

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
    },

    sauceLabs: {
      startConnect: true,
      username: 'restjs',
      accessKey: '066cbbf5-07ec-4933-a088-cc8352a7dd24',
      testName: "RestJS Unit Tests",
    },
    customLaunchers: customLaunchers
  })
}