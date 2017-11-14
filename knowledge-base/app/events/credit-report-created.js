'use strict'

const type = 'CREDIT_REPORT_CREATED'

module.exports.event = class CreditReportCreated {
  constructor(args) {
    this._type = type
    this._id = args.id
    this._user_id = args.user_id
    this._raw_credit_report = args.raw_credit_report
    this._fico_score = args.fico_score
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
      raw_credit_report: this._raw_credit_report,
      fico_score: this._fico_score
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get user_id() {return this._user_id}
  get raw_credit_report() {return this._raw_credit_report}
  get fico_score() {return this._fico_score}
}

module.exports.type = type
