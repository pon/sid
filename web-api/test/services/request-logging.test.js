const Hapi = require('hapi')

let server

describe('logging plugin', () => {
  beforeEach(done => {
    server = new Hapi.Server({debug: false})
    server.connection()

    server.register([
      require('../../app/services/request-logging')
    ], err => {
      if (err) done(err)
      server.route([{
        method: 'GET',
        path: '/test',
        config: {
          log: false,
          handler: (request, reply) => reply('content')
        }
      }, {
        method: 'POST',
        path: '/boom',
        config: {
          log: false,
          handler: (request, reply) => reply(new Error())
        }
      }])

      done()
    })
  })

  afterEach(done => server.stop(done))

  it('should log a basic GET', done => {
    server.on('request', (req, evt, tags) => {
      evt.data.should.deep.equal({
        statusCode: 200,
        body: '[FILTERED]',
        query: '[FILTERED]',
        payload: '[FILTERED]'
      })
      done()
    })

    server.inject('/test')
  })

  it('should log an error with query and payload', done => {
    server.on('request', (req, evt, tags) => {
      evt.data.should.deep.equal({
        statusCode: 500,
        body: {
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'An internal server error occurred'
        },
        query: {key1: 'value1'},
        payload: {key2: 'value2'}
      })
      done()
    })

    server.inject({
      method: 'POST',
      url: '/boom?key1=value1',
      payload: {key2: 'value2'}
    })
  })
})
