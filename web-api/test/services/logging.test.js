const Bunyan = require('bunyan')
const Hapi = require('hapi')

let server
const logger = Bunyan.createLogger({name: 'test', level: 'error'})

describe('logging plugin', () => {
  it('should successfully register the logging plugin', done => {
    server = new Hapi.Server({debug: false})
    server.connection()

    server.register([{
      register: require('../../app/services/logging'),
      options: {logger: logger}
    }], done)
  })
})
