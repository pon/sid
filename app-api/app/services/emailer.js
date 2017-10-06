const Joi     = require('joi')
const P       = require('bluebird')
const PubSub  = require('@google-cloud/pubsub')({promise: P})

exports.register = (server, options, next) => {

  const topic = PubSub.topic(options.queueName)
  const publisher = topic.publisher()

  const sendEmail = (to, template, data) => {
    return publisher.publish(Buffer.from(JSON.stringify({
      to: to,
      template: template,
      data: data
    })))
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

  topic.exists((err, exists) => {
    if (err) {
      server.log(['error', 'emailer'], err)
      return next(err)
    }

    server.log(['info', 'emailer'], 'topic exists and ready')

    if (!exists) {
      return topic.create(next)
    }

    next()
  })
}

exports.register.attributes = {
  name: 'emailer',
  version: '1.0.0'
}
