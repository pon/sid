'use strict';

const type = 'APPLICATION_COMPLETED_VERIFICATION'

module.exports.event = class ApplicationCompletedVerification {
  constructor(id, completedVerificationAt) {
    this._type = type
    this._id = id
    this._completed_verification_at = completedVerificationAt || new Date()
  }

  toJSON() {
    return {
      completed_verification_at: this._completed_verification_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get completed_verification_at() {return this._completed_verification_at}
}

module.exports.type = type
