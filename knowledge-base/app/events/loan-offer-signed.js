'use strict';

const type = 'LOAN_OFFER_SIGNED'

module.exports.event = class LoanOfferSigned {
  constructor(id, signature, signedAt) {
    this._type = type
    this._id = id
    this._signature = signature
    this._signed_at = signedAt || new Date()
  }

  toJSON() {
    return {
      signature: this._signature,
      signed_at: this._signed_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get signature() {return this._signature}
  get signed_at() {return this._signed_at}
}

module.exports.type = type
