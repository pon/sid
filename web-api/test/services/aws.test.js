const Hapi = require('hapi')

describe('aws service', () => {
  let server

  beforeEach(() => {
    server = new Hapi.Server()
    server.connection()
  })

  afterEach(() => {
    return server.stop()
  })

  it('should register and expose AWS and SQS with url and port', () => {
    return server.register({
      register: require('../../app/services/aws'),
      options: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        sqsUrl: process.env.AWS_SQS_URL,
        sqsPort: process.env.AWS_SQS_PORT
      }
    })
    .then(() => {
      server.plugins.aws.should.have.property('AWS')
      server.plugins.aws.should.have.property('SQS')
      server.plugins.aws.should.have.property('enqueueMessage')
    })
  })

  it('should register and expose AWS and SQS without url and port', () => {
    return server.register({
      register: require('../../app/services/aws'),
      options: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      }
    })
    .then(() => {
      server.plugins.aws.should.have.property('AWS')
      server.plugins.aws.should.have.property('SQS')
      server.plugins.aws.should.have.property('enqueueMessage')
    })
  })

  it('should send a successful message in SQS', () => {
    return server.register({
      register: require('../../app/services/aws'),
      options: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        sqsUrl: process.env.AWS_SQS_URL,
        sqsPort: process.env.AWS_SQS_PORT
      }
    })
    .then(() => {
      return server.plugins.aws.enqueueMessage('queue', {key: 'value'}, {
        '<String>': {
          DataType: 'STRING_VALUE'
        }
      })
      .then(res => {
        res.should.have.property('ResponseMetadata')
      })
    })
  })

  it('should send a successful message in SQS', () => {
    return server.register({
      register: require('../../app/services/aws'),
      options: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        sqsUrl: process.env.AWS_SQS_URL,
        sqsPort: process.env.AWS_SQS_PORT
      }
    })
    .then(() => {
      return server.plugins.aws.enqueueMessage('queue', {key: 'value'})
      .then(res => {
        res.should.have.property('ResponseMetadata')
      })
    })
  })

  it('should reject with invalid enqueue', () => {
    return server.register({
      register: require('../../app/services/aws'),
      options: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        sqsUrl: process.env.AWS_SQS_URL,
        sqsPort: process.env.AWS_SQS_PORT
      }
    })
    .then(() => {
      return server.plugins.aws.enqueueMessage('queue')
        .should.be.rejectedWith(/Missing required key/)
    })
  })
})
