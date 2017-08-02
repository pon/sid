'use strict';

module.exports = class LoanOfferRejected {
  constructor(id, rejectedAt) {
    this._type = 'LOAN_OFFER_REJECTED'
    this._id = id
    this._rejected_at = rejectedAt || new Date()
  }

  toJSON() {
    return {
      rejected_at: this._rejected_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get rejected_at() {return this._rejected_at}
}
