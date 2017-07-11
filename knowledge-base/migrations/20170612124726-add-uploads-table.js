module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('uploads', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        allowNull: false
      },
      application_id: {type: Sequelize.STRING(255), allowNull: false},
      file_name: {type: Sequelize.STRING(255), allowNull: false},
      bucket_name: {type: Sequelize.STRING(255), allowNull: false},
      path: {type: Sequelize.STRING(255), allowNull: false},
      content_type: {type: Sequelize.STRING(255), allowNull: false},
      category: {type: Sequelize.STRING(255), allowNull: false},
      created_at: {type: Sequelize.DATE, allowNull: false},
      updated_at: {type: Sequelize.DATE, allowNull: false},
      deleted_at: {type: Sequelize.DATE}
    })
  }
}
