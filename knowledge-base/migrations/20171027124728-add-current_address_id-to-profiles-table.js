module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('profiles', 'current_address_id', {
      type: Sequelize.UUID,
      references: {model: 'addresses', key: 'id'}
    });
  }
}
