module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('password_resets', {
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {model: 'users', key: 'id'}
      },
      token: {type: Sequelize.STRING(255), allowNull: false},
      expires_at: {type: Sequelize.DATE, allowNull: false},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
