module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('applications', 'current_step', {
      type: Sequelize.STRING(255)
    });
  }
}
