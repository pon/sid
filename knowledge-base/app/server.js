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
  require('./services/documentation'),
  {
    register: require('./services/aws'),
    options: {
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      fakeS3Url: process.env.AWS_FAKE_S3_URL,
      fakeS3Port: process.env.AWS_FAKE_S3_PORT
    }
  }
], err => {
  server.register([
    require('./event-handlers'),
    {
      register: require('./features/addresses'),
      options: {events: require('./events')}
    },
    {
      register: require('./features/incomes'),
      options: {events: require('./events')}
    },
    {
      register: require('./features/leases'),
      options: {events: require('./events')}
    },
    {
      register: require('./features/landlords'),
      options: {events: require('./events')}
    },
    {
      register: require('./features/uploads'),
      options: {
        events: require('./events'),
        bucket: process.env.UPLOADS_BUCKET
      }
    },
    {
      register: require('./features/credit-reports'),
      options: {
        events: require('./events')
      }
    },
    {
      register: require('./features/applications'),
      options: {
        events: require('./events')
      }
    },
    {
      register: require('./features/loan-offers'),
      options: {
        events: require('./events')
      }
    },
    {
      register: require('./features/profiles'),
      options: {
        events: require('./events')
      }
    }
  ], err => {
    if (err) throw err
    server.start(err => {
      if (err) throw err
      console.log(`Server Running at: ${server.info.uri}`)
    })
  })
})
