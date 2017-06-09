'use strict';

module.exports = class EmploymentVerified {
  constructor(id, verifiedIncome, verifiedAt) {
    this._type = 'EMPLOYMENT_VERIFIED'
    this._id = id
    this._verified_income = verifiedIncome
    this._verified_at = verifiedAt || new Date()
  }

  toJSON() {
    return {
      verified_income: this._verified_income,
      verified_at: this._verified_at
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get verified_income() {return this._verified_income}
  get verified_at() {return this._verified_at}
}
