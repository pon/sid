'use strict';

const type = 'APPLICATION_UNDECLINED'

module.exports.event = class ApplicationUndeclined {
  constructor(id, undeclinedAt) {
    this._type = type
    this._id = id
    this._undeclined_at = undeclinedAt || new Date()
  }

  toJSON() {
    return {
      undeclined_at: this._undeclined_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get undeclined_at() {return this._undeclined_at}
}

module.exports.type = type
