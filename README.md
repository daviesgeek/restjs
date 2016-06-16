# RestJS

[![CircleCI](https://circleci.com/gh/daviesgeek/restjs/tree/master.svg?style=svg)](https://circleci.com/gh/daviesgeek/restjs/tree/master)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/restjs.svg)](https://saucelabs.com/u/restjs)


RestJS is somewhat based off [Restangular](https://github.com/mgonto/restangular). It is an “ORM” style library for consuming REST APIs on the frontend.

This is very much still a 1.0 version, so expect breaking changes and feature updates. It's also only really been tested in Chrome on OS X and PhantomJS, so it definitely needs more browser testing.

If you'd like, fill out [this form](http://goo.gl/forms/K3noZAe0MX1j8OjT2) to receive an invite to Slack.

## Installing

Install using [Bower](http://bower.io):

```js
bower install restjs
```

By default, the non-minified, non-polyfill version is set as [the `main` property](https://github.com/bower/spec/blob/master/json.md#main) for the Bower package. The polyfill version includes [the Babel polyfill](https://babeljs.io/docs/usage/polyfill/) in the source. Depending on what you're doing, you might need the polyfill to be included. Here's a quick example of how to use the polyfill version instead:

```js
{
  "overrides": {
    "restjs": {
      "main": [
        "dist/rest.polyfill.js"
      ]
    }
  }
}
```

## Usage

### The 10 second version

```js

// Create a model factory
let Doctor = Rest.factory('doctors')

// Create a new user, passing in the object as the first argument
let doctor = User.create({id: 11, first: "Matt", last: "Smith"})

// Save it!
doctor.post()

// Update something
doctor.name = "Matthew"
doctor.patch()

// Get a list of users
Doctor.getList().then(function(doctors) {
  // Do something with the array
})

```

## Development

Run `npm install` to install all the build tools. `src/rest.js` contains all the source code. Run `npm run build` to run [Babel](https://babeljs.io/) to compile for the browser.

### Tests

RestJS uses [Karma](https://karma-runner.github.io), [Mocha](https://mochajs.org/), and [Chai](http://chaijs.com/) for running tests.
Run local tests with `npm run unit`. Running `npm run test` will first lint the files, then run all the tests on Sauce Labs using [karma-sauce-launcher](https://github.com/karma-runner/karma-sauce-launcher).

### Docs

All docs are written using the [JSDoc](http://usejsdoc.org/) syntax.