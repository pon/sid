const P = require('bluebird')

exports.register = (server, options, next) => {
  const KBClient = server.plugins.clients.KnowledgeBaseClient

  server.route([{
    method: 'GET',
    path: '/uploads/{uploadId}/view',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        return reply.proxy(({host: 'knowledge_base', port: '5000', protocol: 'http'}))
      },
      validate: {params: {uploadId: server.plugins.schemas.guid}}
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'uploads',
  version: '1.0.0'
}
