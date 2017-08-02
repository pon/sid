'use strict';

module.exports = class LoanOfferExpired {
  constructor(id, expiredAt) {
    this._type = 'LOAN_OFFER_EXPIRED'
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
