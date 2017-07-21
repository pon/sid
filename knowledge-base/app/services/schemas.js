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
    applicationAttachIncomes: Joi.object().keys({
      income_ids: [Joi.array().items(Joi.string().max(255).required()), Joi.string().max(255).required()]
    }),
    applicationAttachUploads: Joi.object().keys({
      upload_ids: [Joi.array().items(Joi.string().max(255).required()), Joi.string().max(255).required()]
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
    incomeCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required(),
      income_type: Joi.valid(
        'SALARY', 'SELF_EMPLOYED', 'RENTAL', 'SOCIAL_SECURITY_PENSION',
        'DISABILITY', 'CHILD_SUPPORT_ALIMONY', 'K1'
      ).required(),
      employer_name: Joi.string().max(255),
      stated_income: Joi.number().integer().required()
    }),
    incomeUpdate: Joi.object().keys({
      income_type: Joi.valid(
        'SALARY', 'SELF_EMPLOYED', 'RENTAL', 'SOCIAL_SECURITY_PENSION',
        'DISABILITY', 'CHILD_SUPPORT_ALIMONY', 'K1'
      ),
      employer_name: Joi.string().max(255),
      stated_income: Joi.number().integer()
    }),
    incomeVerify: Joi.object().keys({
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
      citizenship: Joi.valid('US_CITIZEN', 'PERM_RESIDENT', 'NON_PERM_RESIDENT'),
      date_of_birth: Joi.date(),
      years_of_employment: Joi.number().integer().min(0),
      social_security_number: Joi.string().length(9),
    }),
    profileUpdate: Joi.object().keys({
      first_name: Joi.string().max(255),
      last_name: Joi.string().max(255),
      citizenship: Joi.valid('US_CITIZEN', 'PERM_RESIDENT', 'NON_PERM_RESIDENT'),
      date_of_birth: Joi.date(),
      years_of_employment: Joi.number().integer().min(0),
      social_security_number: Joi.string().length(9)
    }),
    uploadCreate: Joi.object().keys({
      user_id: Joi.string().max(255).required(),
      category: Joi.string().max(255).required(),
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
