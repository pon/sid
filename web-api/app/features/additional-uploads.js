const Boom    = require('boom')
const fs      = require('fs')
const moment  = require('moment')
const P       = require('bluebird')

exports.register = (server, options, next) => {

  const KBClient = server.plugins.clients.KnowledgeBaseClient
  const User     = server.plugins.db.models.User

  server.route([{
    method: 'POST',
    path: '/additional-uploads',
    config: {
      tags: ['api'],
      payload: {
        output: 'file',
        allow: 'multipart/form-data',
        parse: true
      },
      handler: (request, reply) => {
        if (!Array.isArray(request.payload.files)) {
          request.payload.files = [request.payload.files]
          request.payload.categories = [request.payload.categories]
        }

        return P.map(request.payload.files, (file, idx) => {
          return KBClient.createUpload(request.auth.credentials.id, file, request.payload.categories[idx])
          .tap(() => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path)
            }
          })
        })
        .then(uploads => {
          return KBClient.applicationAttachUploads(request.payload.application_id, uploads.map(upload => upload.id))
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.additionalUploads,
        options: {stripUnknown: true}
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'additional-upload',
  version: '1.0.0'
}
