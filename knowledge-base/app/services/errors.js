const Boom = require('boom')

exports.register = (server, options, next) => {
  const errors = {
    invalidState: Boom.badRequest('state does not exist'),
    addressAlreadyVerified: Boom.badRequest('address already verified'),
    addressNotFound: Boom.notFound('address does not exist'),
    addressNotVerified: Boom.badRequest('address not verified'),
    applicationNotFound: Boom.notFound('application does not exist'),
    applicationInvalidStatusToApply: Boom.badRequest('application must be applying to apply'),
    applicationInvalidStatusToApprove: Boom.badRequest('application must be underwriting to approve'),
    applicationInvalidStatusToCompleteVerification:
      Boom.badRequest('application must be verifying to complete verification'),
    applicationInvalidStatusToDecline: Boom.badRequest('application must be verifying or underwriting to decline'),
    applicationInvalidStatusToReverify: Boom.badRequest('application must be in underwriting to re-verify'),
    applicationInvalidStatusToTimeOut: Boom.badRequest('application must be verifying to time out'),
    applicationInvalidStatusToUntimeOut: Boom.badRequest('application must be timed out to un-time out'),
    applicationInvalidStatusToUnapprove: Boom.badRequest('application must be approved to un-approve'),
    applicationInvalidStatusToUndecline: Boom.badRequest('application must be declined to un-decline'),
    applicationNotReadyToApply: Boom.badRequest('application not ready to apply'),
    creditReportNotFound: Boom.notFound('credit report does not exist'),
    incomeAlreadyVerified: Boom.badRequest('income already verified'),
    incomeNotFound: Boom.notFound('income does not exist'),
    incomeNotVerified: Boom.badRequest('income not verified'),
    leaseAlreadyVerified: Boom.badRequest('lease already verified'),
    leaseNotFound: Boom.notFound('lease does not exist'),
    leaseNotVerified: Boom.badRequest('lease not verified'),
    loanOfferNotFound: Boom.notFound('loan offer does not exist'),
    loanOfferNotSignable: Boom.badRequest('must consent to esign before signing'),
    loanOfferAlreadySigned: Boom.badRequest('cannot perform action on a signed loan offer'),
    multipleActiveApplications: Boom.badRequest('multiple active applications not allowed'),
    profileAlreadyExists: Boom.badRequest('profile already exists for this user'),
    profileAlreadyVerified: Boom.badRequest('profile already verified'),
    profileNotFound: Boom.notFound('profile does not exist'),
    profileNotVerified: Boom.badRequest('profile not verified'),
    uploadNotFound: Boom.notFound('upload does not exist')
  }

  server.expose(errors)

  next()
}

exports.register.attributes = {
  name: 'errors',
  version: '1.0.0'
}
