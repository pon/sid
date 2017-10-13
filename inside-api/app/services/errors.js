const Boom = require('boom')

exports.register = (server, options, next) => {
  const errors = {
    emailAlreadyExists: Boom.badRequest('email already exists'),
    invalidEmailForInvite: Boom.badRequest('invalid email to invite to inside'),
    userNotFound: Boom.notFound('user could not be found'),
    userInvalidPassword: Boom.badRequest('incorrect password'),
    invalidPasswordToken: Boom.badRequest('invalid password reset token'),
    invalidInvitationToken: Boom.badRequest('invalid invitation token'),
    userAlreadyVerified: Boom.badRequest('user already verified')
  }

  server.expose(errors)

  next()
}

exports.register.attributes = {
  name: 'errors',
  version: '1.0.0'
}
