const Joi = require('joi')

exports.register = (server, options, next) => {
  const schemas = {
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    passwordResetToken: Joi.string().required()
  }

  server.expose(schemas)

  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
