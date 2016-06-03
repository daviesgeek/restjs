# RestJS

I'm sure the name will change, but here goes nothing!

RestJS is somewhat based off [Restangular](https://github.com/mgonto/restangular) and is an attempt to create a sort of frontend "ORM" for consuming RESTful APIs.

### The 10 second version

```js

// Create a model factory
let User = Rest.factory('users')

// Create a new user, passing in the object as the first argument
let user = User.create({id: 11, first: "Matt", last: "Smith"})

// Save it!
user.post()

// Update something
user.name = "Matthew"
user.patch()

// Get a list of users
User.getList().then(function(users) {
  // Do something with the array
})

```

### Tests

Run tests in the browser after running `npm install` by opening `test/test.html` in the browser of your choice (only tested in Chrome)