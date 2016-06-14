# RestJS

RestJS is somewhat based off [Restangular](https://github.com/mgonto/restangular) and is an attempt to create a sort of frontend "ORM" for consuming RESTful APIs.

This is very much still a 1.0 version, so expect breaking changes and feature updates.

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

`src/rest.js` contains all the source code. Run `npm run build` to run [Babel](https://babeljs.io/) to compile for the browser.

### Tests

RestJS uses [Karma](https://karma-runner.github.io), [Mocha](https://mochajs.org/), and [Chai](http://chaijs.com/) for running tests.
Run tests after running `npm install` by using `npm run unit`

### Docs

All docs are written using the [JSDoc](http://usejsdoc.org/) syntax.