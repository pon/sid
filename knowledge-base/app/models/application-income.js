const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('application_income', {
    application_id: {primaryKey: true, type: Sequelize.UUID},
    income_id: {primaryKey: true, type: Sequelize.UUID},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false
  })
}
