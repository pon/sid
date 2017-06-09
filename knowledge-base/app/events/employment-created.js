'use strict'

module.exports = class EmploymentCreated {
  constructor(args) {
    this._type = 'EMPLOYMENT_CREATED'
    this._id = args.id
    this._user_id = args.user_id
    this._status = args.status
    this._employer_name = args.employer_name
    this._start_month = args.start_month
    this._start_year = args.start_year
    this._is_self_employed = args.is_self_employed
    this._self_employed_detals = args.self_employed_details
    this._stated_income = args.stated_income
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
      status: this._status,
      employer_name: this._employer_name,
      start_month: this._start_month,
      start_year: this._start_year,
      is_self_employed: this._is_self_employed,
      self_employed_details: this._self_employed_details,
      stated_income: this._stated_income
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get user_id() {return this._user_id}
  get status() {return this._status}
  get employer_name() {return this._employer_name}
  get start_month() {return this._start_month}
  get start_year() {return this._start_year}
  get is_self_employed() {return this._is_self_employed}
  get self_employed_details() {return this._self_employed_details}
  get stated_income() {return this._stated_income}
}
