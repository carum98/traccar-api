const http = require('http')
const helpers = require('./helpers')

module.exports = function router() {
  const routes = []
  const middlewares = []

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

  function use(callback) {
    middlewares.push(callback)
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

        res.send = (message) => res.end(message);

        res.json = (message) => {
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify(message))
        }
    
        res.html = (message) => {
          res.setHeader("Content-Type", "text/html")
          res.end(message)
        }
    
        res.error = (code, message) => {
          res.statusCode = code
          res.statusMessage = message
          res.end(`${code} ${message}`)
        }
    
        res.status = (code) => {
          res.statusCode = code
    
          return res
        }

        if (middlewares.length === 0) {
          return route.callback(req, res)
        }

        for (let i = 0; i < middlewares.length; i++) {
          const index = i + 1
          const middleware = middlewares[i]

          const next = () => {
            if (index < middlewares.length) {
              middlewares[index](req, res, next)
            } else {
              route.callback(req, res)
            }
          }

          middleware(req, res, next)
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Route not found.')
      }
    })

    server.listen(port, callback)
  }

  return {
    get,
    post,
    put,
    del,
    listen,
    use,
  }
}