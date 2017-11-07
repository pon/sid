 module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('financial_accounts', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      financial_credential_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {model: 'financial_credentials', key: 'id'}
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
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
