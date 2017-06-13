'use strict';

module.exports = class ApplicationDeleted {
  constructor(id, deletedAt) {
    this._type = 'APPLICATION_DELETED'
    this._id = id
    this._deleted_at = deletedAt || new Date()
  }

  toJSON() {
    return {
      deleted_at: this._deleted_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get deleted_at() {return this._deleted_at}
}
