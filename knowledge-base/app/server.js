const Hapi = require('hapi')
const Pkg = require('../package.json')

const Bunyan = require('bunyan')
const logger = Bunyan.createLogger({name: Pkg.name, level: 'debug'})
process.on('uncaughtException', err => {
  logger.error(err)
})

const server = new Hapi.Server({
  connections: {
    router: {stripTrailingSlash: true}
  }
})

server.connection({port: 5000, routes: {cors: true}})

server.register([
  {
    register: require('./services/ping'),
    options: {name: Pkg.name, version: Pkg.version}
  },
  {
    register: require('./services/logging'),
    options: {logger: logger}
  },
  require('./services/errors'),
  require('./services/schemas'),
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
  },
  require('./services/documentation')
], err => {
  server.register([
    require('./event-handlers'),
    {
      register: require('./features/addresses'),
      options: {events: require('./events')}
    },
    {
      register: require('./features/employments'),
      options: {events: require('./events')}
    },
    {
      register: require('./features/leases'),
      options: {events: require('./events')}
    }
  ], err => {
    if (err) throw err
    server.start(err => {
      if (err) throw err
      console.log(`Server Running at: ${server.info.uri}`)
    })
  })
})
