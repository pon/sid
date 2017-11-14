'use strict'

const type = 'APPLICATION_CREDIT_REPORT_ATTACHED'

module.exports = class ApplicationCreditReportAttached {
  constructor(id, creditReportId) {
    this._type = type
    this._id = id
    this._credit_report_id = creditReportId
  }

  toJSON() {
    return {
      id: this._id,
      credit_report_id: this._credit_report_id
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get credit_report_id() {return this._credit_report_id}
}

module.exports.type = type
