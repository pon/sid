const Joi = require('joi')

exports.register = (server, options, next) => {
  const schemas = {
    addressCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required(),
      street_one: Joi.string().max(255).required(),
      street_two: Joi.string().max(255),
      city: Joi.string().max(255).required(),
      state: Joi.string().max(2).required(),
      zip_code: Joi.string().regex(/[0-9]/).max(9).required()
    }),
    addressUpdate: Joi.object().keys({
      street_one: Joi.string().max(255),
      street_two: Joi.string().max(255),
      city: Joi.string().max(255),
      state: Joi.string().max(2),
      zip_code: Joi.string().regex(/[0-9]/).max(9)
    }),
    asOfQuery: Joi.object().keys({
      as_of: Joi.number().integer().optional()
    }),
    employmentCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required(),
      status: Joi.valid('CURRENT', 'FUTURE').required(),
      employer_name: Joi.string().max(255).required(),
      start_month: Joi.number().integer().min(1).max(12).required(),
      start_year: Joi.number().integer().min(1900).required(),
      is_self_employed: Joi.boolean().required(),
      self_employed_details: Joi.object(),
      stated_income: Joi.number().integer().required()
    }),
    employmentUpdate: Joi.object().keys({
      status: Joi.valid('CURRENT', 'FUTURE'),
      employer_name: Joi.string().max(255),
      start_month: Joi.number().integer().min(1).max(12),
      start_year: Joi.number().integer().min(1900),
      is_self_employed: Joi.boolean(),
      self_employed_details: Joi.object(),
      stated_income: Joi.number().integer()
    }),
    employmentVerify: Joi.object().keys({
      verified_income: Joi.number().integer().required()
    })
  }

  server.expose(schemas)

  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
