const Joi = require('joi')
const P = require('bluebird')

exports.register = (server, options, next) => {
  const sendEmail = (to, template, data) => {
    return server.plugins.aws.enqueueMessage(options.queueName, {
      to: to,
      template: template,
      data: data
    })
  }

  const sendPasswordReset = (to, data) => {
    const dataTemplate = Joi.object().keys({
      resetToken: Joi.string().required()
    })

    const dataResult = Joi.validate(data, dataTemplate)
    if (dataResult.error) {
      return P.reject(dataResult.error)
    }

    return sendEmail(to, 'password-reset', data)
  }

  const sendEmailVerification = (to, data) => {
    const dataTemplate = Joi.object().keys({
      verificationToken: Joi.string().required()
    })

    const dataResult = Joi.validate(data, dataTemplate)
    if (dataResult.error) {
      return P.reject(dataResult.error)
    }

    return sendEmail(to, 'email-verification', data)
  }

  server.expose({
    sendPasswordReset: sendPasswordReset,
    sendEmailVerification: sendEmailVerification
  })

  next()
}

exports.register.attributes = {
  name: 'emailer',
  version: '1.0.0'
}
