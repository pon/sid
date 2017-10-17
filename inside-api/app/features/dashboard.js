const P = require('bluebird')

exports.register = (server, options, next) => {
  const Events = options.events

  const KBClient = server.plugins.clients.KnowledgeBaseClient

  server.route([{
    method: 'GET',
    path: '/dashboard/application-statistics',
    config: {
      tags: ['api', 'dashboard'],
      handler: (request, reply) => {
        KBClient.getApplicationsCountByStatus().asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'dashboard',
  version: '1.0.0'
}
