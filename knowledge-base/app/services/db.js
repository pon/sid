exports.register = function (server, options, next) {
  const Sequelize = require('sequelize')
  const sequelize = new Sequelize(
    options.config.database, options.config.username, options.config.password, {
      host: options.config.host,
      dialect: options.config.dialect,
      define: {
        createdAt: 'created_at',
        updatedAt: false,
        deletedAt: false
      },
      logging: false
    })

  server.expose({
    sequelize: sequelize,
    models: options.models(sequelize)
  })

  sequelize.authenticate().asCallback(next)
}

exports.register.attributes = {
  name: 'db',
  version: '1.0.0'
}
