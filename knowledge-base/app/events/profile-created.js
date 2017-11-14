'use strict'

const type = 'PROFILE_CREATED'

module.exports.event = class ProfileCreated {
  constructor(args) {
    this._type = type
    this._id = args.id
    this._user_id = args.user_id
    this._first_name = args.first_name
    this._last_name = args.last_name
    this._citizenship = args.citizenship
    this._date_of_birth = args.date_of_birth
    this._years_of_employment = args.years_of_employment
    this._social_security_number = args.social_security_number
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
      first_name: this._first_name,
      last_name: this._last_name,
      citizenship: this._citizenship,
      date_of_birth: this._date_of_birth,
      years_of_employment: this._years_of_employment,
      social_security_number: this._social_security_number
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
  get years_of_employment() {return this._years_of_employment}
  get social_security_number() {return this._social_security_number}
}

module.exports.type = type
