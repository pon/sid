'use strict';

const type = 'APPLICATION_DECLINED'

module.exports = class ApplicationDeclined {
  constructor(id, declinedAt) {
    this._type = type
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

module.exports.type = type
