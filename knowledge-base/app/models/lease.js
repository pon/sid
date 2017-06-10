const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('lease', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false
    },
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    address_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {model: 'addresses', key: 'id'}
    },
    security_deposit: {type: Sequelize.INTEGER, allowNull: false},
    monthly_rent: {type: Sequelize.INTEGER, allowNull: false},
    start_date: {type: Sequelize.DATE, allowNull: false},
    end_date: {type: Sequelize.DATE, allowNull: false},
    term_months: {type: Sequelize.INTEGER, allowNull: false},
    verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    verified_at: Sequelize.DATE,
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'LEASE_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.address_id = event.address_id
            this.security_deposit = event.security_deposit
            this.monthly_rent = event.monthly_rent
            this.start_date = event.start_date
            this.end_date = event.end_date
            this.term_months = event.term_months
            if (!inMemory) return this.save()
            break
          case 'LEASE_UPDATED':
            [
              'security_deposit',
              'monthly_rent',
              'start_date',
              'end_date',
              'term_months'
            ].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'LEASE_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'LEASE_RESTORED':
            this.deleted_at = null
            if (!inMemory) return this.save()
            break
          case 'LEASE_VERIFIED':
            this.verified_at = event.verified_at
            this.verified = true
            if (!inMemory) return this.save()
            break
          case 'LEASE_UNVERIFIED':
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
