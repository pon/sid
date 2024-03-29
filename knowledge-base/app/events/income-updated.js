'use strict'

const type = 'INCOME_UPDATED'

module.exports.event = class IncomeUpdated {
  constructor(id, args) {
    this._type = type
    this._id = id
    this._income_type = args.income_type
    this._employer_name = args.employer_name
    this._stated_income = args.stated_income
  }

  toJSON() {
    return {
      income_type: this._income_type,
      employer_name: this._employer_name,
      stated_income: this._stated_income
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get income_type() {return this._income_type}
  get employer_name() {return this._employer_name}
  get stated_income() {return this._stated_income}
}

module.exports.type = type
