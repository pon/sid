const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Employment = server.plugins.db.models.Employment
  const Event      = server.plugins.db.models.Event

  server.route([{
    method: 'GET',
    path: '/employments/{employmentId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return Employment.findOne({where: {id: request.params.employmentId, deleted_at: null}})
            .then(employment => {
              if (!employment) throw server.plugins.errors.employmentNotFound
                return employment
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.employmentId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.employmentNotFound
            const employment = Employment.build()
            events.forEach(event => {
              employment.process(event.type, event.payload, true)
            })

            return employment
          })
        })
        .asCallback(reply)
      },
      validate: {query: server.plugins.schemas.asOfQuery}
    }
  }, {
    method: 'GET',
    path: '/employments/{employmentId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Event.findAll({
          where: {aggregate_id: request.params.employmentId},
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
            url: `/employments/${request.params.employmentId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/employments',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        const employment = Employment.build()

        request.payload.id = employment.id

        const EmploymentCreatedEvent = new Events.EMPLOYMENT_CREATED(request.payload)

        return employment.process(EmploymentCreatedEvent.type, EmploymentCreatedEvent)
        .then(() => {
          server.emit('KB', EmploymentCreatedEvent)
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.employmentCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'PATCH',
    path: '/employments/{employmentId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Employment.findOne({where: {id: request.params.employmentId, deleted_at: null}})
        .then(employment => {
          if (!employment) throw server.plugins.errors.employmentNotFound

          const EmploymentUpdatedEvent = new Events.EMPLOYMENT_UPDATED(
            employment.id,
            request.payload
          )

          return employment.process(EmploymentUpdatedEvent.type, EmploymentUpdatedEvent.toJSON())
          .then(() => {
            server.emit('KB', EmploymentUpdatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.employmentUpdate
      }
    }
  }, {
    method: 'DELETE',
    path: '/employments/{employmentId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Employment.findOne({where: {id: request.params.employmentId, deleted_at: null}})
        .then(employment => {
          if (!employment) throw server.plugins.errors.employmentNotFound

          const EmploymentDeletedEvent = new Events.EMPLOYMENT_DELETED(request.params.employmentId)
          return employment.process(EmploymentDeletedEvent.type, EmploymentDeletedEvent.toJSON())
          .then(() => {
            server.emit('KB', EmploymentDeletedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/employments/{employmentId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Employment.findOne({
          where: {
            id: request.params.employmentId,
            deleted_at: {$ne: null}
          }
        })
        .then(employment => {
          if (!employment) throw server.plugins.errors.employmentNotFound

          const EmploymentRestoredEvent = new Events.EMPLOYMENT_RESTORED(
            request.params.employmentId
          )

          return employment.process(
            EmploymentRestoredEvent.type,
            EmploymentRestoredEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', EmploymentRestoredEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/employments/{employmentId}/verify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Employment.findOne({where: {id: request.params.employmentId, deleted_at: null}})
        .then(employment => {
          if (!employment) {
            throw server.plugins.errors.employmentNotFound
          } else if (employment.verified) {
            throw server.plugins.errors.employmentAlreadyVerified
          }

          const EmploymentVerifiedEvent = new Events.EMPLOYMENT_VERIFIED(
            employment.id,
            request.payload.verified_income
          )

          return employment.process(
            EmploymentVerifiedEvent.type,
            EmploymentVerifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', EmploymentVerifiedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.employmentVerify,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/employments/{employmentId}/unverify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Employment.findOne({where: {id: request.params.employmentId, deleted_at: null}})
        .then(employment => {
          if (!employment) {
            throw server.plugins.errors.employmentNotFound
          } else if (!employment.verified) {
            throw server.plugins.errors.employmentNotVerified
          }

          const EmploymentUnverifiedEvent = new Events.EMPLOYMENT_UNVERIFIED(
            request.params.employmentId
          )

          return employment.process(
            EmploymentUnverifiedEvent.type,
            EmploymentUnverifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', EmploymentUnverifiedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'employments',
  version: '1.0.0'
}
