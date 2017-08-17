const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('landlord', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false
    },
    name: {type: Sequelize.STRING(255), allowNull: false},
    phone_number: {type: Sequelize.STRING(255), allowNull: false},
    email: {type: Sequelize.STRING(255)},
    address_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {model: 'addresses', key: 'id'}
    },
    verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    verified_at: {type: Sequelize.DATE},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'LANDLORD_CREATED':
            this.id = event.id
            this.name = event.name
            this.phone_number = event.phone_number
            this.email = event.email
            this.address_id = event.address_id
            if (!inMemory) return this.save()
            break
          case 'LANDLORD_UPDATED':
            [
              'name',
              'phone_number',
              'email'
            ].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'LANDLORD_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'LANDLORD_RESTORED':
            this.deleted_at = null
            if (!inMemory) return this.save()
            break
          case 'LANDLORD_VERIFIED':
            this.verified = true
            this.verified_at = event.verified_at
            if (!inMemory) return this.save()
            break
          case 'LANDLORD_UNVERIFIED':
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
