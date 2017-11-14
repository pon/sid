'use strict';

const type = 'LOAN_OFFER_UNREVOKED'

module.exports = class LoanOfferUnrevoked {
  constructor(id, unrevokedAt) {
    this._type = type
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

module.exports.type = type
