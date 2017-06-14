const Joi = require('joi')

exports.register = (server, options, next) => {
  const schemas = {
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    passwordResetToken: Joi.string().required(),
    emailVerificationToken: Joi.string().required()
  }

  server.expose(schemas)

  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
