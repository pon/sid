const Consumer = require('sqs-consumer')
const Emailer = require('./emailer')
const Logger = require('./logger')
const AWS = require('aws-sdk')

const sqsOptions = {}
if (process.env.AWS_SQS_URL) {
  sqsOptions.endpoint = new AWS.Endpoint(
    `http://${process.env.AWS_SQS_URL}:${process.env.AWS_SQS_PORT}`
  )
}

const SQS = new AWS.SQS(sqsOptions)

SQS.createQueue({QueueName: process.env.AWS_SQS_QUEUE_NAME}, (err, config) => {
  if (err) throw err

  if (process.env.AWS_SQS_URL) {
    config.QueueUrl = config.QueueUrl.replace('0.0.0.0', process.env.AWS_SQS_URL)
  }

  const app = Consumer.create({
    queueUrl: config.QueueUrl,
    handleMessage: (message, done) => {
      const body = JSON.parse(message.Body)
      Emailer.sendMail(
        body.to,
        process.env.FROM_EMAIL,
        body.template,
        JSON.stringify(body.data),
        done
    )
    }
  })

  app.on('error', err => Logger.error('error', err))
  app.on('message_received', msg => Logger.info('message-received', msg))
  app.on('message_processed', msg => Logger.info('message-processed', msg))
  app.on('processing_error', (err, msg) => Logger.error('error', {message: msg, error: err}))
  app.on('stopped', () => Logger.info('stopped'))

  app.start()
  Logger.info('started')
})
