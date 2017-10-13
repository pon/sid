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

  const sendInvitation = (to, data) => {
    const dataTemplate = Joi.object().keys({
      invitationUrl: Joi.string().required()
    })

    const dataResult = Joi.validate(data, dataTemplate)
    if (dataResult.error) {
      return P.reject(dataResult.error)
    }

    return sendEmail(to, 'inside-invitation', data)
  }

  server.expose({
    sendInvitation: sendInvitation
  })

  next()
}

exports.register.attributes = {
  name: 'emailer',
  version: '1.0.0'
}
