'use strict'

const type = 'LEASE_CREATED'

module.exports.event = class LeaseCreated {
  constructor(args) {
    this._type = type
    this._id = args.id
    this._user_id = args.user_id
    this._address_id = args.address_id
    this._security_deposit = args.security_deposit
    this._monthly_rent = args.monthly_rent
    this._start_date = args.start_date
    this._end_date = args.end_date
    this._term_months = args.term_months
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
      address_id: this._address_id,
      security_deposit: this._security_deposit,
      monthly_rent: this._monthly_rent,
      start_date: this._start_date,
      end_date: this._end_date,
      term_months: this._term_months
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get user_id() {return this._user_id}
  get address_id() {return this._address_id}
  get security_deposit() {return this._security_deposit}
  get monthly_rent() {return this._monthly_rent}
  get start_date() {return this._start_date}
  get end_date() {return this.end_date}
  get term_months() {return this.term_months}
}

module.exports.type = type
