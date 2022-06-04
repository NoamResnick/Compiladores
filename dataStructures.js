class Variable {
    constructor(method, url) {
        this.method = method
        this.url = url
        this.headers = {}
        this.params = {}
        this.body = ""
    }

    addHeader(key, value) {
        this.headers[key] = value
    }

    addQueryParam(key, value) {
        this.params[key] = value
    }

    addBody(body) {
        this.body = body
    }

    removeHeader(key) {
        if (!(key in this.headers)) {
            throw `Missing header key error: ${key}`
        }
        
        delete this.headers[key]
    }

    removeQueryParam(key) {
        if (!(key in this.params)) {
            throw `Missing query param key error: ${key}`
        }

        delete this.params[key]
    }

    removeBody() {
        this.body = ""
    }

    build() {
        var url = new URL(this.url)

        var path = url.pathname+url.search
        var paramKeys = Object.keys(this.params)
        if (paramKeys.length > 0) {
            if (url.search.length > 0) {
                path += "&"
            } else {
                path += "?"
            }
            
            paramKeys.forEach(key => {
                path += `${key}=${this.params[key]}&`
            })
            path = path.slice(0, -1)
        }
        
        var headers = ""
        Object.keys(this.headers).forEach(key => {
            headers += `${key}: ${this.headers[key]}\n`
        })
        
        return `${this.method} ${path} HTTP/2\nHOST: ${url.host}\n${headers}\n${this.body}`
    }
}

class Context {
    constructor() {
        this.variables = {}
    }

    addVariable(name, v) {
        if (name in this.variables) {
            throw `Redeclaration of ${name}`
        }

        this.variables[name] = v
    }

    getVariable(name) {
        if (!(name in this.variables)) {
            throw `Missing declaration of ${name}`
        }

        return this.variables[name]
    }

    updateVariable(name, v) {
        if (!(name in this.variables)) {
            throw `Missing declaration of ${name}`
        }

        this.variables[name] = v
    }
}

module.exports = {
    Context,
    Variable,
}