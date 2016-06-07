'use strict'

/**
 * The globally available RestJS library
 * @class Rest
 */
var Rest = {}

/**
 * The default configuration options
 *
 * `headers`: the default headers for requests, defaults to an empty array, expected type: `[String, String]` <br />
 * `responseType`: the response type for the request. See [the docs for `XMLHttpRequest.responseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType) <br />
 * `fields`: the special fields used to determine url (and later, header) information <br />
 * `baseUrl`: the base URL for resources <br />
 *
 *  @name Rest#Config
 *  @class
 */
Rest.Config = {
  headers: [],
  responseType: 'json',
  fields: {
    id: 'id'
  },
  baseUrl: ''
}

/**
 * Sets a given config to the configuration object
 * @param {Object} config The specified config
 * @memberOf  Rest#Config
 */
Rest.Config.set = function(config) {
  Object.assign(Rest.Config, config)
}

/**
 * Holds the response interceptors
 * @see Rest.addResponseInterceptor
 *
 * @type {Array}
 * @private
 */
Rest._responseInterceptors = []

/**
 * Adds a response interceptor, which is run when a response is received
 *
 * @example
 *
 * Rest.addResponseInterceptor(function(data, responseType, route, responseURL, reject)) {
 *     data:         The response data
 *     responseType: The response type. See {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType |the docs}
 *     route:        The route used for {@link _makeRequest}
 *     responseURL:  See {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL |the docs for `XMLHttpRequest.responseURL`}
 *     reject:       The `reject` method from the Promise for the request
 * })
 *
 * Expected format:
 *
 * function(data, responseType, route, responseURL, reject)
 *
 * @param {Function} func The interceptor (see the example)
 */
Rest.addResponseInterceptor = function(func) {
  Rest._responseInterceptors.push(func)
}

/**
 * Holds response extractors
 * @see Rest.addResponseExtractor
 *
 * @type {Array}
 * @private
 */
Rest._responseExtractors = []

/**
 * Adds a response extractor, which manipulates the data after the response is received, but _after_ interceptors are run
 *
 * @example <caption>MAKE SURE YOU RETURN THE DATA. If you don't, the request will not resolve with data</caption>
 *
 * Rest.addResponseExtractor(function(data) {
 *   return data
 * })
 *
 *
 * @param {Function} func The extractor
 */
Rest.addResponseExtractor = function(func) {
  Rest._responseExtractors.push(func)
}

/**
 * The factory creator method for RestJS
 * @param  {String} route              The route
 * @param  {(Object|Function)} factoryTransformer A transformer that is either added to the factory (if it's an object) or run on the factory (if it's a function)
 * @param  {(Object|Function)} elementTransformer A transformer that is either added to the element (if it's an object) or run on the element (if it's a function)
 * @param  {Object} customConfig       A custom configuration object @see Rest.Config
 * @return {Factory}                   A newly created Factory
 */
Rest.factory = function(route, factoryTransformer, elementTransformer, customConfig=null) {

  // Create the Factory, passing the necessary property descriptors
  let factory = Object.create(Factory, {

    /**
     * The route
     * @type {String}
     * @memberOf Factory
     * @instance
     */
    route: {
      configurable: false,
      enumerable: false,
      value: route.replace(/^\/|\/$/g, "")
    },

    /**
     * The configuration
     * @type {Object}
     * @memberOf Factory
     * @instance
     */
    config: {
      configurable: false,
      enumerable: false,
      value: customConfig || Rest.Config
    },

    /**
     * The transformer to be run on each element
     * @type {Function}
     * @memberOf Factory
     * @instance
     */
    elementTransformer: {
      configurable: false,
      enumerable: false,
      value: elementTransformer
    }
  })

  // Make sure the prototype is set either to the transformer (if it's an object), or else, an empty object
  let transformer = typeof factoryTransformer == 'object' ? factoryTransformer : {}

  // Add the transformer methods, or an empty object (see above line)
  Object.assign(factory, transformer)

  // Only run the transformer if it's a function
  if(typeof factoryTransformer == 'function')
    factory = factoryTransformer(factory)

  // All done creating the factory, return it!
  return factory
}

/**
 * Makes a request with the necessary config
 * @param  {Object}     config
 * @param  {String}     verb       The HTTP verb: GET, POST, PATCH, PUT
 * @param  {String}     route
 * @param  {Object}     params={}  The URL parameters for the request
 * @param  {Factory}    factory
 * @param  {Object}     [body]     The body of the request
 * @return {Promise<xhr.response>} A promise that is resolved or rejected based on the request
 */
Rest._makeRequest = function(config, verb, route, params={}, factory, body) {

  // Create a new promise and a new XHR request
  let promise = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()

    // Set the xhr config
    if('timeout' in config)
      xhr.timeout         = config.timeout
    xhr.withCredentials = config.withCredentials
    xhr.responseType    = config.responseType

    // This callback is called when the request comes back
    xhr.onreadystatechange = function() {
      let data = xhr.response

      // Check to make sure the request is done
      if (xhr.readyState == XMLHttpRequest.DONE) {

        // Loop over the interceptors and extractors, running each of them on the response
        Rest._responseInterceptors.forEach(function (interceptor) {
          interceptor(data, xhr.responseType, route, xhr.responseURL, reject)
        })
        Rest._responseExtractors.forEach(function(extractor) {
          data = extractor(data)
        })

        // If the status isn't 200, reject the promise
        if (xhr.status != 200)
          return reject()

        // Make sure there's data before restifying it, otherwise just resolve with null
        if(data && Object.keys(data).length)
          resolve(Rest._restify(data, factory, config))
        else
          resolve(null)
      }

    }

    // Open the XHR request. See {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open |the docs}
    xhr.open(verb, Rest._createUrl(route, params), true)

    // @todo: switch based on type
    xhr.setRequestHeader("Content-type", "application/json")

    // Loop through all the headers and set the header
    config.headers.forEach((header) => {
      xhr.setRequestHeader(header[0], header[1])
    })

    // If the body exists and the response type is JSON, stringify it first
    // Otherwise, just send it as is,
    // Else, just send it without a body
    if (body && xhr.responseType == 'json')
      return xhr.send(JSON.stringify(body))
    else
      return xhr.send(body)
    return xhr.send()
  })

  return promise
}

/**
 * Create a url based off a route and a parameter object
 *
 * @todo Fix the config object; pass it in instead of referring to it directly
 * @param  {String} route  The route for the request, from when the factory was created
 * @param  {Object=} params={} The URL parameters for the request
 * @return {String} The created url, complete with the baseURL prepended and the parameters URL-encoded and appended
 */
Rest._createUrl = function(route, params={}) {

  // Fetch the baseUrl from configuration, stripping all trailing slashes
  let baseUrl = Rest.Config.baseUrl.replace(/\/+$/, "")

  // Url-encode the params
  // @todo: Add support for arrays and objects
  let encodedParams = Object.keys(params).reduce(function (array, key) {

    // Push each element onto the array and
    array.push(`${key}=${encodeURIComponent(params[key])}`)
    return array

  // Join the array of (now encoded) params with &'s
  }, []).join('&')

  // Return the entire URL, optionally adding the parameter string if it exists
  return `${baseUrl}/${route}` + (encodedParams ? `?${encodedParams}` : '')
}

/**
 * "Restifies" an element: add the default Rest methods to the prototype, and run it through the transformer
 * @param  {Object} response The response object from [`xhr.response`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response)
 * @param  {Factory} factory The factory object that created the request
 * @param  {Object} config   The configuration for the element
 * @return {Element} The newly created Element, as returned by {@link Factory.create}
 */
Rest._restify = function(response, factory, config) {

  // If the passed-in response an array
  if (Array.isArray(response)) {

    // Loop over the array, restify each of the elements and return the new array
    return response.reduce(function(array, element) {
      array.push(Rest._restify(element, factory, config))
      return array
    }, [])
  }

  // If it's not an array, call the create method, passing in the response, and set `fromServer` to true (the last parameter)
  return factory.create.call(factory, response, true)
}

/**
 * The base factory class
 *
 * @class Factory
 */
let Factory = function() {}

/**
 * Creates an element
 * @param  {object}  element     The element to create
 * @param  {Boolean=} [fromServer=false] Whether this element is from the server or not
 * @return {Element}
 */
Factory.create = function(element, fromServer=false) {
  let instance = Object.create(Element, {

    /**
     * The route
     * @type {String}
     * @memberof Element
     * @instance
     */
    route: {
      configurable: false,
      enumerable: false,
      value: this.route
    },

    /**
     * Whether the element is from the server or not
     * @type {Boolean}
     * @memberOf Element
     * @instance
     */
    fromServer: {
      configurable: true,
      enumerable: false,
      value: fromServer
    },

    /**
     * The config object for the element
     * @type {Object}
     * @memberOf Element
     * @instance
     */
    config: {
      configurable: false,
      enumerable: false,
      value: this.config
    },

    /**
     * The Factory that created the element
     * @type {Factory}
     * @memberOf Element
     * @instance
     */
    factory: {
      configurable: false,
      enumerable: false,
      value: this
    }
  })

  let prototype = typeof this.elementTransformer == 'object' ? this.elementTransformer : {}
  Object.assign(instance, element, prototype)

  if(typeof this.elementTransformer == 'function')
    instance = this.elementTransformer(element)

  return instance
}

/**
 * Makes a request to the server for an array
 * @param  {Object=} params={} The URL parameters for the request
 * @return {Promise<xhr.response>} The request promise
 */
Factory.getList = function(params={}) {
  return Rest._makeRequest(this.config, 'GET', this.route, params, this, null)
}

/**
 * Make a get request for a given id
 * @param  {Integer} id    The id of the element to fetch from the server
 * @param  {Object=} params={} The URL parameters for the request
 * @return {Promise<xhr.response>} The request promise
 */
Factory.get = function(id, params={}) {
  return Rest._makeRequest(this.config, 'GET', this.route + `/${id}`, params, this, null)
}


/**
 * The base element class
 *
 * @class Element
 */
let Element = {}

/**
 * Make a GET request
 * @param  {Object} params The URL parameters for the request
 * @return {Promise<Element>} A Promise that is resolved with an {@link Element}
 *
 * @example
 *
 * element.get({with: 'params'}).then(function(data) {
 *   // data is here, restified for further use
 * })
 *
 * @name Element#get
 * @kind function
 */
Element.get = function(params) {
  return Rest._makeRequest(this.config, 'GET', this.route + `/${this[this.config.fields.id]}`, params, this.factory, null)
}

/**
 * Make a POST request, POSTing the serialized element
 * @param  {Object} params The URL parameters for the request
 * @return {Promise<Element>} A Promise that is resolved with an {@link Element}
 *
 * @example
 *
 * element.post({with: 'params'}).then(function(data) {
 *   // data is here, restified for further use
 * })
 *
 * @name Element#post
 * @kind function
 */
Element.post = function(params) {
  return Rest._makeRequest(this.config, 'POST', this.route + (this.fromServer ? '/' + this[this.config.fields.id] : ''), params, this.factory, this)
}

/**
 * Make a PATCH request, PATCHing the body.<br/>
 * For more information on the format of the request, look at {@link Rest._findBodyAndParams}
 * @param  {Object} body   The body of the request
 * @param  {Object} params The URL parameters for the request
 * @return {Promise<Element>} A Promise that is resolved with an {@link Element}
 *
 * @example
 *
 * element.patch({name: "Matt Smith"}, {with: 'children'})
 * element.patch(['name'])
 * element.patch(['name'], {with: 'children'})
 * element.patch('name', 'season', {with: 'children'})
 * element.patch('name', 'season')
 *
 * @see Rest._findBodyAndParams
 * @name Element#patch
 * @kind function
 */
Element.patch = function(body, params) {
  var {body, params} = Rest._findBodyAndParams(arguments, this)
  return Rest._makeRequest(this.config, 'PATCH', this.route + `/${this[this.config.fields.id]}`, params, this.factory, body)
}

/**
 * Make a PUT request, PUTing the serialized element
 * @param  {Object} params The URL parameters for the request
 * @return {Promise<Element>} A Promise that is resolved with an {@link Element}
 *
 * @example
 *
 * element.put({with: 'params'}).then(function(data) {
 *   // data is here, restified for further use
 * })
 *
 * @name Element#put
 * @kind function
 */
Element.put = function(params) {
  return Rest._makeRequest(this.config, 'PUT', this.route + `/${this[this.config.fields.id]}`, params, this.factory, this)
}

/**
 * Takes the arguments from a function call, figuring out what's what
 *
 * The arguments is an array of parameters in three different formats. The last parameter is always an optional parameters object.<br />
 *
 *
 * The first arguments are strings, denoting the properties to send in the request. The last argument is the parameters object<br />
 * `(String..., [Object])`
 *
 * The first argument is a list of the properties that should be sent in the request. The second (and last) is the parameters object<br />
 * `(Array, [Object])`
 *
 *  The first argument is the body that should be sent in the request. The second…well…you can guess: it's our old friend, the parameters object! :)<br />
 * `(Object, [Object])`
 *
 * @param  {Array} args      The arguments array from the function call
 * @param  {Element} element The Element in question
 * @return {Object} `{body: Object, params: Object}`
 * @example let {body, params} = Rest._findBodyAndParams(args, element)
 *
 * @memberOf Rest
 * @private
 */
Rest._findBodyAndParams = function(args, element) {

  // Set the defaults for the body & params
  let body = {}, params;


  // If the first argument is an array
  if(args[0] instanceof Array) {

    // only patch the passed-in properties
    args[0].forEach(function (property) {
      body[property] = element[property]
    })

    // Then the params are the second argument
    params = args[1] || {}

  // If the first param is an object, the body has been passed in directly
  } else if(typeof args[0] == 'object') {
    body = args[0]
    params = args[1] || {}

  // Else if the first argument is a string, the properties have been passed in as args
  } else if(typeof args[0] == 'string') {


    // Loop through the args
    for (var i = 0; i < args.length; i++) {
      var arg = args[i]

      // If the arg is a string, it's a property of the element
      if(typeof arg == 'string') {
        body[arg] = element[arg]

      // Else if it's an object and the last argument, it's the parameters object…so set it
      } else if(typeof arg == 'object' && i == args.length - 1) {
        params = arg
      }
    }

  }

  // Return it as a "tuple" of sorts
  return {body, params}
}