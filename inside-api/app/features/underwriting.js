const P = require('bluebird')

exports.register = (server, options, next) => {
  const AppApiClient  = server.plugins.clients.AppApiClient
  const KBClient      = server.plugins.clients.KnowledgeBaseClient

  server.route([{
    method: 'GET',
    path: '/underwriting/applications',
    config: {
      tags: ['api', 'underwriting'],
      handler: (request, reply) => {
        const query = request.query || {}
        query.status = 'UNDERWRITING'

        KBClient.getApplications(query)
        .map(application => {
          return KBClient.getApplicationEvents(application.id)
          .then(applicationEvents => {
            const verifyEvent = applicationEvents.reduce((latest, evt) => {
              if (!latest && evt.type === 'APPLICATION_COMPLETED_VERIFICATION') {
                latest = evt
              } else if (latest && evt.type === 'APPLICATION_COMPLETED_VERIFICATION') {
                const currentLatestDate = new Date(latest.payload.applied_at)
                const evtDate = new Date(evt.payload.applied_at)

                if (evtDate > currentLatestDate) {
                  latest = evt
                }
              }

              return latest
            }, null)

            application.completed_verification_at = verifyEvent.payload.completed_verification_at
            return application
          })
        })
        .asCallback(reply)
      },
      validate: {
        query: server.plugins.schemas.paginatedQuery
      }
    }
  }, {
    method: 'GET',
    path: '/underwriting/applications/{applicationId}',
    config: {
      tags: ['api', 'underwriting'],
      handler: (request, reply) => {
        KBClient.getApplication(request.params.applicationId)
        .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.guid}
      }
    }
  }, {
    method: 'POST',
    path: '/underwriting/applications/{applicationId}/approve',
    config: {
      tags: ['api', 'underwriting'],
      handler: (request, reply) => {
        let application
        KBClient.getApplication(request.params.applicationId)
        .catch(KBClient.NotFound, err => {
          throw server.plugins.errors.applicationNotFound 
        })
        .catch(KBClient.BadRequest, err => {
          throw server.plugins.errors.unableToApproveApplication
        })
        .then(_application => {
          application = _application
          if (application.status !== 'UNDERWRITING') {
            throw server.plugins.errors.unableToApproveApplication
          }

          return P.all([
            KBClient.createApplicationLoanOffer({
              application_id: request.params.applicationId,
              interest_rate: request.payload.interest_rate,
              term_in_months: request.payload.term_months,
              principal_amount: request.payload.amount
            }),
            KBClient.applicationApprove(request.params.applicationId)
          ])
        })
        .tap(() => {
          return P.all([
            AppApiClient.getUserEmail(application.user_id)
            .then(body => body.email),
            KBClient.getProfile(application.user_id)
            .then(body => body.first_name)
          ])
          .spread((email, name) => {
            return server.plugins.emailer.sendApproval(email, {
              name: name,
              dashboardUrl: `${options.appUrl}/dashboard`
            }) 
          })
        })
        .then(() => {
          return KBClient.getApplication(request.params.applicationId)
        })
        .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.guid},
        payload: server.plugins.schemas.approveApplication
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'underwriting',
  version: '1.0.0'
}
