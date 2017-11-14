'use strict'

const type = 'APPLICATION_LEASE_ATTACHED'

module.exports = class ApplicationLeaseAttached {
  constructor(id, leaseId) {
    this._type = type
    this._id = id
    this._lease_id = leaseId
  }

  toJSON() {
    return {
      id: this._id,
      lease_id: this._lease_id
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get lease_id() {return this._lease_id}
}

module.exports.type = type
