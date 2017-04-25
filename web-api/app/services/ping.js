exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/ping',
    handler: (request, reply) => {
      return reply({
        name: options.name,
        version: options.version,
        pong: new Date().toISOString(),
        memMB: (process.memoryUsage().rss / (1024 * 1024)).toFixed(2)
      })
    }
  })

  next()
}

exports.register.attributes = {
  name: 'status',
  version: '1.0.0'
}
