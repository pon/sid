const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('profile', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    first_name: {type: Sequelize.STRING(255), allowNull: false},
    last_name: {type: Sequelize.STRING(255), allowNull: false},
    citizenship: {
      type: Sequelize.ENUM('US_CITIZEN', 'PERM_RESIDENT', 'NON_PERM_RESIDENT'),
      allowNull: false
    },
    date_of_birth: {type: Sequelize.DATE, allowNull: false},
    identity_verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    identity_verified_at: {type: Sequelize.DATE},
    citizenship_verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    citizenship_verified_at: {type: Sequelize.DATE},
    deleted_at: Sequelize.DATE
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'PROFILE_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.first_name = event.first_name
            this.last_name = event.first_name
            this.citizenship = event.citizenship
            this.date_of_birth = event.date_of_birth
            if (!inMemory) return this.save()
            break
          case 'PROFILE_UPDATED':
            ['first_name', 'last_name', 'citizenship', 'date_of_birth'].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })

            if (!inMemory) return this.save()
            break
          case 'PROFILE_CITIZENSHIP_VERIFIED':
            this.citizenship_verified = true
            this.citizenship_verified_at = event.verified_at
            if (!inMemory) return this.save()
            break
          case 'PROFILE_CITIZENSHIP_UNVERIFIED':
            this.citizenship_verified = false
            this.citizenship_verified_at = null
            if (!inMemory) return this.save()
            break
          case 'PROFILE_IDENTITY_VERIFIED':
            this.identity_verified = true
            this.identity_verified_at = event.verified_at
            if (!inMemory) return this.save()
            break
          case 'PROFILE_IDENTITY_UNVERIFIED':
            this.identity_verified = false
            this.identity_verified_at = null
            if (!inMemory) return this.save()
            break
          default:
            console.log(event.type, 'event not supported')
        }
      }
    }
  })
}
