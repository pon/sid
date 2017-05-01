const Hapi = require('hapi')
const P = require('bluebird')
const sinon = require('sinon')
const utils = require('../test-utils')

describe('authentication plugin', () => {
  it('should error if options do not adhere to schema', () => {
    const server = new Hapi.Server()
    server.connection()

    return server.register([
      require('../../app/services/authentication')
    ]).should.be.rejected
  })

  describe('successfull plugin registration', () => {
    let server

    beforeEach(done => {
      server = new Hapi.Server()
      server.connection()

      utils.truncateAllTables()
      .then(() => {
        server.register([
          {
            register: require('../../app/services/db'),
            options: {
              config: {
                database: process.env.DATABASE_DATABASE,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                dialect: 'postgres'
              },
              models: require('../../app/models')
            }
          },
          require('../../app/services/errors'),
          require('../../app/services/schemas'),
          {
            register: require('../../app/services/emailer'),
            options: {
              queueName: process.env.EMAILER_QUEUE
            }
          }
        ], err => {
          if (err) {
            return done(err)
          }
          server.register([{
            register: require('../../app/services/authentication'),
            options: {
              key: 'MySecret',
              sessionLength: '10h',
              hashSaltRounds: 10,
              passwordResetExpiryHours: 24,
              emailVerificationExpiryHours: 24
            }
          }], err => {
            if (err) {
              return done(err)
            }
            server.route({
              method: 'GET',
              path: '/authed',
              handler: (request, reply) => reply('authed!')
            })
            done()
          })
        })
      })
    })

    it('should not validate if user does not exist', done => {
      server.plugins.authentication.validate({id: '1'}, {}, (err, validated) => {
        should.equal(err, null)
        validated.should.equal(false)
        done()
      })
    })

    it('should successfully register a new user and log them in', () => {
      const emailerMock = sinon.mock(server.plugins.emailer)
      emailerMock.expects('sendEmailVerification').once().withArgs('john@example.com', {
        verificationToken: sinon.match.string,
        firstName: 'John'
      })
      .returns(P.resolve())

      return server.inject({
        method: 'POST',
        url: '/register',
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password'
        }
      })
      .then(res => {
        res.statusCode.should.equal(201)
        return server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            email: 'john@example.com',
            password: 'password'
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(200)
        return server.inject({
          method: 'GET',
          url: '/authed',
          headers: {
            'Authorization': res.result.token
          }
        })
        .then(res => {
          res.statusCode.should.equal(200)
          res.result.should.equal('authed!')
        })
      })
    })

    it('should allow password reset and change', () => {
      const emailerMock = sinon.mock(server.plugins.emailer)
      emailerMock.expects('sendPasswordReset').once().withArgs('john@example.com', {
        resetToken: sinon.match.string,
        firstName: 'John'
      })
      .returns(P.resolve())

      emailerMock.expects('sendEmailVerification').once().withArgs('john@example.com', {
        verificationToken: sinon.match.string,
        firstName: 'John'
      })
      .returns(P.resolve())

      return P.resolve(server.inject({
        method: 'POST',
        url: '/register',
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password'
        }
      }))
      .then(res => {
        res.statusCode.should.equal(201)
        return server.inject({
          method: 'POST',
          url: '/password-reset',
          payload: {
            email: 'john@example.com'
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(201)
        return server.plugins.db.models.PasswordReset.findOne()
      })
      .then(reset => {
        return server.inject({
          method: 'POST',
          url: '/change-password',
          payload: {
            token: reset.token,
            new_password: 'newpassword',
            new_password_confirmation: 'newpassword'
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(200)
        return server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            email: 'john@example.com',
            password: 'newpassword'
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(200)
        emailerMock.verify()
      })
      .finally(() => {
        emailerMock.restore()
      })
    })

    it('error on reset request if email does not exist', () => {
      return server.inject({
        method: 'POST',
        url: '/password-reset',
        payload: {
          email: 'bad@example.com'
        }
      })
      .then(res => {
        res.statusCode.should.equal(404)
      })
    })

    it('error on change password if token does not exist', () => {
      return server.inject({
        method: 'POST',
        url: '/change-password',
        payload: {
          token: 'bad',
          new_password: 'password',
          new_password_confirmation: 'password'
        }
      })
      .then(res => {
        res.statusCode.should.equal(400)
      })
    })

    it('should return an error if email already registered', () => {
      return server.inject({
        method: 'POST',
        url: '/register',
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password'
        }
      })
      .then(res => {
        return server.inject({
          method: 'POST',
          url: '/register',
          payload: {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            password: 'password'
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(400)
      })
    })

    it('should return an error if email does not exist', () => {
      return server.inject({
        method: 'POST',
        url: '/register',
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password'
        }
      })
      .then(res => {
        return server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            email: 'wrong@example.com',
            password: 'password'
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(404)
      })
    })

    it('should return an error if password is wrong', () => {
      return server.inject({
        method: 'POST',
        url: '/register',
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password'
        }
      })
      .then(res => {
        return server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            email: 'john@example.com',
            password: 'wrongpassword'
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(400)
      })
    })

    it('should resend an email verification', () => {
      const emailerMock = sinon.mock(server.plugins.emailer)
      emailerMock.expects('sendEmailVerification').twice().withArgs('john@example.com', {
        firstName: 'John',
        verificationToken: sinon.match.string
      })
      .returns(P.resolve())

      return P.resolve(server.inject({
        method: 'POST',
        url: '/register',
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password'
        }
      }))
      .then(res => {
        return server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            email: 'john@example.com',
            password: 'password'
          }
        })
      })
      .then(res => {
        return server.inject({
          method: 'POST',
          url: '/resend-email-verification',
          headers: {
            Authorization: res.result.token
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(201)
        emailerMock.verify()
      })
      .finally(() => {
        emailerMock.restore()
      })
    })

    it('should error if trying to resend verification for verified user', () => {
      return server.inject({
        method: 'POST',
        url: '/resend-email-verification',
        credentials: {
          id: '1',
          email: 'john@example.com',
          first_name: 'John',
          verified: true
        }
      })
      .then(res => {
        res.statusCode.should.equal(400)
      })
    })

    it('should verify a user when email verification endpoint is hit', () => {
      let user
      return server.plugins.db.models.User.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password'
      })
      .then(_user => {
        user = _user
        const now = new Date()
        return server.plugins.db.models.EmailVerification.create({
          user_id: user.id,
          token: 'token',
          expires_at: now.setHours(now.getHours() + 1)
        })
      })
      .then(verification => {
        return server.inject({
          method: 'POST',
          url: '/verify-email',
          payload: {
            token: 'token'
          }
        })
      })
      .then(res => {
        res.statusCode.should.equal(200)
        return user.reload()
      })
      .then(updatedUser => {
        updatedUser.verified.should.equal(true)
      })
    })

    it('should return an error if the token does not exist', () => {
      return server.inject({
        method: 'POST',
        url: '/verify-email',
        payload: {
          token: 'token'
        }
      })
      .then(res => {
        res.statusCode.should.equal(400)
      })
    })
  })
})
