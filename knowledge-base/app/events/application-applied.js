'use strict';

module.exports = class ApplicationApplied {
  constructor(id, appliedAt) {
    this._type = 'APPLICATION_APPLIED'
    this._id = id
    this._applied_at = appliedAt || new Date()
  }

  toJSON() {
    return {
      applied_at: this._applied_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get applied_at() {return this._applied_at}
}
