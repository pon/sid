'use strict'

const type = 'LEASE_LANDLORD_ATTACHED'

module.exports.event = class LeaseLandlordAttached {
  constructor(id, landlordId) {
    this._type = type
    this._id = id
    this._landlord_id = landlordId
  }

  toJSON() {
    return {
      id: this._id,
      landlord_id: this._landlord_id
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get landlord_id() {return this._landlord_id}
}

module.exports.type = type
