'use strict'

const type = 'LANDLORD_CREATED'

module.exports.event = class LandlordCreated {
  constructor(args) {
    this._type = type
    this._id = args.id
    this._name = args.name
    this._phone_number = args.phone_number
    this._email = args.email
    this._address_id = args.address_id
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      phone_number: this._phone_number,
      email: this._email,
      address_id: this._address_id
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
  get address_id() {return this._address_id}
}

module.exports.type = type
