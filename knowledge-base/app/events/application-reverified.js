'use strict';

const type = 'APPLICATION_REVERIFIED'

module.exports = class ApplicationReverified {
  constructor(id, reverifiedAt) {
    this._type = type
    this._id = id
    this._reverified_at = reverifiedAt || new Date()
  }

  toJSON() {
    return {
      reverified_at: this._reverified_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get reverified_at() {return this._reverified_at}
}

module.exports.type = type
