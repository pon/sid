'use strict';

module.exports = class LoanOfferConsentToEsign {
  constructor(id, consentedAt) {
    this._type = 'LOAN_OFFER_CONSENT_TO_ESIGN'
    this._id = id
    this._consented_at = consentedAt || new Date()
  }

  toJSON() {
    return {
      consented_at: this._consented_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get consented_at() {return this._consented_at}
}
