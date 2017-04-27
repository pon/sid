const Boom = require('boom')

exports.register = (server, options, next) => {
  const errors = {
    emailAlreadyExists: Boom.badRequest('email already exists'),
    userNotFound: Boom.notFound('user could not be found'),
    userInvalidPassword: Boom.badRequest('incorrect password')
  }

  server.expose(errors)

  next()
}

exports.register.attributes = {
  name: 'errors',
  version: '1.0.0'
}
