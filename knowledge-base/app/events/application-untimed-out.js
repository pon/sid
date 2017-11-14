'use strict';

const type = 'APPLICATION_UNTIMED_OUT'

module.exports = class ApplicationUnuntimedOut {
  constructor(id, untimedOutAt) {
    this._type = type
    this._id = id
    this._untimed_out_at = untimedOutAt || new Date()
  }

  toJSON() {
    return {
      untimed_out_at: this._untimed_out_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get untimed_out_at() {return this._untimed_out_at}
}

module.exports.type = type
