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
    }),
    applyStepTwo: Joi.object().keys({
      application_id: Joi.string().max(255).required(),
      date_of_birth: Joi.date().required(),
      citizenship: Joi.valid('US_CITIZEN', 'PERM_RESIDENT', 'NON_PERM_RESIDENT').required(),
      street_one: Joi.string().max(255).required(),
      street_two: Joi.string().max(255),
      city: Joi.string().max(255).required(),
      state: Joi.string().max(2).required(),
      zip_code: Joi.string().regex(/[0-9]/).max(9).required(),
      security_deposit: Joi.number().integer().min(0).required(),
      monthly_rent: Joi.number().integer().min(0).required(),
      start_date: Joi.date().required(),
      term_months: Joi.number().integer().min(1).required(),
      status: Joi.valid('CURRENT', 'FUTURE').required(),
      employer_name: Joi.string().max(255).required(),
      start_month: Joi.number().integer().min(1).max(12).required(),
      start_year: Joi.number().integer().min(1900).required(),
      is_self_employed: Joi.boolean().default(false),
      self_employed_details: Joi.object(),
      stated_income: Joi.number().integer().required()
    }),
    applyStepThree: Joi.object().keys({
      // application_id: Joi.string().max(255).required(),
      // files: Joi.object().required()
    })
  }

  server.expose(schemas)

  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
