const chai = require('chai')
global.should = chai.should()
chai.use(require('chai-as-promised'))
process.setMaxListeners(0)
