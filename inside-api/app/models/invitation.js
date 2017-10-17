const Sequelize = require('sequelize')

module.exports = db => {
  const model = db.define('invitation', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    token: {type: Sequelize.STRING(255), allowNull: false},
    expires_at: {type: Sequelize.DATE, allowNull: false}
  }, {
    instanceMethods: {
      serialize: function () {
        return {
          id: this.id,
          token: this.token,
          expires_at: this.expires_at,
          created_at: this.created_at,
          updated_at: this.updated_at
        }
      }
    }
  })

  return model
}
