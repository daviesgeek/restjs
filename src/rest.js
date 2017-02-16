"use strict"

/**
 * The globally available RestJS library
 * @class Rest
 */
var Rest = {}

/**
 * The default configuration options
 *
 * @property {String} baseUrl The base URL for requests. I.e, if the `baseUrl` is set to `http://google.com`, all requests will be prefixed with `http://google.com`
 * @property {Object} defaultParams The default parameters for requests. Can be overriden by specific requests
 * @property {Object} fields The special fields used to determine url (and later, header) information
 * @property {Object} fields.id The property that RestJS should use as the id. This will be used for subsequent requests, such as DELETE, PUT or PATCH requests: `<baseUrl>/<resource>/<id field>`
 * @property {Array.<Array.<String>>} headers The default headers for requests, defaults to an empty array, expected elements: `[String, String]`
 * @property {String} responseType The response type for the request. See [the docs for `XMLHttpRequest.responseType`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)
 * @property {number} [timeout] The XHR timeout. See [the docs for `XMLHttpRequest.timeout`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout)
 * @property {boolean} [withCredentials] Whether to send CORS credentials with the request or not. See [the docs for `XMLHttpRequest.withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
 *
 *  @name Rest#Config
 *  @class
 */
Rest.Config = {
  // timeout: undefined
  // withCredentials: undefined

  baseUrl: "",
  defaultParams: {},
  fields: {
    id: "id"
  },
  headers: [],
  responseType: "json",
}

/**
 * Sets a given config to the configuration object
 * @param {Object} config The specified config
 * @memberOf  Rest#Config
 * @example
 * Rest.Config.set({baseUrl: 'https://restjs.js.org'})
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
 * Rest.addResponseInterceptor(function(data, responseType, route, responseURL, reject, xhr)) {
 *     data:         The response data
 *     responseType: The response type. See {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType |the docs}
 *     route:        The route used for {@link _makeRequest}
 *     responseURL:  See {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL |the docs for `XMLHttpRequest.responseURL`}
 *     reject:       The `reject` method from the Promise for the request
 *     xhr:          The XHR object used to make the request
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
 * Holds response extractors
 * @see Rest.addRequestInterceptor
 *
 * @type {Array}
 * @private
 */
Rest._requestInterceptors = []


/**
 * Adds a response interceptor, which is run before a request is sent
 *
 * @example
 *
 * Rest.addRequestInterceptor(function(requestConfig, xhr, reject)) {
 *   requestConfig.route  // the URL for the request, minus the
 *   requestConfig.params // the parameters for the request
 *   requestConfig.body   // the request body
 * })
 *
 * Expected format:
 *
 * function(requestConfig, xhr, reject)
 *
 * @param {Function} func The interceptor (see the example)
 */
Rest.addRequestInterceptor = function (func) {
  Rest._requestInterceptors.push(func)
}

/**
 * The factory creator method for RestJS
 * @param  {String} route              The route
 * @param  {(Object|Function)} factoryTransformer A transformer that is either added to the factory (if it's an object) or run on the factory (if it's a function)
 * @param  {(Object|Function)} elementTransformer A transformer that is either added to the element (if it's an object) or run on the element (if it's a function)
 * @param  {Object} customConfig       A custom configuration object @see Rest.Config
 * @return {Factory}                   A newly created Factory
 */
Rest.factory = function(route, factoryTransformer, elementTransformer, collectionTransformer, customConfig=null) {

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
    },

    /**
     * The transformer to be run on a collection (array)
     * @type {Function}
     * @memberOf Factory
     * @instance
     */
    collectionTransformer: {
      configurable: false,
      enumerable: false,
      value: collectionTransformer
    }
  })

  // Make sure the prototype is set either to the transformer (if it's an object), or else, an empty object
  let transformer = typeof factoryTransformer == "object" ? factoryTransformer : {}

  // Add the transformer methods, or an empty object (see above line)
  Object.assign(factory, transformer)

  // Only run the transformer if it's a function
  if(typeof factoryTransformer == "function")
    factory = factoryTransformer(factory)

  // All done creating the factory, return it!
  return factory
}

/**
 * Makes a request with the necessary config
 *
 * @private
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
    if("timeout" in config)
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
          interceptor(data, xhr.responseType, route, xhr.responseURL, reject, xhr)
        })
        Rest._responseExtractors.forEach(function(extractor) {
          data = extractor(data)
        })

        // If the status isn't in between 200 or 299
        if (xhr.status < 200 || xhr.status > 299)
          return reject({data, xhr})

        // Make sure there's data before restifying it, otherwise just resolve with null
        if(data && Object.keys(data).length)
          resolve(Rest._restify(data, factory, config))
        else
          resolve(null)
      }

    }

    params = Object.assign({}, Rest.Config.defaultParams, params)

    let requestConfig = {route, params, body}

    Rest._requestInterceptors.forEach(function (interceptor) {
      requestConfig = interceptor(requestConfig, xhr)
    })

    // Open the XHR request. See {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open |the docs}
    xhr.open(verb, Rest._createUrl(requestConfig.route, requestConfig.params), true)

    // @todo: switch based on type
    xhr.setRequestHeader("Content-type", "application/json")

    // Loop through all the headers and set the header
    config.headers.forEach((header) => {
      xhr.setRequestHeader(header[0], header[1])
    })

    // If the body exists and the response type is JSON, stringify it first
    // Otherwise, just send it as is,
    // Else, just send it without a body
    if (requestConfig.body && xhr.responseType == "json")
      return xhr.send(JSON.stringify(requestConfig.body))
    else if(requestConfig.body)
      return xhr.send(requestConfig.body)
    else
      return xhr.send()
  })

  return promise
}

/**
 * Create a url based off a route and a parameter object
 *
 * @private
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
  }, []).join("&")

  // Return the entire URL, optionally adding the parameter string if it exists
  return `${baseUrl}/${route}` + (encodedParams ? `?${encodedParams}` : "")
}

/**
 * "Restifies" an element: add the default Rest methods to the prototype, and run it through the transformer
 *
 * @private
 * @param  {Object} response The response object from [`xhr.response`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response)
 * @param  {Factory} factory The factory object that created the request
 * @param  {Object} config   The configuration for the element
 * @return {Element} The newly created Element, as returned by {@link Factory.create}
 */
Rest._restify = function(response, factory, config) {

  // If the passed-in response an array
  if (Array.isArray(response)) {

    if(typeof factory.collectionTransformer == "function")
      factory.collectionTransformer(response)

    // Loop over the array, restify each of the elements and return the new array
    let restifiedResponse = response.reduce(function(array, element) {
      array.push(Rest._restify(element, factory, config))
      return array
    }, [])

    if (typeof factory.collectionTransformer == "object")
      Object.assign(restifiedResponse, factory.collectionTransformer)

    return restifiedResponse
  }

  // If it's not an array, call the create method, passing in the response, and set `fromServer` to true (the last parameter)
  return factory.create.call(factory, response, true)
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
 * @private
 * @param  {Array} args      The arguments array from the function call
 * @param  {Element} element The Element in question
 * @return {Object} `{body: Object, params: Object}`
 * @example let {body, params} = Rest._findBodyAndParams(args, element)
 *
 * @memberOf Rest
 */
Rest._findBodyAndParams = function(args, element) {

  // Set the defaults for the body & params
  let body = {}, params

  // If the first argument is an array
  if(args[0] instanceof Array) {

    // only patch the passed-in properties
    args[0].forEach(function (property) {
      body[property] = element[property]
    })

    // Then the params are the second argument
    params = args[1] || {}

  // If the first param is an object, the body has been passed in directly
  } else if(typeof args[0] == "object") {
    body = args[0]
    params = args[1] || {}

  // Else if the first argument is a string, the properties have been passed in as args
  } else if(typeof args[0] == "string") {


    // Loop through the args
    for (var i = 0; i < args.length; i++) {
      var arg = args[i]

      // If the arg is a string, it's a property of the element
      if(typeof arg == "string") {
        body[arg] = element[arg]

      // Else if it's an object and the last argument, it's the parameters object…so set it
      } else if(typeof arg == "object" && i == args.length - 1) {
        params = arg
      }
    }

  }

  // Return it as a "tuple" of sorts
  return {body, params}
}