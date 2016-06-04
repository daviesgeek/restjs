'use strict';
let expect = chai.expect

describe('RestJS', function () {

  var User, server;

  beforeEach(function () {
    Rest.Config.set({
      baseUrl: 'http://server.com',
      withCredentials: true,
    })

    User = Rest.factory('users')

    server = sinon.fakeServer.create()
    server.autoRespond = true
  })

  afterEach(function () {
    server.restore()
  })

  it('should create a factory', function () {
    expect(User).to.have.property('getList')
    expect(User).to.have.property('get')
  })

  it('should create an element using \'create\'', function () {
    let user = User.create({id: 1, first_name: "Matthew"})
    shouldBeRestified(user, 'users', false)
  })

  it('should make a getList request', function (done) {
    server.respondWith(function (request) {
      expect(request.method).to.equal('GET')
      expect(request.url).to.equal('http://server.com/users')
      expect(request.responseType).to.equal('json')
      request.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(data.users))
    })
    User.getList().then(function (users) {
      expect(users).to.exist
      users.forEach(function (user) {
        shouldBeRestified(user, 'users')
      })
      done()
    }, done)
  })

  it('should make a get request for a single element', function (done) {
    server.respondWith(function (request) {
      expect(request.method).to.equal('GET')
      expect(request.url).to.equal('http://server.com/users/1')
      expect(request.responseType).to.equal('json')
      request.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(data.users[0]))
    })

    User.get(1).then(function(user) {
      expect(user).to.exist
      expect(user.id).to.equal(1)
      shouldBeRestified(user, 'users')
      done()
    })
  })

  it('should make a post request', function (done) {
    server.respondWith(function (request) {
      expect(request.method).to.equal('POST')
      expect(request.url).to.equal('http://server.com/users')
      expect(request.responseType).to.equal('json')
      expect(request.requestBody).to.equal(JSON.stringify({"first_name": "Jose", "last_name": "Ellis", "email": "jellis0@japanpost.jp", "country": "Indonesia", "ip_address": "202.88.170.138"}))

      let returnUser = data.users[0]
      returnUser.id = 42

      request.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(returnUser))
    })

    User.create({
      "first_name": "Jose",
      "last_name": "Ellis",
      "email": "jellis0@japanpost.jp",
      "country": "Indonesia",
      "ip_address": "202.88.170.138"
    }).post().then(function (user) {
      expect(user.id).to.equal(42)
      shouldBeRestified(user, 'users')
      done()
    })

  })

  describe('should make a patch request', function () {

    let user = Rest.factory('users').create({id: 1, first_name: "John", last_name: "Smith"})

    shouldBeRestified(user, 'users', false)

    it('with an object', function (done) {
      server.respondWith(function (request) {
        expect(request.method).to.equal('PATCH')
        expect(request.url).to.equal('http://server.com/users/1')
        expect(request.responseType).to.equal('json')
        expect(request.requestBody).to.equal(JSON.stringify({first_name: "John"}))

        request.respond(200, { 'Content-Type': 'application/json' }, request.requestBody)
      })

      user.patch({first_name: "John"}).then(function (data) {
        expect(JSON.stringify(data)).to.equal(JSON.stringify({first_name: "John"}))
        done()
      })

      shouldBeRestified(user, 'users', false)
    })

    it('with an object and params', function (done) {
      server.respondWith(function (request) {
        expect(request.method).to.equal('PATCH')
        expect(request.url).to.equal('http://server.com/users/1?with=all')
        expect(request.responseType).to.equal('json')
        expect(request.requestBody).to.equal(JSON.stringify({first_name: "John"}))

        request.respond(200, { 'Content-Type': 'application/json' }, request.requestBody)
      })

      user.patch({first_name: "John"}, {with: 'all'}).then(function (data) {
        expect(JSON.stringify(data)).to.equal(JSON.stringify({first_name: "John"}))
        done()
      })

      shouldBeRestified(user, 'users', false)
    })

    it('with string properties', function (done) {
      server.respondWith(function (request) {
        expect(request.method).to.equal('PATCH')
        expect(request.url).to.equal('http://server.com/users/1')
        expect(request.responseType).to.equal('json')
        expect(request.requestBody).to.equal(JSON.stringify({id: 1, first_name: "John", last_name: "Smith"}))

        request.respond(200, { 'Content-Type': 'application/json' }, request.requestBody)
      })

      user.patch('id', 'first_name', 'last_name').then(function (data) {
        expect(JSON.stringify(data)).to.equal(JSON.stringify({id: 1, first_name: "John", last_name: "Smith"}))
        done()
      })

      shouldBeRestified(user, 'users', false)
    })

    it('with string properties and params', function (done) {
      server.respondWith(function (request) {
        expect(request.method).to.equal('PATCH')
        expect(request.url).to.equal('http://server.com/users/1?with=all')
        expect(request.responseType).to.equal('json')
        expect(request.requestBody).to.equal(JSON.stringify({id: 1, first_name: "John", last_name: "Smith"}))

        request.respond(200, { 'Content-Type': 'application/json' }, request.requestBody)
      })

      user.patch('id', 'first_name', 'last_name', {with: 'all'}).then(function (data) {
        expect(JSON.stringify(data)).to.equal(JSON.stringify(user))
        done()
      })

      shouldBeRestified(user, 'users', false)
    })

  })

  it('should make a put request', function (done) {
    server.respondWith(function (request) {
      expect(request.method).to.equal('PUT')
      expect(request.url).to.equal('http://server.com/users/1')
      expect(request.responseType).to.equal('json')
      expect(request.requestBody).to.equal(JSON.stringify({id: 1, first_name: "John", last_name: "Smith"}))

      request.respond(200, { 'Content-Type': 'application/json' }, request.requestBody)
    })

    let user = User.create({id: 1, first_name: "John", last_name: "Smith"})
    user.put().then(function (data) {
      expect(data).to.deep.equal(user)
      done()
    })
  })

  it('should add factory methods', function () {
    var model = Rest.factory('users', {
      getUserTypes: function () {
        return ['admin', 'standard']
      }
    })

    expect(model)
  })

  it('should add element methods', function () {
    var model = Rest.factory('users', null, {
      types: ['admin', 'standard'],
      setRole: function(type) {
        if (this.types.indexOf(type) != -1)
          this.role = type
      }
    })

    var user = model.create({id: 1, name: "Bob", role: "standard"})

    expect(user).to.have.property('types')
    expect(user).to.have.property('setRole')
    expect(user.setRole).to.be.a('function')

    user.setRole('admin')

    expect(user.role).to.equal('admin')
  })

  function shouldBeRestified(element, route, fromServer=true) {
    expect(element).to.exist
    expect(element).to.have.property('get')
    expect(element).to.have.property('post')
    expect(element).to.have.property('patch')
    expect(element).to.have.property('put')
    expect(element).to.have.ownPropertyDescriptor('route', {enumerable: false, configurable: false, writable: false, value: route})
    expect(element).to.have.ownPropertyDescriptor('fromServer', {enumerable: false, configurable: true, writable: false, value: fromServer})
  }
})