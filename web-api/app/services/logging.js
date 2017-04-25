exports.register = (server, options, next) => {
  server.ext('onPreResponse', (request, reply) => {
    request.log(request.response.isBoom ? ['error'] : [], {
      statusCode: request.response.isBoom ?
        request.response.output.statusCode : request.response.statusCode,
      body: request.response.isBoom ?
        request.response.output.payload : '[FILTERED]',
      query: request.response.isBoom ? request.query : '[FILTERED]',
      payload: request.response.isBoom ? request.payload : '[FILTERED]'
    })

    reply.continue()
  })

  server.register({
    register: require('hapi-bunyan'),
    options: {logger: options.logger, includeTags: true}
  }, next)
}

exports.register.attributes = {
  name: 'logging',
  version: '1.0.0'
}
