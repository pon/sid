'use strict';

module.exports = class LoanOfferUnrevoked {
  constructor(id, unrevokedAt) {
    this._type = 'LOAN_OFFER_UNREVOKED'
    this._id = id
    this._unrevoked_at = unrevokedAt || new Date()
  }

  toJSON() {
    return {
      unrevoked_at: this._unrevoked_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get unrevoked_at() {return this._unrevoked_at}
}
