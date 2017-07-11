module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('incomes', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      user_id: {type: Sequelize.STRING(255), allowNull: false},
      income_type: {type: Sequelize.ENUM('SALARY', 'SELF_EMPLOYED', 'RENTAL', 'SOCIAL_SECURITY_PENSION', 'DISABILITY', 'CHILD_SUPPORT_ALIMONY', 'K1'), allowNull: false},
      employer_name: {type: Sequelize.STRING(255)},
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
