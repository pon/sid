'use strict'

const type = 'APPLICATION_CREATED'

module.exports = class ApplicationCreated {
  constructor(args) {
    this._type = type
    this._id = args.id
    this._user_id = args.user_id
    this._status = 'APPLYING'
    this._credit_report_id = args.credit_report_id
    this._employment_id = args.employment_id
    this._lease_id = args.lease_id
    this._current_step = 'APPLICATION_DETAILS'
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
      status: this._status,
      credit_report_id: this._credit_report_id,
      employment_id: this._employment_id,
      lease_id: this._lease_id,
      current_step: this._current_step
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get user_id() {return this._user_id}
  get status() {return this._status}
  get credit_report_id() {return this._credit_report_id}
  get employment_id() {return this._employment_id}
  get lease_id() {return this._lease_id}
  get current_step() {return this._current_step}
}

module.exports.type = type
