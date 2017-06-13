const P = require('bluebird')

exports.register = (server, options, next) => {
  const AWS = require('aws-sdk')

  AWS.config.update({
    accessKeyId: options.accessKey,
    secretAccessKey: options.secretKey,
    region: options.region
  })

  const s3Options = {}
  if (options.fakeS3Url) {
    s3Options.s3ForcePathStyle = true
    s3Options.endpoint = new AWS.Endpoint(`http://${options.fakeS3Url}:${options.fakeS3Port}`)
  }

  const S3 = new AWS.S3(s3Options)

  const uploadFile = data => {
    const params = {
      ACL: 'private',
      Bucket: data.bucket,
      ContentType: data.content_type,
      Key: data.path,
      Body: data.file
    }

    return new P((resolve, reject) => {
      S3.upload(params, (err, res) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  const getFile = data => {
    return new P((resolve, reject) => {
      return S3.getObject({
        Bucket: data.bucket,
        Key: data.path
      }, (err, res) => {
        if (err) return reject(err)

        return resolve(res)
      })
    })
  }

  server.expose({
    AWS: AWS,
    S3: S3,
    uploadFile: uploadFile,
    getFile: getFile
  })

  next()
}

exports.register.attributes = {
  name: 'aws',
  version: '1.0.0'
}
