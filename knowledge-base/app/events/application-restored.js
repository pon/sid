'use strict';

module.exports = class ApplicationRestored {
  constructor(id, restoredAt) {
    this._type = 'APPLICATION_RESTORED'
    this._id = id
    this._restored_at = restoredAt || new Date()
  }

  toJSON() {
    return {
      restored_at: this._restored_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get restored_at() {return this._restored_at}
}
