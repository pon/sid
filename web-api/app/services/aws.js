const P = require('bluebird')

exports.register = (server, options, next) => {
  const AWS = require('aws-sdk')

  AWS.config.update({
    accessKeyId: options.accessKey,
    secretAccessKey: options.secretKey,
    region: options.region
  })

  const sqsOptions = {}
  if (options.sqsUrl) {
    sqsOptions.endpoint = new AWS.Endpoint(`http://${options.sqsUrl}:${options.sqsPort}`)
  }

  const SQS = new AWS.SQS(sqsOptions)

  const generateQueueUrl = queueName => {
    return new P((resolve, reject) => {
      SQS.createQueue({
        QueueName: options.sqsQueueName
      }, (err, config) => {
        /* istanbul ignore next */
        if (err) {
          return reject(err)
        }

        /* istanbul ignore next */
        if (!options.sqsUrl) {
          return resolve(config.QueueUrl)
        }

        return resolve(config.QueueUrl.replace('0.0.0.0', options.sqsUrl))
      })
    })
  }

  const enqueueMessage = (body, attributes) => {
    return generateQueueUrl(options.sqsQueueName)
    .then(queueUrl => {
      const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(body)
      }

      if (attributes) {
        params.MessageAttributes = attributes
      }

      return new Promise((resolve, reject) => {
        SQS.sendMessage(params, (err, data) => {
          if (err) {
            return reject(err)
          }

          return resolve(data)
        })
      })
    })
  }

  server.expose({
    AWS: AWS,
    SQS: SQS,
    enqueueMessage: enqueueMessage
  })

  next()
}

exports.register.attributes = {
  name: 'aws',
  version: '1.0.0'
}
