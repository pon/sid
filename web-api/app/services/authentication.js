const Bcrypt = require('bcrypt')
const crypto = require('crypto')
const P = require('bluebird')
const Joi = require('joi')
const Jwt = require('jsonwebtoken')

exports.register = (server, options, next) => {
  server.register([{
    register: require('hapi-auth-jwt2'),
    options: {}
  }], err => {
    /* istanbul ignore next */
    if (err) next(err)

    const optionsSchema = Joi.object().keys({
      key: Joi.string().required(),
      sessionLength: Joi.string().required(),
      hashSaltRounds: Joi.number().integer().required().min(1),
      passwordResetExpiryHours: Joi.number().integer().required().min(1)
    })

    const optionsResult = Joi.validate(options, optionsSchema)
    if (optionsResult.error) {
      return next(optionsResult.error)
    }

    const PasswordReset = server.plugins.db.models.PasswordReset
    const User = server.plugins.db.models.User
    const validate = (decoded, request, cb) => {
      User.findById(decoded.id)
      .then(user => {
        if (!user) {
          return cb(null, false)
        }

        return cb(null, true, user)
      })
      .catch(cb)
    }

    server.expose({validate: validate})

    server.auth.strategy('jwt', 'jwt', {
      key: options.key,
      validateFunc: validate,
      verifyOptions: {algorithms: ['HS256']}
    })

    server.auth.default('jwt')

    server.route([{
      method: 'POST',
      path: '/login',
      config: {
        auth: false,
        tags: ['api', 'authentication'],
        handler: (request, reply) => {
          return User.findOne({where: {email: request.payload.email}})
          .then(user => {
            if (!user) {
              throw server.plugins.errors.userNotFound
            } else if (Bcrypt.compareSync(request.payload.password, user.password)) {
              return {
                token: Jwt.sign({
                  id: user.id
                }, options.key, {
                  expiresIn: options.sessionLength
                })
              }
            } else {
              return server.plugins.errors.userInvalidPassword
            }
          })
          .asCallback(reply)
        },
        validate: {
          payload: {
            email: server.plugins.schemas.email,
            password: server.plugins.schemas.password
          }
        }
      }
    }, {
      method: 'POST',
      path: '/register',
      config: {
        auth: false,
        tags: ['api', 'authentication'],
        handler: (request, reply) => {
          return User.findOne({where: {email: request.payload.email}})
          .then(user => {
            if (user) {
              throw server.plugins.errors.emailAlreadyExists
            } else {
              return Bcrypt.hash(request.payload.password, options.hashSaltRounds)
            }
          })
          .then(hash => {
            return User.create({
              first_name: request.payload.first_name,
              last_name: request.payload.last_name,
              email: request.payload.email,
              password: hash
            })
          })
          .then(() => {
            return reply().code(201)
          })
          .catch(reply)
        },
        validate: {
          payload: {
            first_name: server.plugins.schemas.firstName,
            last_name: server.plugins.schemas.lastName,
            email: server.plugins.schemas.email,
            password: server.plugins.schemas.password
          }
        }
      }
    }, {
      method: 'POST',
      path: '/password-reset',
      config: {
        auth: false,
        tags: ['api'],
        handler: (request, reply) => {
          return User.findOne({where: {email: request.payload.email}})
          .then(user => {
            if (!user) {
              throw server.plugins.errors.userNotFound
            } else {
              const now = new Date()
              return PasswordReset.create({
                user_id: user.id,
                token: crypto.randomBytes(12).toString('hex'),
                expires_at: now.setHours(now.getHours() + options.passwordResetExpiryHours)
              })
              // TODO: Gotta send an email here
            }
          })
          .then(() => {
            return reply().code(201)
          })
          .catch(reply)
        },
        validate: {
          payload: {
            email: server.plugins.schemas.email
          }
        }
      }
    }, {
      method: 'POST',
      path: '/change-password',
      config: {
        auth: false,
        tags: ['api', 'authentication'],
        handler: (request, reply) => {
          return PasswordReset.findOne({
            where: {
              token: request.payload.token,
              expires_at: {$gte: new Date()}
            },
            include: [User]
          })
          .then(reset => {
            if (!reset) {
              throw server.plugins.errors.invalidPasswordToken
            }

            return P.all([
              Bcrypt.hash(request.payload.new_password, options.hashSaltRounds),
              P.resolve(reset)
            ])
          })
          .spread((hash, reset) => {
            return reset.user.update({
              password: hash
            })
          })
          .then(() => {
            return reply()
          })
          .catch(reply)
        },
        validate: {
          payload: {
            token: server.plugins.schemas.passwordResetToken,
            new_password: server.plugins.schemas.password,
            new_password_confirmation:
              server.plugins.schemas.password.valid(Joi.ref('new_password'))
          }
        }
      }
    }])

    next()
  })
}

exports.register.attributes = {
  name: 'authentication',
  version: '1.0.0'
}
