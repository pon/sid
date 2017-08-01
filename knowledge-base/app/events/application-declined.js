'use strict';

module.exports = class ApplicationDeclined {
  constructor(id, declinedAt) {
    this._type = 'APPLICATION_DECLINED'
    this._id = id
    this._declined_at = declinedAt || new Date()
  }

  toJSON() {
    return {
      declined_at: this._declined_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get declined_at() {return this._declined_at}
}
