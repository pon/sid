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

server.connection({port: process.env.PORT || 5000, routes: {cors: true}})

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
        port: process.env.DATABASE_PORT || 5432,
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
  },
  {
    register: require('./services/plaid'),
    options: {
      plaidClientId: process.env.PLAID_CLIENT_ID,
      plaidEnvironment: process.env.PLAID_ENVIRONMENT,
      plaidKey: process.env.PLAID_KEY,
      plaidSecret: process.env.PLAID_SECRET
    }
  }
], err => {
  if (err) throw err
  server.register([
    {
      register: require('./event-handlers'),
      options: {events: require('./events')}
    },
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
    },
    {
      register: require('./features/statistics'),
      options: {
        events: require('./events')
      }
    },
    {
      register: require('./features/financial'),
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
