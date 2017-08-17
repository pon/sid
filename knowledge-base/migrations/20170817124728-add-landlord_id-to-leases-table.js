module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('leases', 'landlord_id', {
      type: Sequelize.UUID,
      references: {model: 'landlords', key: 'id'}
    });
  }
}
