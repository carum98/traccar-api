module.exports = {
    // Example: /users/:id => /users/([^/]+)
    routeRegex(url) {
        return new RegExp(`^${url.replace(/:\w+/g, '([^/]+)')}$`)
    },
    // Example: /users/2?q=Carlos => /users/2
    getBaseUrl(url) {
        return url.split('?')[0]
    },
     // Example: /users/:id => { id: 1 }
    getParams(route, url) {
        if (!route.includes(':')) {
            return {}
        }

        return route
            .split('/')
            .reduce((params, param, i) => {
                if (param.startsWith(':')) {
                    params[param.slice(1)] = this.getBaseUrl(url).split('/')[i]
                }

                return params
            }, {})
    },
    // Example: /users/1?name=John => { name: 'John' }
    getQueryParams(url) {
        if (!url.includes('?')) {
            return {}
        }

        return url.split('?')[1]
            .split('&')
            .reduce((params, param) => {
                const [key, value] = param.split('=')
                params[key] = value

                return params
            }, {})
    }
}
