const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('address', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    street_one: {type: Sequelize.STRING(255), allowNull: false},
    street_two: {type: Sequelize.STRING(255), allowNull: true},
    city: {type: Sequelize.STRING(255), allowNull: false},
    state_id: {type: Sequelize.STRING(2), allowNull: false},
    zip_code: {type: Sequelize.STRING(9), allowNull: false},
    country_id: {type: Sequelize.STRING(2), allowNull: false, defaultValue: 'US'},
    verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    verified_at: Sequelize.DATE,
    deleted_at: Sequelize.DATE
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'ADDRESS_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.street_one = event.street_one
            this.street_two = event.street_two
            this.city = event.city
            this.state_id = event.state_id
            this.zip_code = event.zip_code
            if (!inMemory) return this.save()
            break
          case 'ADDRESS_UPDATED':
            ['street_one', 'street_two', 'city', 'state_id', 'zip_code'].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'ADDRESS_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'ADDRESS_RESTORED':
            this.deleted_at = null
            if (!inMemory) return this.save()
            break
          case 'ADDRESS_VERIFIED':
            this.verified = true
            this.verified_at = event.verified_at
            if (!inMemory) return this.save()
            break
          case 'ADDRESS_UNVERIFIED':
            this.verified = false
            this.verified_at = null
            if (!inMemory) return this.save()
            break
          default:
            console.log(event.type, 'event not supported')
        }
      }
    }
  })
}
