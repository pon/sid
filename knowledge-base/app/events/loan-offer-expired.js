'use strict';

const type = 'LOAN_OFFER_EXPIRED'

module.exports = class LoanOfferExpired {
  constructor(id, expiredAt) {
    this._type = type
    this._id = id
    this._expired_at = expiredAt || new Date()
  }

  toJSON() {
    return {
      expired_at: this._expired_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get expired_at() {return this._expired_at}
}

module.exports.type = type
