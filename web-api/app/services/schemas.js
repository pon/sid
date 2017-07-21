const Joi = require('joi')

exports.register = (server, options, next) => {

  const incomeSchema = Joi.object().keys({
    income_type: Joi.valid(
      'SALARY', 'SELF_EMPLOYED', 'RENTAL', 'SOCIAL_SECURITY_PENSION',
      'DISABILITY', 'CHILD_SUPPORT_ALIMONY', 'K1'
    ).required(),
    employer_name: Joi.string().allow('').max(255).optional(),
    stated_income: Joi.number().integer().required()
  })

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
      street_one: Joi.string().max(255).required(),
      street_two: Joi.string().max(255),
      city: Joi.string().max(255).required(),
      state: Joi.string().max(2).required(),
      zip_code: Joi.string().regex(/[0-9]/).max(9).required(),
      security_deposit: Joi.number().integer().min(0).required(),
      monthly_rent: Joi.number().integer().min(0).required(),
      start_date: Joi.date().required(),
      term_months: Joi.number().integer().min(1).required(),
      incomes: [Joi.array().items(incomeSchema), incomeSchema],
      years_of_employment: Joi.number().integer().min(0).required()
    }),
    applyStepThree: Joi.object().keys({
      application_id: Joi.string().max(255).required(),
      files: Joi.any(),
      categories: [Joi.array().items(Joi.string()), Joi.string()]
    }),
    applyStepFour: Joi.object().keys({
      application_id: Joi.string().max(255).required(),
      social_security_number: Joi.string().length(9).required()
    })
  }

  server.expose(schemas)

  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
