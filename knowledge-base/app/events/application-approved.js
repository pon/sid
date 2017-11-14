'use strict';

const type = 'APPLICATION_APPROVED'

module.exports.event = class ApplicationApproved {
  constructor(id, approvedAt) {
    this._type = type
    this._id = id
    this._approved_at = approvedAt || new Date()
  }

  toJSON() {
    return {
      approved_at: this._approved_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get approved_at() {return this._approved_at}
}

module.exports.type = type
