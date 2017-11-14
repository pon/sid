module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('loan_offers', 'current_step', {
      type: Sequelize.STRING(255)
    });
  }
}
