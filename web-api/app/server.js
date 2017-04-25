const Hapi = require('hapi')
const Path = require('path')
const Pkg  = require('../package.json')

const Bunyan = require('bunyan');
const logger = Bunyan.createLogger({name: Pkg.name, level: 'debug'});
process.on('uncaughtException', err => {
  logger.error(err);
});

const server = new Hapi.Server({
  connections: {
    router: {stripTrailingSlash: true}
  }
})

server.connection({port: 4000})

server.register([
  {
    register: require('./services/ping'),
    options: {name: Pkg.name, version: Pkg.version}
  },
  {
    register: require('./services/logging'),
    options: {logger: logger}
  },
  {
    register: require('./services/db'),
    options: {
      config: {
        database: process.env.DATABASE_DATABASE,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        dialect: 'postgres'
      },
      models: require('./models')
    }
  }
], err => {
  return server.start()
  .then(() => {
    console.log(`Server Running at: ${server.info.uri}`)
  })
})
