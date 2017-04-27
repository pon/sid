const P = require('bluebird')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_DATABASE, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  define: {
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  logging: false
})

const models = require('../app/models')(sequelize)

module.exports = {
  truncateAllTables: () => {
    return P.each(Object.getOwnPropertyNames(models).map(modelName => {
      return models[modelName]
    }), model => {
      return model.destroy({
        truncate: true,
        cascade: true
      })
    })
  }
}
