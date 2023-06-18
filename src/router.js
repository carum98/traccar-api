const http = require('http')
const helpers = require('./helpers')

module.exports = function router() {
  const routes = []

  function addRoute(method, url, callback) {
    routes.push({ method, url, callback })
  }

  function findRoute(method, url) {
    const route = routes.find(route => {
      return route.method === method && helpers.routeRegex(route.url).test(url)
    })

    if (route) {
      const params = helpers.getParams(route.url, url)
      const query = helpers.getQueryParams(url)

      return {
        callback: route.callback,
        params,
        query,
      }
    }

    return null
  }

  function createResponse(res) {
    res.send = (message) => res.end(message);

    res.json = (message) => {
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify(message))
    }

    res.html = (message) => {
      res.setHeader("Content-Type", "text/html")
      res.end(message)
    }

    return res
  }

  function get(req, callback) {
    addRoute('get', req, callback)
  }

  function post(req, callback) {
    addRoute('post', req, callback)
  }

  function put(req, callback) {
    addRoute('put', req, callback)
  }

  function del(req, callback) {
    addRoute('delete', req, callback)
  }

  function listen(port, callback) {
    const server = http.createServer((req, res) => {
      const method = req.method.toLowerCase()
      const url = req.url.toLowerCase()

      const route = findRoute(method, url)

      if (route) {
        req.params = route ? route.params : {}
        req.query = route ? route.query : {}

        return route.callback(
          req, 
          createResponse(res)
        )
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Route not found.')
    })

    server.listen(port, callback)
  }

  return {
    get,
    post,
    put,
    del,
    listen
  }
}