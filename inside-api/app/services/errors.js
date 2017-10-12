const Boom = require('boom')

exports.register = (server, options, next) => {
  const errors = {}

  server.expose(errors)

  next()
}

exports.register.attributes = {
  name: 'errors',
  version: '1.0.0'
}
