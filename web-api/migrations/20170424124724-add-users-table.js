module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {type: Sequelize.STRING(255), primaryKey: true},
      first_name: {type: Sequelize.STRING(255), allowNull: false},
      last_name: {type: Sequelize.STRING(255), allowNull: false},
      email: {type: Sequelize.STRING(255), allowNull: false, unique: true},
      password: {type: Sequelize.STRING(255), allowNull: false},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    });
  }
}
