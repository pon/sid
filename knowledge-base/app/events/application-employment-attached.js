'use strict'

module.exports = class ApplicationEmploymentAttached {
  constructor(id, employmentId) {
    this._type = 'APPLICATION_EMPLOYMENT_ATTACHED'
    this._id = id
    this._employment_id = employmentId
  }

  toJSON() {
    return {
      id: this._id,
      employment_id: this._employment_id
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get employment_id() {return this._employment_id}
}
