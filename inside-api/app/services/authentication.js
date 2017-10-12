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
      hashSaltRounds: Joi.number().integer().required().min(1)
    })

    const optionsResult = Joi.validate(options, optionsSchema)
    if (optionsResult.error) {
      return next(optionsResult.error)
    }

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
    }])

    next()
  })
}

exports.register.attributes = {
  name: 'authentication',
  version: '1.0.0'
}
