'use strict'

const type = 'LOAN_OFFER_CREATED'

module.exports.event = class LoanOfferCreated {
  constructor(args) {
    this._type = type
    this._id = args.id
    this._application_id = args.application_id
    this._status = 'AWAITING_SIGNATURE'
    this._interest_rate = args.interest_rate
    this._interest_rate_type = 'interest_only_fixed'
    this._term_in_months = args.term_in_months
    this._principal_amount = args.principal_amount
    this._expires_at = args.expires_at
  }

  toJSON() {
    return {
      id: this._id,
      application_id: this._application_id,
      status: this._status,
      interest_rate: this._interest_rate,
      interest_rate_type: this._interest_rate_type,
      term_in_months: this._term_in_months,
      principal_amount: this._principal_amount,
      expires_at: this._expires_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get application_id() {return this._application_id}
  get status() {return this._status}
  get interest_rate() {return this._interest_rate}
  get interest_rate_type() {return this._interest_rate_type}
  get term_in_months() {return this._term_in_months}
  get principal_amount() {return this._principal_amount}
  get expires_at() {return this._expires_at}
}

module.exports.type = type
