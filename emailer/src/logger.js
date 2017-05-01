const Bunyan = require('bunyan')

const logger = Bunyan.createLogger({name: 'emailer'})

module.exports = logger
