'use strict'

module.exports = class ApplicationCreated {
  constructor(args) {
    this._type = 'APPLICATION_CREATED'
    this._id = args.id
    this._user_id = args.user_id
    this._status = 'APPLYING'
    this._credit_report_id = args.credit_report_id
    this._employment_id = args.employment_id
    this._lease_id = args.lease_id
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
      status: this._status,
      credit_report_id: this._credit_report_id,
      employment_id: this._employment_id,
      lease_id: this._lease_id
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
}
