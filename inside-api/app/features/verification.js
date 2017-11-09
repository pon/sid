const P = require('bluebird')

exports.register = (server, options, next) => {
  const KBClient = server.plugins.clients.KnowledgeBaseClient

  server.route([{
    method: 'GET',
    path: '/verification/applications',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        const query = request.query || {}
        query.status = 'VERIFYING'

        KBClient.getApplications(query)
        .map(application => {
          return KBClient.getApplicationEvents(application.id)
          .then(applicationEvents => {
            const appliedEvent = applicationEvents.reduce((latest, evt) => {
              if (!latest && evt.type === 'APPLICATION_APPLIED') {
                latest = evt
              } else if (latest && evt.type === 'APPLICATION_APPLIED') {
                const currentLatestDate = new Date(latest.payload.applied_at)
                const evtDate = new Date(evt.payload.applied_at)

                if (evtDate > currentLatestDate) {
                  latest = evt
                }
              }

              return latest
            }, null)

            application.applied_at = appliedEvent.payload.applied_at
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
    path: '/verification/applications/{applicationId}',
    config: {
      tags: ['api', 'verification'],
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
    path: '/verification/incomes/{incomeId}/verify',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        KBClient.verifyIncome(request.params.incomeId, request.payload.verified_income)
        .catch(KBClient.NotFound, err => {
          throw server.plugins.errors.incomeNotFound
        })
        .catch(KBClient.BadRequest, err => {
          throw server.plugins.errors.unableToVerifyIncome
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.guid},
        payload: server.plugins.schemas.incomeVerify
      }
    }
  }, {
    method: 'POST',
    path: '/verification/incomes/{incomeId}/unverify',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        KBClient.unverifyIncome(request.params.incomeId)
        .catch(KBClient.NotFound, err => {
          throw server.plugins.errors.incomeNotFound
        })
        .catch(KBClient.BadRequest, err => {
          throw server.plugins.errors.unableToUnverifyIncome
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.guid}
      }
    }
  }, {
    method: 'POST',
    path: '/verification/applications/{applicationId}/complete-verification',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        KBClient.applicationCompleteVerification(request.params.applicationId)
        .catch(KBClient.NotFound, () => {
          throw server.plugins.errors.applicationNotFound
        })
        .catch(KBClient.BadRequest, () => {
          throw server.plugins.errors.unableToVerifyApplication
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/verification/applications/{applicationId}/re-verify',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        KBClient.applicationReverify(request.params.applicationId)
        .catch(KBClient.NotFound, () => {
          throw server.plugins.errors.applicationNotFound
        })
        .catch(KBClient.BadRequest, () => {
          throw server.plugins.errors.unableToReverifyApplication
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/verification/users/{userId}/verify-identity',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        KBClient.profileVerifyIdentity(request.params.userId)
        .catch(KBClient.NotFound, () => {
          throw server.plugins.errors.userNotFound
        })
        .catch(KBClient.BadRequest, () => {
          throw server.plugins.errors.unableToVerifyIdentity
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/verification/users/{userId}/unverify-identity',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        KBClient.profileUnverifyIdentity(request.params.userId)
        .catch(KBClient.NotFound, () => {
          throw server.plugins.errors.userNotFound
        })
        .catch(KBClient.BadRequest, () => {
          throw server.plugins.errors.unableToUnverifyIdentity
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/verification/users/{userId}/verify-citizenship',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        KBClient.profileVerifyCitizenship(request.params.userId)
        .catch(KBClient.NotFound, () => {
          throw server.plugins.errors.userNotFound
        })
        .catch(KBClient.BadRequest, () => {
          throw server.plugins.errors.unableToVerifyCitizenship
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/verification/users/{userId}/unverify-citizenship',
    config: {
      tags: ['api', 'verification'],
      handler: (request, reply) => {
        KBClient.profileUnverifyCitizenship(request.params.userId)
        .catch(KBClient.NotFound, () => {
          throw server.plugins.errors.userNotFound
        })
        .catch(KBClient.BadRequest, () => {
          throw server.plugins.errors.unableToUnverifyCitizenship
        })
        .asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'verification',
  version: '1.0.0'
}
