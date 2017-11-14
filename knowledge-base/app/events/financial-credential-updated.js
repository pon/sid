'use strict';

const type = 'FINANCIAL_CREDENTIAL_UPDATED'

module.exports.event = class FinancialCredentialUpdated {
  constructor(id, args) {
    this._type = type
    this._id = id
    this._institution_name = args.institution_name
    this._remote_id = args.remote_id
    this._credentials = args.credentials
    this._enabled = args.enabled
    this._connected = args.connected
  }

  toJSON() {
    return {
      institution_name: this._institution_name,
      remote_id: this._remote_id,
      credentials: this._credentials,
      enabled: this._enabled,
      connected: this._connected
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get institution_name() {return this._institution_name}
  get remote_id() {return this._remote_id}
  get credentials() {return this._credentials}
  get enabled() {return this._enabled}
  get connected() {return this._connected}
}

module.exports.type = type
