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
  }])

  next()
}

exports.register.attributes = {
  name: 'verification',
  version: '1.0.0'
}
