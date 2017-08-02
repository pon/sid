'use strict';

module.exports = class LoanOfferUnrejected {
  constructor(id, unrejectedAt) {
    this._type = 'LOAN_OFFER_UNREJECTED'
    this._id = id
    this._unrejected_at = unrejectedAt || new Date()
  }

  toJSON() {
    return {
      unrejected_at: this._unrejected_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get unrejected_at() {return this._unrejected_at}
}
