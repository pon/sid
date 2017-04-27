const Bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')

exports.register = (server, options, next) => {
  server.register([{
    register: require('hapi-auth-jwt2'),
    options: {}
  }], err => {
    /* istanbul ignore next */
    if (err) next(err)
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
        handler: (request, reply) => {
          return User.findOne({email: request.payload.email})
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
    }])

    next()
  })
}

exports.register.attributes = {
  name: 'authentication',
  version: '1.0.0'
}
