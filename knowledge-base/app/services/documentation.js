exports.register = (server, options, next) => {
  server.register([
    require('vision'),
    require('inert'),
    {
      register: require('hapi-swagger'),
      options: {
        info: {title: 'Knowledge Base API'}
      }
    }
  ], next)
}

exports.register.attributes = {
  name: 'documentation',
  version: '1.0.0'
}
