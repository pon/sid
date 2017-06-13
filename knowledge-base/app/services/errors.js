const Boom = require('boom')

exports.register = (server, options, next) => {
  const errors = {
    invalidState: Boom.badRequest('state does not exist'),
    addressAlreadyVerified: Boom.badRequest('address already verified'),
    addressNotFound: Boom.notFound('address does not exist'),
    addressNotVerified: Boom.badRequest('address not verified'),
    applicationNotFound: Boom.notFound('application does not exist'),
    applicationInvalidStatusToApply: Boom.badRequest('application must be applying to apply'),
    applicationNotReadyToApply: Boom.badRequest('application not ready to apply'),
    creditReportNotFound: Boom.notFound('credit report does not exist'),
    employmentAlreadyVerified: Boom.badRequest('employment already verified'),
    employmentNotFound: Boom.notFound('employment does not exist'),
    employmentNotVerified: Boom.badRequest('employment not verified'),
    leaseAlreadyVerified: Boom.badRequest('lease already verified'),
    leaseNotFound: Boom.notFound('lease does not exist'),
    leaseNotVerified: Boom.badRequest('lease not verified'),
    multipleActiveApplications: Boom.badRequest('multiple active applications not allowed'),
    uploadNotFound: Boom.notFound('upload does not exist')
  }

  server.expose(errors)

  next()
}

exports.register.attributes = {
  name: 'errors',
  version: '1.0.0'
}
