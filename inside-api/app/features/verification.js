const P = require('bluebird')

exports.register = (server, options, next) => {
  const Events = options.events

  const KBClient = server.plugins.clients.KnowledgeBaseClient

  server.route([{
    method: 'GET',
    path: '/verification/applications',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        const query = request.query || {}
        query.status = 'VERIFYING'

        KBClient.getApplications(query)
        .asCallback(reply)
      },
      validate: {
        query: server.plugins.schemas.paginatedQuery
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'verification',
  version: '1.0.0'
}
