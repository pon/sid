const Joi = require('joi')

exports.register = (server, options, next) => {
  const schemas = {
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    invitationCode: Joi.string().required(),
    paginatedQuery: Joi.object().keys({
      starting_after: Joi.string().guid().optional(),
      ending_before: Joi.string().guid().optional(),
      limit: Joi.number().integer().min(1).max(100).default(10)
    }),
    guid: Joi.string().guid().required(),
    incomeVerify: Joi.object().keys({
      verified_income: Joi.number().integer().min(0).required()
    })
  }
  server.expose(schemas)
  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
