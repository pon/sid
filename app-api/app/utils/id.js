const crypto = require('crypto')

module.exports = prefix => {
  return `${prefix}_${crypto.randomBytes(12).toString('hex')}`
}
