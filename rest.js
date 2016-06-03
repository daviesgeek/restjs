'use strict'

/**
 * The configuration object
 */

let RestConfig = {
  _config: {
    headers: [],
    responseType: 'json',
    fields: {
      id: 'id'
    }
  }
}

RestConfig.set = function (config) {
  Object.assign(RestConfig._config, config)
}

RestConfig.getAll = function() {
  return Rest.Config._config
}

var Rest = {}

/**
 * Static methods
 */

Rest.Config = new Proxy(RestConfig, {
  get: function(target, name, receiver) {
    if(['set', 'getAll', '_config'].indexOf(name) == -1)
      return target._config[name]
    else
      return target[name]
  }
})

Rest._responseInterceptors = []

Rest.addResponseInterceptor = function(func) {
  Rest._responseInterceptors.push(func)
}

Rest._responseExtractors = []

Rest.addResponseExtractor = function(func) {
  Rest._responseExtractors.push(func)
}

Rest.factory = function(route) {
  return Object.create(Factory, {
    route: {
      configurable: false,
      enumerable: false,
      value: route.replace(/^\/|\/$/g, "")
    }
  })
}

Rest._makeRequest = function(verb, route, params={}, service, body) {
  let config = Rest.Config.getAll()
  let promise = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()

    if('timeout' in config)
      xhr.timeout         = config.timeout
    xhr.withCredentials = config.withCredentials
    xhr.responseType    = config.responseType

    xhr.onreadystatechange = function() {
      let data = xhr.response

      if (xhr.readyState == XMLHttpRequest.DONE) {
        Rest._responseInterceptors.forEach(function (interceptor) {
          interceptor(data, xhr.responseType, route, xhr.responseURL, reject)
        })
        Rest._responseExtractors.forEach(function(extractor) {
          data = extractor(data)
        })

        if (xhr.status != 200)
          return reject()

        if(data && Object.keys(data).length)
          resolve(Rest._restify(data, service))
        else
          resolve(null)
      }

    }

    xhr.open(verb, Rest._createUrl(route, params), true)

    // @todo: switch based on type
    xhr.setRequestHeader("Content-type", "application/json")

    config.headers.forEach((header) => {
      xhr.setRequestHeader(header[0], header[1])
    })

    if (body && xhr.responseType == 'json')
      return xhr.send(JSON.stringify(body))
    else
      return xhr.send(body)
    return xhr.send()
  })

  return promise
}

Rest._createUrl = function(route, params={}) {
  let baseUrl = Rest.Config.baseUrl.replace(/\/+$/, "")

  let encodedParams = Object.keys(params).reduce(function (array, key) {

    // @todo: add support for arrays and objects
    array.push(`${key}=${encodeURIComponent(params[key])}`)
    return array
  }, []).join('&')

  return `${baseUrl}/${route}` + (encodedParams ? `?${encodedParams}` : '')
}

Rest._restify = function(response, service) {
  if (Array.isArray(response)) {
    return response.reduce(function(array, element) {
      array.push(Rest._restify(element, service))
      return array
    }, [])
  }

  return Element.create(response, service, service.route, true)
}

/**
 * Service methods
 */

let Factory = function() {}

Factory.create = function(element) {
  return Element.create(element, this, this.route, false)
}

Factory.getList = function(params={}) {
  return Rest._makeRequest('GET', this.route, params, this, null)
}

Factory.get = function(id, params) {
  return Rest._makeRequest('GET', this.route + `/${id}`, params, this, null)
}


let Element = {}

Element.create = function (element, factory, route, fromServer) {
  let instance = Object.create(Element, {
    route: {
      configurable: false,
      enumerable: false,
      value: route
    },
    fromServer: {
      configurable: false,
      enumerable: false,
      value: fromServer
    },
  })
  Object.assign(instance, element, factory)
  return instance
}

Element.get = function(params) {
  return Rest._makeRequest('GET', this.route + `/${this[Rest.Config.fields.id]}`, params, this, null)
}

Element.post = function(params) {
  return Rest._makeRequest('POST', this.route + (this.fromServer ? '/' + this[Rest.Config.fields.id] : ''), params, this, this)
}

Element.patch = function(body, params) {
  var {body, params} = _findBodyAndParams(arguments, this)
  return Rest._makeRequest('PATCH', this.route + `/${this[Rest.Config.fields.id]}`, params, this, body)
}

Element.put = function(params) {
  return Rest._makeRequest('PUT', this.route + `/${this[Rest.Config.fields.id]}`, params, this, this)
}

function _findBodyAndParams(args, element) {
  let body = {}, params;

  if(args[0] instanceof Array) {
    args[0].forEach(function (property) {
      body[property] = element[property]
    })
    params = args[1]
  } else if(typeof args[0] == 'object') {
    body = args[0]
    params = args[1]
  } else if(typeof args[0] == 'string') {

    for (var i = 0; i < args.length; i++) {
      var arg = args[i]

      if(typeof arg == 'string') {
        body[arg] = element[arg]
      } else if(typeof arg == 'object' && i == args.length - 1) {
        params = arg
      }
    }

  }
  return {body, params}
}


if (typeof module != 'undefined' && module.exports)
  module.exports = Rest