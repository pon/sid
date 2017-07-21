module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('profiles', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      user_id: {type: Sequelize.STRING(255), allowNull: false},
      first_name: {type: Sequelize.STRING(255), allowNull: false},
      last_name: {type: Sequelize.STRING(255), allowNull: false},
      citizenship: {type: Sequelize.ENUM('US_CITIZEN', 'PERM_RESIDENT', 'NON_PERM_RESIDENT')},
      date_of_birth: {type: Sequelize.DATE},
      identity_verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
      identity_verified_at: {type: Sequelize.DATE},
      citizenship_verified: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
      citizenship_verified_at: {type: Sequelize.DATE},
      years_of_employment: {type: Sequelize.INTEGER},
      social_security_number: {type: Sequelize.STRING(0)},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
