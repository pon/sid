exports.register = (server, options, next) => {
  server.route([{
    method: 'GET',
    path: '/users/me',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        const {id, email} = request.auth.credentials
        reply({id, email})
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'profile',
  version: '1.0.0'
}
