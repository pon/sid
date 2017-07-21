const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('application_upload', {
    application_id: {primaryKey: true, type: Sequelize.UUID},
    upload_id: {primaryKey: true, type: Sequelize.UUID},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false
  })
}
