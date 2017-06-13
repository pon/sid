const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Event     = server.plugins.db.models.Event
  const Upload    = server.plugins.db.models.Upload

  const {getFile, uploadFile} = server.plugins.aws

  server.route([{
    method: 'GET',
    path: '/uploads/{uploadId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Event.findAll({
          where: {aggregate_id: request.params.uploadId},
          order: [['id', 'ASC']]
        })
        .map(event => {
          const as_of = event.created_at.getTime()
          return {
            id: event.id,
            type: event.type,
            meta_data: event.meta_data,
            payload: event.payload,
            created_at: event.created_at,
            url: `/uploads/${request.params.uploadId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/uploads',
    config: {
      tags: ['api'],
      payload: {
        output: 'stream',
        allow: 'multipart/form-data'
      },
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          const upload = Upload.build()

          const contentType = request.payload.file.hapi.headers['content-type']
          const filePath = `${request.payload.user_id}/${upload.id}`

          const uploadParams = {
            bucket: options.bucket,
            content_type: contentType,
            path: filePath,
            file: request.payload.file
          }

          return uploadFile(uploadParams)
          .then(() => {
            const UploadCreatedEvent = new Events.UPLOAD_CREATED({
              id: upload.id,
              user_id: request.payload.user_id,
              file_name: request.payload.file.hapi.filename,
              bucket_name: options.bucket,
              path: filePath,
              content_type: contentType
            })

            return upload.process(UploadCreatedEvent.type, UploadCreatedEvent.toJSON())
            .then(() => {
              server.emit('KB', UploadCreatedEvent)
            })
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.uploadCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'GET',
    path: '/uploads/{uploadId}',
    config: {
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return Upload.findOne({where: {id: request.params.uploadId, deleted_at: null}})
            .then(upload => {
              if (!upload) throw server.plugins.errors.uploadNotFound
              return upload
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.uploadId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.uploadNotFound
            const upload = Upload.build()
            events.forEach(event => {
              upload.process(event.type, event.payload, true)
            })

            return upload
          })
        })
        .then(upload => {
          return getFile({
            bucket: upload.bucket_name,
            path: upload.path
          })
          .then(res => {
            reply(res.Body)
              .header('Content-Type', res.ContentType)
              .header('content-disposition', `attachment; filename=${upload.file_name};`)
          })
        })
        .catch(reply)
      },
      validate: {query: server.plugins.schemas.asOfQuery}
    }
  }, {
    method: 'GET',
    path: '/users/{userId}/uploads',
    config: {
      handler: (request, reply) => {
        return Upload.findAll({where: {user_id: request.params.userId, deleted_at: null}})
        .map(upload => {
          return {
            id: upload.id,
            file_name: upload.file_name,
            content_type: upload.content_type,
            url: `/uploads/${upload.id}`,
            created_at: upload.created_at
          }
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'DELETE',
    path: '/uploads/{uploadId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Upload.findOne({where: {id: request.params.uploadId, deleted_at: null}})
        .then(upload => {
          if (!upload) throw server.plugins.errors.uploadNotFound

          const UploadDeletedEvent = new Events.UPLOAD_DELETED(request.params.uploadId)
          return upload.process(UploadDeletedEvent.type, UploadDeletedEvent.toJSON())
          .then(() => {
            server.emit('KB', UploadDeletedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/uploads/{uploadId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Upload.findOne({
          where: {
            id: request.params.uploadId,
            deleted_at: {$ne: null}
          }
        })
        .then(upload => {
          if (!upload) throw server.plugins.errors.uploadNotFound

          const UploadRestoredEvent = new Events.UPLOAD_RESTORED(request.params.uploadId)

          return upload.process(UploadRestoredEvent.type, UploadRestoredEvent.toJSON())
          .then(() => {
            server.emit('KB', UploadRestoredEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'uploads',
  version: '1.0.0'
}
