const P = require('bluebird')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return P.all([
      queryInterface.addColumn('users', 'verified', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }),
      queryInterface.addColumn('users', 'verified_at', {
        type: Sequelize.DATE
      })
    ])
  }
}
