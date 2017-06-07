const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('state', {
    id: {type: Sequelize.STRING(2), primaryKey: true},
    name: {type: Sequelize.STRING(255), allowNull: false}
  }, {
    createdAt: false
  })
}
