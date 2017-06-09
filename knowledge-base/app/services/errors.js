const Boom = require('boom')

exports.register = (server, options, next) => {
  const errors = {
    invalidState: Boom.badRequest('state does not exist'),
    addressAlreadyVerified: Boom.badRequest('address already verified'),
    addressNotFound: Boom.notFound('address does not exist'),
    addressNotVerified: Boom.badRequest('address not verified'),
    employmentAlreadyVerified: Boom.badRequest('employment already verified'),
    employmentNotFound: Boom.notFound('employment does not exist'),
    employmentNotVerified: Boom.badRequest('employment not verified')
  }

  server.expose(errors)

  next()
}

exports.register.attributes = {
  name: 'errors',
  version: '1.0.0'
}