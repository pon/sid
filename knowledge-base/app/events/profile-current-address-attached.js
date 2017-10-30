'use strict'

module.exports = class ProfileCurrentAddressAttached {
  constructor(id, addressId) {
    this._type = 'PROFILE_CURRENT_ADDRESS_ATTACHED'
    this._id = id
    this._address_id = addressId
  }

  toJSON() {
    return {
      id: this._id,
      address_id: this._address_id
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get address_id() {return this._address_id}
}
