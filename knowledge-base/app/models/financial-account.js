const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('financial_account', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    financial_credential_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {model: 'financial_credential', key: 'id'}
    },
    remote_id: {type: Sequelize.STRING(255), allowNull: false},
    name: {type: Sequelize.STRING(255), allowNull: false},
    account_type: {type: Sequelize.STRING(255), allowNull: false},
    account_subtype: {type: Sequelize.STRING(255), allowNull: false},
    available_balance: {type: Sequelize.INTEGER},
    current_balance: {type: Sequelize.INTEGER},
    credit_limit: {type: Sequelize.INTEGER},
    raw_response: {type: Sequelize.JSON, allowNull: false},
    account_number: {type: Sequelize.STRING(255)},
    routing_number: {type: Sequelize.STRING(255)},
    wire_routing_number: {type: Sequelize.STRING(255)},
    deleted_at: Sequelize.DATE
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'FINANCIAL_ACCOUNT_CREATED':
            this.id = event.id
            this.financial_credential_id = event.financial_credential_id
            this.remote_id = event.remote_id
            this.name = event.name
            this.account_type = event.account_type
            this.account_subtype = event.account_subtype
            this.available_balance = event.available_balance
            this.current_balance = event.current_balance
            this.credit_limit = event.credit_limit
            this.raw_response = event.raw_response
            this.account_number = event.account_number
            this.routing_number = event.routing_number
            this.wire_routing_number = event.wire_routing_number
            if (!inMemory) return this.save()
            break
          case 'FINANCIAL_ACCOUNT_UPDATED':
            ['name', 'account_type', 'account_subtype', 'available_balance', 'current_balance', 
              'raw_response', 'credit_limit', 'account_number', 'routing_number', 'wire_routing_number'
            ].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'FINANCIAL_ACCOUNT_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'FINANCIAL_ACCOUNT_RESTORED':
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
