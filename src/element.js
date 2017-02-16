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
Element.get = function() {
  let params = typeof arguments[0] === "object" ? arguments[0] : arguments[1] || {}
  let route = typeof arguments[0] === "string" ? arguments[0] : null

  let requestRoute = this.route + `/${this[this.config.fields.id]}`
  if(route) {
    requestRoute += "/" + route
  }

  return Rest._makeRequest(this.config, "GET", requestRoute, params, this.factory, null)
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
  return Rest._makeRequest(this.config, "POST", this.route + (this.fromServer ? "/" + this[this.config.fields.id] : ""), params, this.factory, this)
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
Element.patch = function() {
  let {body, params} = Rest._findBodyAndParams(arguments, this)
  return Rest._makeRequest(this.config, "PATCH", this.route + `/${this[this.config.fields.id]}`, params, this.factory, body)
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
  return Rest._makeRequest(this.config, "PUT", this.route + `/${this[this.config.fields.id]}`, params, this.factory, this)
}
