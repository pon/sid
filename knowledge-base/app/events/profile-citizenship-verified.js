'use strict';

const type = 'PROFILE_CITIZENSHIP_VERIFIED'

module.exports.event = class ProfileCitizenshipVerified {
  constructor(id, verifiedAt) {
    this._type = type
    this._id = id
    this._verified_at = verifiedAt || new Date()
  }

  toJSON() {
    return {
      verified_at: this._verified_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get verified_at() {return this._verified_at}
}

module.exports.type = type
