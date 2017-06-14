const Joi = require('joi')

exports.register = (server, options, next) => {
  const schemas = {
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    passwordResetToken: Joi.string().required(),
    emailVerificationToken: Joi.string().required(),
    applyStepOne: Joi.object().keys({
      first_name: Joi.string().max(255).required(),
      last_name: Joi.string().max(255).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      confirm_password: Joi.string().min(8).required()
    })
  }

  server.expose(schemas)

  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
