'use strict';

const type = 'LOAN_OFFER_UNSIGNED'

module.exports.event = class LoanOfferUnsigned {
  constructor(id, unsignedAt) {
    this._type = type
    this._id = id
    this._unsigned_at = unsignedAt || new Date()
  }

  toJSON() {
    return {
      unsigned_at: this._unsigned_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get unsigned_at() {return this._unsigned_at}
}

module.exports.type = type
