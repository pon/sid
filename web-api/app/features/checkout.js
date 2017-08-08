const Boom    = require('boom')
const fs      = require('fs')
const moment  = require('moment')
const P       = require('bluebird')

exports.register = (server, options, next) => {

  const KBClient = server.plugins.clients.KnowledgeBaseClient
  const User     = server.plugins.db.models.User

  server.route([{
    method: 'GET',
    path: '/checkout',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          return KBClient.getUserApplications(request.auth.credentials.id)
          .then(apps => apps[0])
          .then(app => {
            return KBClient.getApplicationLoanOffer(app.id)
          })
          .then(loanOffer => {
            return P.props({
              loan_offer: loanOffer,
              payoff_details: null,
              payment_account: null
            })
          })
        })
        .asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'checkout',
  version: '1.0.0'
}
