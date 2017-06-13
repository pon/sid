const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const CreditReport  = server.plugins.db.models.CreditReport
  const Event         = server.plugins.db.models.Event

  server.route([{
    method: 'GET',
    path: '/credit-reports/{creditReportId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Event.findAll({
          where: {aggregate_id: request.params.creditReportId},
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
            url: `/credit-reports/${request.params.creditReportId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/credit-reports',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          const creditReport = CreditReport.build()
          request.payload.id = creditReport.id
          console.log(request.payload)

          const CreditReportCreatedEvent = new Events.CREDIT_REPORT_CREATED(request.payload)

          return creditReport.process(CreditReportCreatedEvent.type, CreditReportCreatedEvent.toJSON())
          .then(() => {
            server.emit('KB', CreditReportCreatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.creditReportCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'GET',
    path: '/credit-reports/{creditReportId}',
    config: {
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return CreditReport.findOne({where: {id: request.params.creditReportId, deleted_at: null}})
            .then(creditReport => {
              if (!creditReport) throw server.plugins.errors.creditReportNotFound
              return creditReport
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.creditReportId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.creditReportNotFound
            const creditReport = CreditReport.build()
            events.forEach(event => {
              creditReport.process(event.type, event.payload, true)
            })

            return creditReport
          })
        })
        .then(creditReport => {
          return {
            id: creditReport.id,
            fico_score: creditReport.fico_score,
            provider: creditReport.provider
          }
        })
        .asCallback(reply)
      },
      validate: {query: server.plugins.schemas.asOfQuery}
    }
  }, {
    method: 'DELETE',
    path: '/credit-reports/{creditReportId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return CreditReport.findOne({where: {id: request.params.creditReportId, deleted_at: null}})
        .then(creditReport => {
          if (!creditReport) throw server.plugins.errors.creditReportNotFound

          const CreditReportDeletedEvent = new Events.CREDIT_REPORT_DELETED(request.params.creditReportId)
          return creditReport.process(CreditReportDeletedEvent.type, CreditReportDeletedEvent.toJSON())
          .then(() => {
            server.emit('KB', CreditReportDeletedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/credit-reports/{creditReportId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return CreditReport.findOne({
          where: {
            id: request.params.creditReportId,
            deleted_at: {$ne: null}
          }
        })
        .then(creditReport => {
          if (!creditReport) throw server.plugins.errors.creditReportNotFound

          const CreditReportRestoredEvent = new Events.CREDIT_REPORT_RESTORED(request.params.creditReportId)

          return creditReport.process(CreditReportRestoredEvent.type, CreditReportRestoredEvent.toJSON())
          .then(() => {
            server.emit('KB', CreditReportRestoredEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'credit-reports',
  version: '1.0.0'
}
