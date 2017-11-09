const P = require('bluebird')

exports.register = (server, options, next) => {
  const KBClient = server.plugins.clients.KnowledgeBaseClient

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
  }])

  next()
}

exports.register.attributes = {
  name: 'underwriting',
  version: '1.0.0'
}
