module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('landlords', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      name: {type: Sequelize.STRING(255), allowNull: false},
      phone_number: {type: Sequelize.STRING(255), allowNull: false},
      email: {type: Sequelize.STRING(255)},
      address_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {model: 'addresses', key: 'id'}
      },
      verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
      verified_at: {type: Sequelize.DATE},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
