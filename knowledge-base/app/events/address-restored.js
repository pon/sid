'use strict';

module.exports = class AddressRestored {
  constructor(id) {
    this._type = 'ADDRESS_RESTORED'
    this._id = id
  }

  toJSON() {
    return {}
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
}
