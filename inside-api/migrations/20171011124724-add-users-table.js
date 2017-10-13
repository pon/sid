module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {type: Sequelize.UUID, primaryKey: true},
      email: {type: Sequelize.STRING(255), allowNull: false, unique: true},
      password: {type: Sequelize.STRING(255)},
      verified: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
      verified_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
