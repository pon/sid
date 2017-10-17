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
      invitationExpiryHours: Joi.number().integer().required().min(1),
      insideUrl: Joi.string().required()
    })

    const optionsResult = Joi.validate(options, optionsSchema)
    if (optionsResult.error) {
      return next(optionsResult.error)
    }

    const Invitation = server.plugins.db.models.Invitation
    const User = server.plugins.db.models.User
    const validate = (decoded, request, cb) => {
      User.findOne({
        where: {
          id: decoded.id,
          verified: true
        }
      })
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
          return User.findOne({
            where: {
              email: request.payload.email,
              verified: true
            }
          })
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
      method: 'GET',
      path: '/invite-status',
      config: {
        auth: false,
        tags: ['api', 'authentication'],
        handler: (request, reply) => {
          Invitation.findOne({
            where: {token: request.query.token},
            include: [User]
          })
          .then(invite => {
            if (!invite) {
              return {status: 'INVALID'}
            } else if (invite.expires_at < new Date()) {
              return {status: 'EXPIRED'}
            } else if (invite.user.verified) {
              return {status: 'ACCEPTED'}
            } else {
              return {status: 'VALID'}
            }
          })
          .asCallback(reply)
        }
      }
    }, {
      method: 'POST',
      path: '/invite',
      config: {
        auth: false,
        tags: ['api', 'authentication'],
        handler: (request, reply) => {
          User.findOne({where: {email: request.payload.email}})
          .then(user => {
            if (user && user.verified) {
              throw server.plugins.errors.emailAlreadyExists
            } else if (request.payload.email.substring(request.payload.email.length - 9) !== 'poplar.co') {
              throw server.plugins.errors.invalidEmailForInvite
            } else if (!user) {
              return User.create({
                email: request.payload.email
              })
            }

            return user
          })
          .then(user => {
            const now = new Date()
            return Invitation.create({
              user_id: user.id,
              token: crypto.randomBytes(24).toString('hex'),
              expires_at: now.setHours(now.getHours() + options.invitationExpiryHours)
            })
          })
          .then(invitation => {
            return server.plugins.emailer.sendInvitation(request.payload.email, {
              invitationUrl: `${options.insideUrl}/accept-invite/${invitation.token}`
            })
          })
          .then(() => {
            return
          })
          .asCallback(reply)
        },
        validate: {
          payload: {
            email: server.plugins.schemas.email
          }
        }
      }
    }, {
      method: 'POST',
      path: '/accept-invite',
      config: {
        auth: false,
        tags: ['api', 'authentication'],
        handler: (request, reply) => {
          Invitation.findOne({
            where: {
              token: request.payload.token,
              expires_at: {$gte: new Date()}
            },
            include: [User]
          })
          .then(invitation => {
            if (!invitation) {
              throw server.plugins.errors.invalidInvitationToken
            }

            return P.all([
              Bcrypt.hash(request.payload.password, options.hashSaltRounds),
              invitation
            ])
          })
          .spread((hash, invitation) => {
            return invitation.user.update({
              verified: true,
              verified_at: new Date(),
              password: hash
            })
          })
          .then(user => {
            return {
              user_id: user.id,
              token: Jwt.sign({
                id: user.id
              }, options.key, {
                expiresIn: options.sessionLength
              })
            }
          })
          .asCallback(reply)
        },
        validate: {
          payload: {
            token: server.plugins.schemas.invitationCode,
            password: server.plugins.schemas.password
          }
        }
      }
    }, {
      method: 'GET',
      path: '/invited-users',
      config: {
        tags: ['api', 'authentication'],
        handler: (request, reply) => {
          User.findAll({include: [{model: Invitation, order: [['created_at', 'DESC']]}]})
          .map(user => user.serialize())
          .asCallback(reply)
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
