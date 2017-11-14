module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('lease_uploads', {
      lease_id: {type: Sequelize.UUID, allowNull: false, primaryKey: true},
      upload_id: {type: Sequelize.UUID, allowNull: false, primaryKey: true},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
