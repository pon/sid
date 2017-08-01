module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('applications', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      user_id: {type: Sequelize.STRING(255), allowNull: false},
      status: {
        type: Sequelize.ENUM('APPLYING', 'VERIFYING', 'TIMED_OUT', 'UNDERWRITING', 'APPROVED', 'DECLINED'),
        allowNull: false
      },
      credit_report_id: {type: Sequelize.UUID, references: {model: 'credit_reports', key: 'id'}},
      lease_id: {type: Sequelize.UUID, references: {model: 'leases', key: 'id'}},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
