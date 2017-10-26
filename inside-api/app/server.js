const fs = require('fs')
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

const serverOptions = {
  port: process.env.PORT || 2000,
  routes: {cors: true}
}

if (process.env.TLS_CERT_PATH && process.env.TLS_KEY_PATH) {
  serverOptions.tls = {
    key: fs.readFileSync(process.env.TLS_KEY_PATH),
    cert: fs.readFileSync(process.env.TLS_CERT_PATH)
  }
}

server.connection(serverOptions)

const KBClient = require('./clients/knowledge-base-client')

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
  require('h2o2'),
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
  {
    register: require('./services/clients'),
    options: {
      knowledgeBaseClient: new KBClient({
        url: `http://${process.env.KNOWLEDGE_BASE_URL}`,
        logger: message => {server.log(['clients', 'kb'], message)}
      })
    }
  },
  require('./services/documentation'),
  {
    register: require('./services/aws'),
    options: {
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      sqsUrl: process.env.AWS_SQS_URL,
      sqsPort: process.env.AWS_SQS_PORT
    }
  }
], err => {
  if (err) throw err

  server.register([
    {
      register: require('./services/emailer'),
      options: {
        queueName: process.env.EMAILER_QUEUE
      }
    }
  ], err => {
    if (err) throw err

    server.register([
      {
        register: require('./services/authentication'),
        options: {
          key: 'MySecret',
          sessionLength: '10h',
          hashSaltRounds: 10,
          invitationExpiryHours: 24,
          insideUrl: process.env.INSIDE_URL
        }
      },
      require('./features/verification'),
      require('./features/dashboard'),
      {
        register: require('./features/uploads'),
        options: {
          url: process.env.KNOWLEDGE_BASE_URL
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
})
