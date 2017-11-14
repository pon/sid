'use strict'

const requireDirectory = require('require-directory')
const events = requireDirectory(module)
const eventsExport = {}

for (let key in events) {
  const evt = events[key]
  for (let k in evt) {
    console.log(k)
  }
  eventsExport[key.type] = evt
}

module.exports = eventsExport
