const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('user', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    email: {type: Sequelize.STRING(255), allowNull: false},
    password: {type: Sequelize.STRING(255)},
    verified: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    verified_at: Sequelize.DATE
  }, {
    instanceMethods: {
      serialize: function () {
        return {
          id: this.id,
          email: this.email,
          verified: this.verified,
          verified_at: this.verified_at,
          invitations: this.invitations ? this.invitations.map(invite => invite.serialize()) : [],
          created_at: this.created_at,
          updated_at: this.updated_at
        }
      }
    }
  })
}
