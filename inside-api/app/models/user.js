const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('user', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    email: {type: Sequelize.STRING(255), allowNull: false},
    password: {type: Sequelize.STRING(255)},
    verified: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    verified_at: Sequelize.DATE
  })
}
