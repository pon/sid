const Emailer = require('./emailer')
const Logger  = require('./logger')
const P       = require('bluebird')
const PubSub  = require('@google-cloud/pubsub')({promise: P})

const handleMessage = (message, next) => {
  const body = JSON.parse(message.data.toString())
  Logger.info('message-received', {ackId: message.ackId, data: body})
  Emailer.sendMail(
    body.to,
    process.env.FROM_EMAIL,
    body.template,
    JSON.stringify(body.data),
    next
  )
}

const topic = PubSub.topic(process.env.TOPIC)
let subscription

return topic.exists()
.then(exists => exists[0])
.then(exists => {
  if (!exists) {
    return topic.create()
    .then(() => {
      return topic
    })
  }

  return topic
})
.then(topic => {
  subscription = topic.subscription(process.env.SUBSCRIPTION)
  return subscription.exists()
})
.then(exists => exists[0])
.then(exists => {
  if (!exists) {
    return subscription.create()
    .then(() => {
      return subscription
    })
  }

  return subscription
})
.then(subscription => {
  subscription.on('error', err => Logger.error('error', err))
  subscription.on('message', msg => handleMessage(msg, err => {
    if (err) {
      Logger.error('error', err)
      msg.ack()
    } else {
      Logger.info('message-sent', {ackId: msg.ackId})
      msg.ack()
    }
  }))
})
.catch(err => {
  Logger.error('error', err)
  process.exit(1)
})
