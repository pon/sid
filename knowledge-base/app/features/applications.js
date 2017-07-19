const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Application   = server.plugins.db.models.Application
  const CreditReport  = server.plugins.db.models.CreditReport
  const Income        = server.plugins.db.models.Income
  const Event         = server.plugins.db.models.Event
  const Lease         = server.plugins.db.models.Lease

  server.route([{
    method: 'GET',
    path: '/applications/{applicationId}',
    config:{
      tags: ['api'],
      handler: (request, reply) => {
        let application
        return P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return Application.findOne({
              where: {id: request.params.applicationId, deleted_at: null},
            })
            .then(_application => {
              if (!_application) throw server.plugins.errors.applicationNotFound

              application = _application
              return application.getIncomes()
              .then(incomes => {
                application.incomes = incomes
                return application
              })
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.applicationId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.applicationNotFound
            const application = Application.build()
            events.forEach(event => {
              application.process(event.type, event.payload, true)
            })

            return application
          })
        })
        .then(application => {
          application = application.toJSON()
          if (application.credit_report_id) {
            application.credit_report = `/credit-reports/${application.credit_report_id}`
            application.credit_report = application.credit_report +
              (request.query.as_of ? `?as_of=${request.query.as_of}` : '')
          }

          if (application.income_ids) {
            application.incomes = application.income_ids.map(incomeId => {
              let income =  `/incomes/${incomeId}`
              income = income +
                (request.query.as_of ? `?as_of=${request.query.as_of}` : '')
              return income
            })
          }

          if (application.upload_ids) {
            application.uploads = application.upload_ids.map(uploadId => {
              let upload =  `/uploads/${uploadId}`
              upload = upload +
                (request.query.as_of ? `?as_of=${request.query.as_of}` : '')
              return upload
            })
          }

          if (application.lease_id) {
            application.lease = `/leases/${application.lease_id}`
            application.lease = application.lease +
              (request.query.as_of ? `?as_of=${request.query.as_of}` : '')
          }

          return application
        })
        .asCallback(reply)
      },
      validate: {
        query: server.plugins.schemas.asOfQuery,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'GET',
    path: '/applications/{applicationId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Event.findAll({
          where: {aggregate_id: request.params.applicationId},
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
            url: `/applications/${request.params.applicationId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'GET',
    path: '/users/{userId}/applications',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Application.findAll({
          where: {user_id: request.params.userId, deleted_at: null},
          order: [['created_at', 'DESC']]
        })
        .map(application => {
          return {
            id: application.id,
            status: application.status,
            url: `/applications/${application.id}`,
            created_at: application.created_at
          }
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/applications',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Application.findAll({where: {user_id: request.payload.user_id, deleted_at: null}})
        .filter(application => {
          return ['APPROVED', 'DECLINED'].indexOf(application.status) === -1
        })
        .then(activeApplications => {
          if (activeApplications.length) {
            throw server.plugins.errors.multipleActiveApplications
          }

          const application = Application.build()

          request.payload.id = application.id

          const ApplicationCreatedEvent = new Events.APPLICATION_CREATED(request.payload)

          return application.process(ApplicationCreatedEvent.type, ApplicationCreatedEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationCreatedEvent)
            return application
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.applicationCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/attach_credit_report',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        let application
        return Application.findOne({where: {id: request.params.applicationId, deleted_at: null}})
        .then(_application => {
          application = _application
          if (!application) throw server.plugins.errors.applicationNotFound

          return CreditReport.findOne({
            where: {
              id: request.payload.credit_report_id,
              user_id: application.user_id,
              deleted_at: null
            }
          })
        })
        .then(creditReport => {
          if (!creditReport) throw server.plugins.errors.creditReportNotFound

          const ApplicationAttachCreditReportEvent = new Events.APPLICATION_CREDIT_REPORT_ATTACHED(
            request.params.applicationId,
            request.payload.credit_report_id
          )

          return application.process(
            ApplicationAttachCreditReportEvent.type,
            ApplicationAttachCreditReportEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ApplicationAttachCreditReportEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.applicationAttachCreditReport,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/attach_incomes',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        let application
        let incomeIds
        return Application.findOne({where: {id: request.params.applicationId, deleted_at: null}})
        .then(_application => {
          application = _application
          if (!application) throw server.plugins.errors.applicationNotFound

          incomeIds = Array.isArray(request.payload.income_ids) ? request.payload.income_ids : [request.payload.income_ids];
          return P.map(incomeIds, incomeId => {
            return Income.findOne({
              where: {
                id: incomeId,
                user_id: application.user_id,
                deleted_at: null
              }
            })
            .then(income => {
              if (!income) throw server.plugins.errors.incomeNotFound
              return income
            })
          })
        })
        .then(incomes => {
          const ApplicationAttachIncomesEvent = new Events.APPLICATION_INCOMES_ATTACHED(
            request.params.applicationId,
            incomeIds
          )

          return application.process(
            ApplicationAttachIncomesEvent.type,
            ApplicationAttachIncomesEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ApplicationAttachIncomesEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.applicationAttachEmployment,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/attach_lease',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        let application
        return Application.findOne({where: {id: request.params.applicationId, deleted_at: null}})
        .then(_application => {
          application = _application
          if (!application) throw server.plugins.errors.applicationNotFound

          return Lease.findOne({
            where: {
              id: request.payload.lease_id,
              user_id: application.user_id,
              deleted_at: null
            }
          })
        })
        .then(lease => {
          if (!lease) throw server.plugins.errors.leaseNotFound

          const ApplicationAttachleaseEvent = new Events.APPLICATION_LEASE_ATTACHED(
            request.params.applicationId,
            request.payload.lease_id
          )

          return application.process(
            ApplicationAttachleaseEvent.type,
            ApplicationAttachleaseEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ApplicationAttachleaseEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.applicationAttachLease,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/apply',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null},
          include: [
            {model: Employment, where: {deleted_at: null}},
            {model: Lease, where: {deleted_at: null}}
          ]
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'APPLYING') {
            throw server.plugins.errors.applicationInvalidStatusToApply
          } else if (!application.employment || !application.lease) {
            throw server.plugins.errors.applicationNotReadyToApply
          }

          const ApplicationAppliedEvent = new Events.APPLICATION_APPLIED(application.id)

          return application.process(ApplicationAppliedEvent.type, ApplicationAppliedEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationAppliedEvent)
            return application
          })
        })
      .asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'applications',
  version: '1.0.0'
}
