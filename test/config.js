module.exports = function (config) {
  var customLaunchers = {
    "SL_Android_4.0": {
       base: "SauceLabs",
       browserName: "Android",
       platform: "Linux",
       version: "4.0"
    },
    "SL_Android_4.1": {
       base: "SauceLabs",
       browserName: "Android",
       platform: "Linux",
       version: "4.1"
    },
    "SL_Android_4.2": {
       base: "SauceLabs",
       browserName: "Android",
       platform: "Linux",
       version: "4.2"
    },
    "SL_Android_4.3": {
       base: "SauceLabs",
       browserName: "Android",
       platform: "Linux",
       version: "4.3"
    },
    "SL_Android_4.4": {
       base: "SauceLabs",
       browserName: "Android",
       platform: "Linux",
       version: "4.4"
    },
    "SL_Android_5.0": {
       base: "SauceLabs",
       browserName: "Android",
       platform: "Linux",
       version: "5.0"
    },
    "SL_Chrome": {
       base: "SauceLabs",
       browserName: "Chrome",
       platform: "Windows 8.1"
    },
    "SL_Chrome_Linux": {
       base: "SauceLabs",
       browserName: "Chrome",
       platform: "Linux"
    },
    "SL_Chrome_OSX": {
       base: "SauceLabs",
       browserName: "Chrome",
       platform: "OS X 10.10"
    },
    "SL_Firefox": {
       base: "SauceLabs",
       browserName: "Firefox",
       platform: "Windows 8.1"
    },
    "SL_Firefox_Linux": {
       base: "SauceLabs",
       browserName: "Firefox",
       platform: "Linux"
    },
    "SL_Firefox_OSX": {
       base: "SauceLabs",
       browserName: "Firefox",
       platform: "OS X 10.10"
    },

    "SL_IE_10": {
       base: "SauceLabs",
       browserName: "Internet Explorer",
       platform: "Windows 8",
       version: "10"
    },
    "SL_IE_11": {
       base: "SauceLabs",
       browserName: "Internet Explorer",
       platform: "Windows 8.1",
       version: "11"
    },
    "SL_IOS_6": {
       base: "SauceLabs",
       browserName: "iPhone",
       platform: "OS X 10.8",
       version: "6.1"
    },
    "SL_IOS_7": {
       base: "SauceLabs",
       browserName: "iPhone",
       platform: "OS X 10.9",
       version: "7.1"
    },
    "SL_IOS_8": {
       base: "SauceLabs",
       browserName: "iPhone",
       platform: "OS X 10.10",
       version: "8.1"
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
       browserName: "Safari",
       platform: "OS X 10.8",
       version: "6"
    },
    "SL_Safari_7": {
       base: "SauceLabs",
       browserName: "Safari",
       platform: "OS X 10.9",
       version: "7"
    },
    "SL_Safari_8": {
       base: "SauceLabs",
       browserName: "Safari",
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
      testName: "RestJS Unit Tests",
    },
    customLaunchers: customLaunchers
  })
}