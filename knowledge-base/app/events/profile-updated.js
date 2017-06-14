'use strict'

module.exports = class ProfileUpdated {
  constructor(id, args) {
    this._type = 'PROFILE_UPDATED'
    this._id = id
    this._first_name = args.first_name
    this._last_name = args.last_name
    this._citizenship = args.citizenship
    this._date_of_birth = args.date_of_birth
  }

  toJSON() {
    return {
      first_name: this._first_name,
      last_name: this._last_name,
      citizenship: this._citizenship,
      date_of_birth: this._date_of_birth
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get first_name() {return this._first_name}
  get last_name() {return this._last_name}
  get citizenship() {return this._citizenship}
  get date_of_birth() {return this._date_of_birth}
}
