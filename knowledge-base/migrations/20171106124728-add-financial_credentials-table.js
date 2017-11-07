 module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('financial_credentials', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      user_id: {type: Sequelize.STRING(255), allowNull: false},
      provider: {type: Sequelize.ENUM('PLAID'), allowNull: false},
      remote_id: {type: Sequelize.STRING(255)},
      insitution_name: {type: Sequelize.STRING(255)},
      credentials: {type: Sequelize.JSON, allowNull: false},
      enabled: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
      connected: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
