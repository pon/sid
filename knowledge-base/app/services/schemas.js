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
    applicationAttachCreditReport: Joi.object().keys({
      credit_report_id: Joi.string().max(255).required()
    }),
    applicationAttachEmployment: Joi.object().keys({
      employment_id: Joi.string().max(255).required()
    }),
    applicationAttachLease: Joi.object().keys({
      lease_id: Joi.string().max(255).required()
    }),
    applicationCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required()
    }),
    asOfQuery: Joi.object().keys({
      as_of: Joi.number().integer().optional()
    }),
    creditReportCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required(),
      raw_credit_report: Joi.object().required(),
      fico_score: Joi.number().integer().required()
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
    }),
    leaseCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required(),
      address_id: Joi.string().max(255).required(),
      security_deposit: Joi.number().integer().min(0).required(),
      monthly_rent: Joi.number().integer().min(0).required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      term_months: Joi.number().integer().min(1).required()
    }),
    leaseUpdate: Joi.object().keys({
      security_deposit: Joi.number().integer().min(0),
      monthly_rent: Joi.number().integer().min(0),
      start_date: Joi.date(),
      end_date: Joi.date(),
      term_months: Joi.number().integer().min(1)
    }),
    profileCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required(),
      first_name: Joi.string().max(255).required(),
      last_name: Joi.string().max(255).required(),
      citizenship: Joi.valid('US_CITIZEN', 'PERM_RESIDENT', 'NON_PERM_RESIDENT').required(),
      date_of_birth: Joi.date().required()
    }),
    profileUpdate: Joi.object().keys({
      first_name: Joi.string().max(255),
      last_name: Joi.string().max(255),
      citizenship: Joi.valid('US_CITIZEN', 'PERM_RESIDENT', 'NON_PERM_RESIDENT'),
      date_of_birth: Joi.date()
    }),
    uploadCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required(),
      file: Joi.object().required()
    })
  }

  server.expose(schemas)

  next()
}

exports.register.attributes = {
  name: 'schemas',
  version: '1.0.0'
}
