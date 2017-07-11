const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('income', {
    id: {primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1},
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    income_type: {
      type: Sequelize.ENUM('SALARY', 'SELF_EMPLOYED', 'RENTAL',
        'SOCIAL_SECURITY_PENSION', 'DISABILITY', 'CHILD_SUPPORT_ALIMONY', 'K1'),
      allowNull: false
    },
    employer_name: {type: Sequelize.STRING(255)},
    stated_income: {type: Sequelize.INTEGER, allowNull: false},
    verified_income: {type: Sequelize.INTEGER},
    verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    verified_at: {type: Sequelize.DATE},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'INCOME_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.income_type = event.income_type
            this.employer_name = event.employer_name
            this.stated_income = event.stated_income

            if (!inMemory) return this.save()
            break
          case 'INCOME_UPDATED':
            [
              'income_type',
              'employer_name',
              'stated_income'
            ].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'INCOME_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'INCOME_RESTORED':
            this.deleted_at = null
            if (!inMemory) return this.save()
            break
          case 'INCOME_VERIFIED':
            this.verified_income = event.verified_income
            this.verified_at = event.verified_at
            this.verified = true
            if (!inMemory) return this.save()
            break
          case 'INCOME_UNVERIFIED':
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
