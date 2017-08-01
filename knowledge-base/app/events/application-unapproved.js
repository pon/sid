'use strict';

module.exports = class ApplicationUnunapproved {
  constructor(id, unapprovedAt) {
    this._type = 'APPLICATION_UNAPPROVED'
    this._id = id
    this._unapproved_at = unapprovedAt || new Date()
  }

  toJSON() {
    return {
      unapproved_at: this._unapproved_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get unapproved_at() {return this._unapproved_at}
}
