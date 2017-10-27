const Boom = require('boom')

exports.register = (server, options, next) => {
  const errors = {
    emailAlreadyExists: Boom.badRequest('email already exists'),
    invalidEmailForInvite: Boom.badRequest('invalid email to invite to inside'),
    userNotFound: Boom.notFound('user could not be found'),
    userInvalidPassword: Boom.badRequest('incorrect password'),
    invalidPasswordToken: Boom.badRequest('invalid password reset token'),
    invalidInvitationToken: Boom.badRequest('invalid invitation token'),
    userAlreadyVerified: Boom.badRequest('user already verified'),
    incomeNotFound: Boom.notFound('income does not exist'),
    applicationNotFound: Boom.notFound('application does not exist'),
    unableToVerifyApplication: Boom.badRequest('unable to complete verification'),
    unableToVerifyIdentity: Boom.badRequest('unable to verify identity'),
    unableToVerifyCitizenship: Boom.badRequest('unable to verify citizenship'),
    unabletoUnverifyIdentity: Boom.badRequest('unable to unverify identity'),
    unabletoUnverifyCitizenship: Boom.badRequest('unable to unverify citizenship'),
    unableToVerifyIncome: Boom.badRequest('unable to verify income'),
    unableToUnverifyIncome: Boom.badRequest('unable to unverify income')
  }

  server.expose(errors)

  next()
}

exports.register.attributes = {
  name: 'errors',
  version: '1.0.0'
}
