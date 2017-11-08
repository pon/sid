'use strict';

module.exports = class ApplicationCurrentStepUpdated {
  constructor(id, currentStep) {
    this._type = 'APPLICATION_CURRENT_STEP_UPDATED'
    this._id = id
    this._current_step = currentStep
  }

  toJSON() {
    return {
      current_step: this._current_step
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get current_step() {return this._current_step}
}
