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

  let prototype = typeof this.elementTransformer == "object" ? this.elementTransformer : {}
  Object.assign(instance, element, prototype)

  if(typeof this.elementTransformer == "function")
    instance = this.elementTransformer(element)

  return instance
}

/**
 * Makes a request to the server for an array
 * @param  {Object=} params={} The URL parameters for the request
 * @return {Promise<xhr.response>} The request promise
 */
Factory.getList = function(params={}) {
  return Rest._makeRequest(this.config, "GET", this.route, params, this, null)
}

/**
 * Make a get request for a given id
 * @param  {Integer} id    The id of the element to fetch from the server
 * @param  {Object=} params={} The URL parameters for the request
 * @return {Promise<xhr.response>} The request promise
 */
Factory.get = function(id, params={}) {
  return Rest._makeRequest(this.config, "GET", this.route + `/${id}`, params, this, null)
}

/**
 * Make a post request
 * @param  {Object=} params={} The URL parameters for the request
 * @param  {String=} route=    A custom route for the request
 * @return {Promise<xhr.response>} The request promise
 */
Factory.post = function(body={}, params={}) {
  return Rest._makeRequest(this.config, "POST", this.route, params, this, body)
}

/**
 * Make a post request
 * @param  {Object=} params={} The URL parameters for the request
 * @param  {String=} route=    A custom route for the request
 * @return {Promise<xhr.response>} The request promise
 */
Factory.customPOST = function(route="", body={}, params={}) {
  return Rest._makeRequest(this.config, "POST", this.route + `/${route}`, params, this, body)
}
