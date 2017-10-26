const P = require('bluebird')

exports.register = (server, options, next) => {
  const KBClient = server.plugins.clients.KnowledgeBaseClient

  server.route([{
    method: 'GET',
    path: '/uploads/{uploadId}/view',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        const urlSplit = options.url.split(':')

        return reply.proxy(({
          host: urlSplit[0], 
          port: urlSplit.length !== 1 ? urlSplit[1] : '80', 
          protocol: 'http'
        }))
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
