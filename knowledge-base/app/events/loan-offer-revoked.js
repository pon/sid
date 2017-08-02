'use strict';

module.exports = class LoanOfferRevoked {
  constructor(id, revokedAt) {
    this._type = 'LOAN_OFFER_REVOKED'
    this._id = id
    this._revoked_at = revokedAt || new Date()
  }

  toJSON() {
    return {
      revoked_at: this._revoked_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get revoked_at() {return this._revoked_at}
}
