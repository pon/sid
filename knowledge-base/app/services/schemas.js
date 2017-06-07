const Joi = require('joi')

exports.register = (server, options, next) => {
  const schemas = {
    address: Joi.object().keys({
      streetOne: Joi.string().max(255).required(),
      streetTwo: Joi.string().max(255),
      city: Joi.string().max(255).required(),
      state: Joi.string().max(2).required(),
      zipCode: Joi.string().regex(/[0-9]/).max(9).required()
    })
  }

  server.expose(schemas)

  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
