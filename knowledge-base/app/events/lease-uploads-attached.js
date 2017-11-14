'use strict'

const type = 'LEASE_UPLOADS_ATTACHED'

module.exports.event = class LeaseUploadsAttached {
  constructor(id, uploadIds) {
    this._type = type
    this._id = id
    this._upload_ids = uploadIds
  }

  toJSON() {
    return {
      id: this._id,
      upload_ids: this._upload_ids
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get upload_ids() {return this._upload_ids}
}

module.exports.type = type
