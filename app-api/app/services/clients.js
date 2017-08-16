exports.register = (server, options, next) => {
  server.expose({
    KnowledgeBaseClient: options.knowledgeBaseClient
  })
  next()
}

exports.register.attributes = {
  name: 'clients',
  version: '1.0.0'
}
