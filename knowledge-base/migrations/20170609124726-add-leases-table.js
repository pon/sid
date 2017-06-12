module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('leases', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      user_id: {type: Sequelize.STRING(255), allowNull: false},
      address_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {model: 'addresses', key: 'id'}
      },
      security_deposit: {type: Sequelize.INTEGER, allowNull: false},
      monthly_rent: {type: Sequelize.INTEGER, allowNull: false},
      start_date: {type: Sequelize.DATE, allowNull: false},
      end_date: {type: Sequelize.DATE, allowNull: false},
      term_months: {type: Sequelize.INTEGER, allowNull: false},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
