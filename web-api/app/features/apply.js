const Boom  = require('boom')
const P     = require('bluebird')

exports.register = (server, options, next) => {

  const KBClient = server.plugins.clients.KnowledgeBaseClient
  const User     = server.plugins.db.models.User

  server.route([{
    method: 'POST',
    path: '/apply/step-one',
    config: {
      tags: ['api'],
      auth: false,
      handler: (request, reply) => {
        let registerPayload
        return P.resolve(server.inject({
          method: 'POST',
          url: '/register',
          payload: {
            email: request.payload.email,
            password: request.payload.password
          }
        }))
        .then(res => {
          res.payload = JSON.parse(res.payload)
          return res
        })
        .then(res => {
          if (res.statusCode === 200) {
            return res.payload
          } else if (res.statusCode === 400) {
            throw Boom.badRequest(res.payload.message)
          } else {
            throw Boom.internalServer()
          }
        })
        .then(payload => {
          registerPayload = payload

          return KBClient.createProfile({
            user_id: registerPayload.user_id,
            first_name: request.payload.first_name,
            last_name: request.payload.last_name
          })
        })
        .then(() => {
          return registerPayload
        })
        .asCallback(reply)

      },
      validate: {
        payload: server.plugins.schemas.applyStepOne,
        options: {stripUnknown: true}
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'apply',
  version: '1.0.0'
}
