module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('employments', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      user_id: {type: Sequelize.STRING(255), allowNull: false},
      status: {type: Sequelize.ENUM('CURRENT', 'FUTURE'), allowNull: false},
      employer_name: {type: Sequelize.STRING(255), allowNull: false},
      start_month: {type: Sequelize.INTEGER, allowNull: false},
      start_year: {type: Sequelize.INTEGER, allowNull: false},
      is_self_employed: {type: Sequelize.BOOLEAN, allowNull: false},
      self_employed_details: {type: Sequelize.JSON},
      stated_income: {type: Sequelize.INTEGER, allowNull: false},
      verified_income: {type: Sequelize.INTEGER},
      verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
      verified_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
