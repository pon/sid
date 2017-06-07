const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('address', {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true},
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    street_one: {type: Sequelize.STRING(255), allowNull: false},
    street_two: {type: Sequelize.STRING(255), allowNull: true},
    city: {type: Sequelize.STRING(255), allowNull: false},
    state_id: {type: Sequelize.STRING(2), allowNull: false},
    zip_code: {type: Sequelize.STRING(9), allowNull: false},
    country_id: {type: Sequelize.STRING(2), allowNull: false, defaultValue: 'US'}
  })
}
