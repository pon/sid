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
    verified_at: Sequelize.DATE
  }, {
    instanceMethods: {
      process: function (event) {
        switch (event.type) {
          case 'ADDRESS_CREATED':
            this.id = event.payload.id
            this.user_id = event.payload.user_id
            this.street_one = event.payload.street_one
            this.street_two = event.payload.street_two
            this.city = event.payload.city
            this.state_id = event.payload.state_id
            this.zip_code = event.payload.zip_code
            this.deleted_at = null
            break
          case 'ADDRESS_UPDATED':
            Object.keys(event.payload).forEach(key => {
              this[key] = event.payload[key]
            })
            break
          case 'ADDRESS_DELETED':
            this.deleted_at = event.created_at
            break
          case 'ADDRESS_RESTORED':
            this.deleted_at = null
            break
          case 'ADDRESS_VERIFIED':
            this.verified = true
            this.verified_at = event.created_at
            break
          case 'ADDRESS_UNVERIFIED':
            this.verified = false
            this.verified_at = null
            break
          default:
            console.log(event.type, 'event not supported')
        }
      }
    }
  })
}
