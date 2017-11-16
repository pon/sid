exports.register = (server, options, next) => {
  server.expose({
    KnowledgeBaseClient: options.knowledgeBaseClient,
    AppApiClient: options.appApiClient
  })
  next()
}

exports.register.attributes = {
  name: 'clients',
  version: '1.0.0'
}
