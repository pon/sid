const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('profile', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    first_name: {type: Sequelize.STRING(255), allowNull: false},
    last_name: {type: Sequelize.STRING(255), allowNull: false},
    citizenship: {type: Sequelize.ENUM('US_CITIZEN', 'PERM_RESIDENT', 'NON_PERM_RESIDENT')},
    date_of_birth: {type: Sequelize.DATE},
    identity_verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    identity_verified_at: {type: Sequelize.DATE},
    citizenship_verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    citizenship_verified_at: {type: Sequelize.DATE},
    years_of_employment: {type: Sequelize.INTEGER},
    social_security_number: {type: Sequelize.STRING(9)},
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
            this.last_name = event.last_name
            this.citizenship = event.citizenship
            this.date_of_birth = event.date_of_birth
            this.years_of_employment = event.years_of_employment
            this.social_security_number = event.social_security_number
            if (!inMemory) return this.save()
            break
          case 'PROFILE_UPDATED':
            [
              'first_name',
              'last_name',
              'citizenship',
              'date_of_birth',
              'years_of_employment',
              'social_security_number'
            ].forEach(key => {
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
