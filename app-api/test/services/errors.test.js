const Hapi = require('hapi')

describe('errors plugin', () => {
  it('should expose an object containing errors', () => {
    const server = new Hapi.Server()
    server.connection()

    return server.register([
      require('../../app/services/errors')
    ])
    .then(() => {
      should.equal(typeof server.plugins.errors, 'object')
    })
  })
})
