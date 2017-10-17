const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Application   = server.plugins.db.models.Application
  const CreditReport  = server.plugins.db.models.CreditReport
  const Income        = server.plugins.db.models.Income
  const Event         = server.plugins.db.models.Event
  const Lease         = server.plugins.db.models.Lease
  const Upload        = server.plugins.db.models.Upload

  server.route([{
    method: 'GET',
    path: '/applications',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        const whereClause = {deleted_at: null}
        if (request.query.status) {
          whereClause.status = request.query.status
        }

        P.resolve()
        .then(() => {
          if (request.query.ending_before) {
            return Application.findById(request.query.ending_before)
          }  else if (request.query.starting_after) {
            return Application.findById(request.query.starting_after)
          }
        })
        .then(application => {
          if (request.query.ending_before) {
            whereClause.created_at = {$lt: application.created_at}
          } else if (request.query.starting_after) {
            whereClause.created_at = {$gt: application.created_at}
          }

          return Application.findAll({
            where: whereClause,
            limit: request.query.limit,
            order: [['created_at', 'DESC']]
          })
        })
        .asCallback(reply)
      },
      validate: {
        query: server.plugins.schemas.applicationsPaginatedQuery
      }
    }
  }, {
    method: 'GET',
    path: '/applications/{applicationId}',
    config:{
      tags: ['api'],
      handler: (request, reply) => {
        let application
        P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return Application.findOne({
              where: {id: request.params.applicationId, deleted_at: null},
            })
            .then(_application => {
              if (!_application) throw server.plugins.errors.applicationNotFound

              application = _application
              return P.all([
                application.getIncomes(),
                application.getUploads()
              ])
              .spread((incomes, uploads) => {
                application.incomes = incomes
                application.uploads = uploads
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
              income = income + (request.query.as_of ? `?as_of=${request.query.as_of}` : '')
              return income
            })
          }

          if (application.upload_ids) {
            application.uploads = application.upload_ids.map(uploadId => {
              let upload =  `/uploads/${uploadId}`
              upload = upload + (request.query.as_of ? `?as_of=${request.query.as_of}` : '')
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
        params: {applicationId: server.plugins.schemas.uuid},
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
        Event.findAll({
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
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'GET',
    path: '/users/{userId}/applications',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findAll({
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
        Application.findAll({where: {user_id: request.payload.user_id, deleted_at: null}})
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
        Application.findOne({where: {id: request.params.applicationId, deleted_at: null}})
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
        params: {applicationId: server.plugins.schemas.uuid},
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
        Application.findOne({where: {id: request.params.applicationId, deleted_at: null}})
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
        params: {applicationId: server.plugins.schemas.uuid},
        payload: server.plugins.schemas.applicationAttachIncomes,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/attach_uploads',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        let application
        let uploadIds
        Application.findOne({where: {id: request.params.applicationId, deleted_at: null}})
        .then(_application => {
          application = _application
          if (!application) throw server.plugins.errors.applicationNotFound

          uploadIds = Array.isArray(request.payload.upload_ids) ? request.payload.upload_ids : [request.payload.upload_ids];
          return P.map(uploadIds, uploadId => {
            return Upload.findOne({
              where: {
                id: uploadId,
                user_id: application.user_id,
                deleted_at: null
              }
            })
            .then(upload => {
              if (!upload) throw server.plugins.errors.uploadNotFound
              return upload
            })
          })
        })
        .then(uploads => {
          const ApplicationAttachUploadsEvent = new Events.APPLICATION_UPLOADS_ATTACHED(
            request.params.applicationId,
            uploadIds
          )

          return application.process(
            ApplicationAttachUploadsEvent.type,
            ApplicationAttachUploadsEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ApplicationAttachUploadsEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid},
        payload: server.plugins.schemas.applicationAttachUploads,
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
        Application.findOne({where: {id: request.params.applicationId, deleted_at: null}})
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
        params: {applicationId: server.plugins.schemas.uuid},
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
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'APPLYING') {
            throw server.plugins.errors.applicationInvalidStatusToApply
          }

          const ApplicationAppliedEvent = new Events.APPLICATION_APPLIED(application.id)

          return application.process(ApplicationAppliedEvent.type, ApplicationAppliedEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationAppliedEvent)
            return application
          })
        })
      .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/complete-verification',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'VERIFYING') {
            throw server.plugins.errors.applicationInvalidStatusToCompleteVerification
          }

          const ApplicationCompletedVerificationEvent =
            new Events.APPLICATION_COMPLETED_VERIFICATION(application.id)

          return application.process(
            ApplicationCompletedVerificationEvent.type,
            ApplicationCompletedVerificationEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ApplicationCompletedVerificationEvent)
            return application
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/re-verify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'UNDERWRITING') {
            throw server.plugins.errors.applicationInvalidStatusToReverify
          }

          const ApplicationReverifiedEvent = new Events.APPLICATION_REVERIFIED(application.id)

          return application.process(ApplicationReverifiedEvent.type, ApplicationReverifiedEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationReverifiedEvent)
            return application
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/time-out',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'VERIFYING') {
            throw server.plugins.errors.applicationInvalidStatusToTimeOut
          }

          const ApplicationTimedOutEvent= new Events.APPLICATION_TIMED_OUT(application.id)

          return application.process(ApplicationTimedOutEvent.type, ApplicationTimedOutEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationTimedOutEvent)
            return application
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/untime-out',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'TIMED_OUT') {
            throw server.plugins.errors.applicationInvalidStatusToUntimeOut
          }

          const ApplicationUntimedOut= new Events.APPLICATION_UNTIMED_OUT(application.id)

          return application.process(ApplicationUntimedOut.type, ApplicationUntimedOut.toJSON())
          .then(() => {
            server.emit('KB', ApplicationUntimedOut)
            return application
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/approve',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'UNDERWRITING') {
            throw server.plugins.errors.applicationInvalidStatusToApprove
          }

          const ApplicationApprovedEvent = new Events.APPLICATION_APPROVED(application.id)

          return application.process(ApplicationApprovedEvent.type, ApplicationApprovedEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationApprovedEvent)
            return application
          })
        })
      .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/unapprove',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'APPROVED') {
            throw server.plugins.errors.applicationInvalidStatusToUnapprove
          }

          const ApplicationUnunapprovedEvent = new Events.APPLICATION_UNAPPROVED(application.id)

          return application.process(ApplicationUnunapprovedEvent.type, ApplicationUnunapprovedEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationUnunapprovedEvent)
            return application
          })
        })
      .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/decline',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'UNDERWRITING' && application.status !== 'VERIFYING') {
            throw server.plugins.errors.applicationInvalidStatusToDecline
          }

          const ApplicationDeclinedEvent = new Events.APPLICATION_DECLINED(application.id)

          return application.process(ApplicationDeclinedEvent.type, ApplicationDeclinedEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationDeclinedEvent)
            return application
          })
        })
      .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/applications/{applicationId}/undecline',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({
          where: {id: request.params.applicationId, deleted_at: null}
        })
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound
          else if (application.status !== 'DECLINED') {
            throw server.plugins.errors.applicationInvalidStatusToUndecline
          }

          const ApplicationUndeclinedEvent = new Events.APPLICATION_UNDECLINED(application.id)

          return application.process(ApplicationUndeclinedEvent.type, ApplicationUndeclinedEvent.toJSON())
          .then(() => {
            server.emit('KB', ApplicationUndeclinedEvent)
            return application
          })
        })
      .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'applications',
  version: '1.0.0'
}
