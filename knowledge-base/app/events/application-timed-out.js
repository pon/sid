'use strict';

module.exports = class ApplicationTimedOut {
  constructor(id, timedOutAt) {
    this._type = 'APPLICATION_TIMED_OUT'
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
