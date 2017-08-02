'use strict';

module.exports = class LoanOfferUnexpired {
  constructor(id, unexpiredAt) {
    this._type = 'LOAN_OFFER_UNEXPIRED'
    this._id = id
    this._unexpired_at = unexpiredAt || new Date()
  }

  toJSON() {
    return {
      unexpired_at: this._unexpired_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get unexpired_at() {return this._unexpired_at}
}
