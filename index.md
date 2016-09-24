---
---

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

Other options include the minified version ([`dist/rest.min.js`](https://github.com/daviesgeek/restjs/blob/master/dist/rest.min.js)), the Node version ([`dist/rest.node.js`](https://github.com/daviesgeek/restjs/blob/master/dist/rest.min.js): includes an export statement for ES6 modules), and the polyfill & minified version ([`dist/rest.polyfill.min.js`](https://github.com/daviesgeek/restjs/blob/master/dist/rest.polyfill.min.js))

## Usage

### The 10 second version

```js

// Create a model factory
let Doctor = Rest.factory('doctors')

// Create a new element, passing in the object as the first argument
let doctor = Doctor.create({id: 11, first: "Matt", last: "Smith"})

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

### Config

Configuration can be set using `Rest.Config.set()`:

```js
Rest.Config.set({baseUrl: 'https://restjs.js.org'})
```
##### `baseUrl`: String
The base URL for requests. I.e, if the `baseUrl` is set to `http://google.com`, all requests will be prefixed with `http://google.com`

##### `defaultParams`: Object
The default parameters for requests. Can be overriden by specific requests

##### `fields`: Object
Custom fields that RestJS uses to pick up on properties needed.

###### &nbsp;&nbsp;&nbsp;&nbsp; `id`: String
&nbsp;&nbsp;&nbsp;&nbsp; The property that RestJS should use as the id. This will be used for subsequent requests, such as DELETE, PUT or PATCH requests: `<baseUrl>/<resource>/<id field>`

##### `headers`: String[String[]]
An array of headers to send for the request. The headers must be an array, with each element containing an array, with the first element being the header name and the second the header value.

```js

Rest.Config.set(
  {
    headers: [
      ['X-Requested-With': 'RestJ']
    ]
  }
)

```

See [`XMLHttpRequest.setRequestHeader()`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader)

##### `responseType`: String
The type of the response. See [`XMLHttpRequest.responseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)

##### `timeout`: Integer
The timeout setting for XHR requests. See [`XMLHttpRequest.timeout`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout)

##### `withCredentials`: Boolean
whether to send CORS credentials with the request or not. See [`XMLHttpRequest.withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)

## Development

Run `npm install` to install all the build tools. `src/rest.js` contains all the source code. Run `npm run build` to run [Babel](https://babeljs.io/) to compile for the browser.

### Tests

RestJS uses [Karma](https://karma-runner.github.io), [Mocha](https://mochajs.org/), and [Chai](http://chaijs.com/) for running tests.
Run local tests with `npm run unit`. Running `npm run test` will first lint the files, then run all the tests on Sauce Labs using [karma-sauce-launcher](https://github.com/karma-runner/karma-sauce-launcher).

### Docs

All docs are written using the [JSDoc](http://usejsdoc.org/) syntax.