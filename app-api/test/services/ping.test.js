const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection()

describe('ping endpoint', () => {
  before(done => {
    server.register([{
      register: require('../../app/services/ping'),
      options: {
        name: 'name',
        version: 'version'
      }
    }], done)
  })

  it('should return basic ping information', () => {
    return server.inject('/ping')
    .then(res => {
      res.statusCode.should.equal(200)
      res.result.should.have.property('name')
      res.result.should.have.property('version')
      res.result.should.have.property('pong')
      res.result.should.have.property('memMB')
    })
  })
})
