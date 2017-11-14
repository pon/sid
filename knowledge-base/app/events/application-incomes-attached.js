'use strict'

const type = 'APPLICATION_INCOMES_ATTACHED'

module.exports.event = class ApplicationIncomesAttached {
  constructor(id, incomeIds) {
    this._type = type
    this._id = id
    this._income_ids = incomeIds
  }

  toJSON() {
    return {
      id: this._id,
      income_ids: this._income_ids
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get income_ids() {return this._income_ids}
}

module.exports.type = type
