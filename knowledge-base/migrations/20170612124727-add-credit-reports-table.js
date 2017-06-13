module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('credit_reports', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      user_id: {type: Sequelize.STRING(255), allowNull: false},
      provider: {type: Sequelize.ENUM('EXPERIAN'), defaultValue: 'EXPERIAN', allowNull: false},
      raw_credit_report: {type: Sequelize.JSON, allowNull: false},
      fico_score: {type: Sequelize.INTEGER, allowNull: false},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
