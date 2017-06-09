'use strict';

module.exports = class EmploymentUnverified {
  constructor(id, unverifiedAt) {
    this._type = 'EMPLOYMENT_UNVERIFIED'
    this._id = id
    this._unverified_at = unverifiedAt || new Date()
  }

  toJSON() {
    return {
      unverified_at: this._unverified_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get unverified_at() {return this._unverified_at}
}
