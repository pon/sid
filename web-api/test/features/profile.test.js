const Hapi = require('hapi')

describe('profile plugin', () => {
  let server
  beforeEach(done => {
    server = new Hapi.Server()
    server.connection()

    server.register([
      require('../../app/features/profile')
    ], done)
  })

  it('should return properties off the profile if logged in', () => {
    return server.inject({
      method: 'GET',
      url: '/users/me',
      credentials: {
        id: '1',
        email: 'john@example.com'
      }
    })
    .then(res => {
      res.statusCode.should.equal(200)
      res.result.should.deep.equal({
        id: '1',
        email: 'john@example.com'
      })
    })
  })
})
