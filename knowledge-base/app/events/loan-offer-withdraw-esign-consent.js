'use strict';

module.exports = class LoanOfferWithdrawEsignConsent {
  constructor(id, withdrewAt) {
    this._type = 'LOAN_OFFER_WITHDRAW_ESIGN_CONSENT'
    this._id = id
    this._withdrew_at = withdrewAt || new Date()
  }

  toJSON() {
    return {
      withdrew_at: this._withdrew_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get withdrew_at() {return this._withdrew_at}
}
