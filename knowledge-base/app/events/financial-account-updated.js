'use strict';

const type = 'FINANCIAL_ACCOUNT_UPDATED'

module.exports = class FinancialAccountUpdated {
  constructor(id, args) {
    this._type = type
    this._id = id
    this._name = args.name
    this._account_type = args.account_type
    this._account_subtype = args.account_subtype
    this._available_balance = args.available_balance
    this._current_balance = args.current_balance
    this._credit_limit = args.credit_limit
    this._raw_response = args.raw_response
    this._account_number = args.account_number
    this._routing_number = args.routing_number
    this._wire_routing_number = args.wire_routing_number
  }

  toJSON() {
    return {
      name: this._name,
      account_type: this._account_type,
      account_subtype: this._account_subtype,
      available_balance: this._available_balance,
      current_balance: this._current_balance,
      credit_limit: this._credit_limit,
      raw_response: this._raw_response,
      account_number: this._account_number,
      routing_number: this._routing_number,
      wire_routing_number: this._wire_routing_number
    } 
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get name() {return this._name}
  get account_type() {return this._account_type}
  get account_subtype() {return this._account_subtype}
  get available_balance() {return this._available_balance}
  get current_balance() {return this._current_balance}
  get credit_limit() {return this._credit_limit}
  get raw_response() {return this._raw_response}
  get account_number() {return this._account_number}
  get routing_number() {return this._routing_number}
  get wire_routing_number() {return this._wire_routing_number}
}

module.exports.type = type
