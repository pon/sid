'use strict';

const type = 'LOAN_OFFER_UNREJECTED'

module.exports.event = class LoanOfferUnrejected {
  constructor(id, unrejectedAt) {
    this._type = type
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

module.exports.type = type
