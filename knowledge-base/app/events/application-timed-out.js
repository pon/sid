'use strict';

const type = 'APPLICATION_TIMED_OUT'

module.exports = class ApplicationTimedOut {
  constructor(id, timedOutAt) {
    this._type = type
    this._id = id
    this._timed_out_at = timedOutAt || new Date()
  }

  toJSON() {
    return {
      timed_out_at: this._timed_out_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get timed_out_at() {return this._timed_out_at}
}

module.exports.type = type
