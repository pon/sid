const Hapi = require('hapi')
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
          require('../../app/services/schemas')
        ], err => {
          if (err) done(err)
          server.register([{
            register: require('../../app/services/authentication'),
            options: {
              key: 'MySecret',
              sessionLength: '10h',
              hashSaltRounds: 10,
              passwordResetExpiryHours: 24
            }
          }], err => {
            if (err) done(err)
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
  })
})
