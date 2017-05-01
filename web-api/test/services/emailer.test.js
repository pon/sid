const Hapi = require('hapi')
const P = require('bluebird')
const sinon = require('sinon')

describe('emailer service', () => {
  let server

  beforeEach(done => {
    server = new Hapi.Server()
    server.connection()
    server.register({
      register: require('../../app/services/aws'),
      options: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        sqsUrl: process.env.AWS_SQS_URL,
        sqsPort: process.env.AWS_SQS_PORT
      }
    }, err => {
      if (err) {
        return done(err)
      }
      server.register({
        register: require('../../app/services/emailer'),
        options: {
          queueName: process.env.EMAILER_QUEUE
        }
      }, done)
    })
  })

  afterEach(() => {
    return server.stop()
  })

  describe('password reset', () => {
    it('should enqueue the correct message', () => {
      const awsMock = sinon.mock(server.plugins.aws)
      awsMock.expects('enqueueMessage').once().withArgs(process.env.EMAILER_QUEUE, {
        to: 'john@example.com',
        template: 'password-reset',
        data: {
          firstName: 'John',
          resetToken: 'token'
        }
      })
      .returns(P.resolve())

      return server.plugins.emailer.sendPasswordReset('john@example.com', {
        firstName: 'John',
        resetToken: 'token'
      })
      .then(() => {
        awsMock.verify()
      })
      .finally(() => {
        awsMock.restore()
      })
    })

    it('should throw an error if invalid parameters are provided', () => {
      return server.plugins.emailer.sendPasswordReset('john@example.com', {})
        .should.be.rejected
    })
  })

  describe('email verification', () => {
    it('should enqueue the correct message', () => {
      const awsMock = sinon.mock(server.plugins.aws)
      awsMock.expects('enqueueMessage').once().withArgs(process.env.EMAILER_QUEUE, {
        to: 'john@example.com',
        template: 'email-verification',
        data: {
          firstName: 'John',
          verificationToken: 'token'
        }
      })
      .returns(P.resolve())

      return server.plugins.emailer.sendEmailVerification('john@example.com', {
        firstName: 'John',
        verificationToken: 'token'
      })
      .then(() => {
        awsMock.verify()
      })
      .finally(() => {
        awsMock.restore()
      })
    })

    it('should throw an error if invalid parameters are provided', () => {
      return server.plugins.emailer.sendEmailVerification('john@example.com', {})
        .should.be.rejected
    })
  })
})
