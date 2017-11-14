'use strict'

const type = 'FINANCIAL_CREDENTIAL_CREATED'

module.exports.event = class FinancialCredentialCreated {
  constructor(args) {
    this._type = type
    this._id = args.id
    this._user_id = args.user_id
    this._provider = args.provider
    this._remote_id = args.remote_id
    this._institution_name = args.institution_name
    this._credentials = args.credentials
    this._enabled = args.enabled
    this._connected = args.connected
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
      provider: this._provider,
      remote_id: this._remote_id,
      institution_name: this._institution_name,
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
  get user_id() {return this._user_id}
  get provider() {return this._provider}
  get remote_id() {return this._remote_id}
  get institution_name() {return this._institution_name}
  get credentials() {return this._credentials}
  get enabled() {return this._enabled}
  get connected() {return this._connected}
}

module.exports.type = type
