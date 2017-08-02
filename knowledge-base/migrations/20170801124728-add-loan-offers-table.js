module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('loan_offers', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      application_id: {type: Sequelize.UUID, allowNull: false},
      status: {
        type: Sequelize.ENUM('AWAITING_SIGNATURE', 'REJECTED', 'REVOKED', 'EXPIRED', 'AGREED'),
        allowNull: false
      },
      interest_rate: {type: Sequelize.INTEGER, allowNull: false},
      interest_rate_type: {type: Sequelize.ENUM('interest_only_fixed'), allowNull: false},
      term_in_months: {type: Sequelize.INTEGER, allowNull: true},
      principal_amount: {type: Sequelize.INTEGER, allowNull: false},
      expires_at: {type: Sequelize.DATE, allowNull: false},
      has_esign_consent: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
      signature: {type: Sequelize.STRING(255), allowNull: true},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
