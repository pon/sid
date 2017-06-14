'use strict'

module.exports = class ProfileCreated {
  constructor(args) {
    this._type = 'PROFILE_CREATED'
    this._id = args.id
    this._user_id = args.user_id
    this._first_name = args.first_name
    this._last_name = args.last_name
    this._citizenship = args.citizenship
    this._date_of_birth = args.date_of_birth
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
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
  get user_id() {return this._user_id}
  get first_name() {return this._first_name}
  get last_name() {return this._last_name}
  get citizenship() {return this._citizenship}
  get date_of_birth() {return this._date_of_birth}
}
