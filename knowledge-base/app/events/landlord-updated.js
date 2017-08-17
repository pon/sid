'use strict'

module.exports = class LandlordUpdated {
  constructor(id, args) {
    this._type = 'LANDLORD_UPDATED'
    this._id = id
    this._name = args.name
    this._phone_number = args.phone_number
    this._email = args.email
  }

  toJSON() {
    return {
      name: this._name,
      phone_number: this._phone_number,
      email: this._email
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get name() {return this._name}
  get phone_number() {return this._phone_number}
  get email() {return this._email}
}
