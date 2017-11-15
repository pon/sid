module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('financial_accounts', 'stripe_bank_account_token', {
      type: Sequelize.STRING(255)
    });
  }
}
