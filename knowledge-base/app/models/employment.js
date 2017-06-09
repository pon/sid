const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('employment', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    status: {type: Sequelize.ENUM('CURRENT', 'FUTURE'), allowNull: false},
    employer_name: {type: Sequelize.STRING(255), allowNull: false},
    is_self_employed: {type: Sequelize.BOOLEAN, allowNull: false},
    self_employed_details: {type: Sequelize.JSON},
    stated_income: {type: Sequelize.INTEGER, allowNull: false},
    verified_income: {type: Sequelize.INTEGER},
    verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    verified_at: Sequelize.DATE,
    deleted_at: Sequelize.DATE
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'EMPLOYMENT_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.status = event.status
            this.employer_name = event.employer_name
            this.is_self_employed = event.is_self_employed
            this.self_employed_details = event.self_employed_details
            this.stated_income = event.stated_income

            if (!inMemory) return this.save()
            break
          case 'EMPLOYMENT_UPDATED':
            [
              'status',
              'employer_name',
              'is_self_employed',
              'self_employed_details',
              'stated_income'
            ].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'EMPLOYMENT_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'EMPLOYMENT_RESTORED':
            this.deleted_at = null
            if (!inMemory) return this.save()
            break
          case 'EMPLOYMENT_VERIFIED':
            this.verified_income = event.verified_income
            this.verified_at = event.verified_at
            this.verified = true
            if (!inMemory) return this.save()
            break
          case 'EMPLOYMENT_UNVERIFIED':
            this.verified_income = null
            this.verified_at = null
            this.verified = false
            if (!inMemory) return this.save()
            break
          default:
            console.log(eventType, 'event not supported')
        }
      }
    }
  })
}
