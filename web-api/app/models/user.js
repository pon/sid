const id = require('../utils/id')
const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('user', {
    id: {type: Sequelize.STRING(255), primaryKey: true},
    email: {type: Sequelize.STRING(255), allowNull: false},
    password: {type: Sequelize.STRING(255), allowNull: false},
    verified: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    verified_at: Sequelize.DATE
  }, {
    hooks: {
      beforeCreate: (model, options, done) => {
        model.id = id('user')
        done()
      }
    }
  })
}
