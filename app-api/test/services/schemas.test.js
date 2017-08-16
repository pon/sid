const Hapi = require('hapi')

describe('schemas plugin', () => {
  it('should expose an object containing schemas', () => {
    const server = new Hapi.Server()
    server.connection()

    return server.register([
      require('../../app/services/schemas')
    ])
    .then(() => {
      should.equal(typeof server.plugins.schemas, 'object')
    })
  })
})
