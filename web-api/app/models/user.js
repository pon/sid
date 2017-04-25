const id        = require('../utils/id')
const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('user', {
    id: {
      type: Sequelize.STRING(255),
      primaryKey: true
    },
    first_name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: (model, options, done) => {
        model.id = id('user')
        done()
      }
    }
  })
}
