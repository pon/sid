const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('financial_credential', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    provider: {type: Sequelize.ENUM('PLAID'), allowNull: false},
    remote_id: {type: Sequelize.STRING(255)},
    institution_name: {type: Sequelize.STRING(255)},
    credentials: {type: Sequelize.JSON, allowNull: false},
    enabled: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
    connected: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    deleted_at: Sequelize.DATE
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'FINANCIAL_CREDENTIAL_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.provider = event.provider
            this.remote_name = event.remote_name
            this.institution_name = event.institution_name
            this.credentials = event.credentials
            this.enabled = event.enabled
            if (!inMemory) return this.save()
            break
          case 'FINANCIAL_CREDENTIAL_UPDATED':
            ['credentials', 'enabled', 'institution_name', 'remote_id', 'connected'].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'FINANCIAL_CREDENTIAL_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'FINANCIAL_CREDENTIAL_RESTORED':
            this.deleted_at = null
            if (!inMemory) return this.save()
            break
          default:
            console.log(event.type, 'event not supported')
        }
      }
    }
  })
}
