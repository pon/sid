const Sequelize = require('sequelize')

module.exports = db => {
  const model = db.define('password_reset', {
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    token: {type: Sequelize.STRING(255), allowNull: false},
    expires_at: {type: Sequelize.DATE, allowNull: false}
  })

  model.removeAttribute('id')
  return model
}
