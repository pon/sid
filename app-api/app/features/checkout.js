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
        KBClient.getUserApplications(request.auth.credentials.id)
        .then(apps => apps[0])
        .then(app => {
          return P.all([
            KBClient.getApplicationLoanOffer(app.id),
            KBClient.getFinancialCredentials(request.auth.credentials.id)
          ])
        })
        .spread((loanOffer, credentials) => {
          const accounts = credentials.reduce((agg, credential) => {
            credential.financial_accounts.filter(account => {
              return account.account_type === 'depository' && account.account_subtype === 'checking'
            })
            .forEach(account => {
              agg.push({
                account_id: account.id,
                institution_name: credential.institution_name,
                name: account.name,
                account_number_last_4: account.account_number.substr(account.account_number.length - 4)
              })
            })
            return agg
          }, [])
          return P.props({
            loan_offer: loanOffer,
            payoff_details: null,
            financial_accounts: accounts,
            payment_account: null
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/checkout/complete-review-offer',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        KBClient.loanOfferUpdateCurrentStep(request.payload.loan_offer_id, 'PAYOFF_DETAILS')
        .then(() => {
          return KBClient.getLoanOffer(request.payload.loan_offer_id)
        })
        .then(loanOffer => {
          return P.props({
            loan_offer: loanOffer,
            payoff_details: null,
            payment_account: null
          })  
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.loanOfferCompleteReviewOffer
      }
    }
  }, {
    method: 'POST',
    path: '/checkout/payoff-details',
    config: {
      tags: ['api'],
      payload: {
        output: 'file',
        allow: 'multipart/form-data',
        parse: true
      },
      handler: (request, reply) => {
        if (!Array.isArray(request.payload.files)) {
          request.payload.files = [request.payload.files]
          request.payload.categories = [request.payload.categories]
        }

        let loanOffer
        KBClient.getLoanOffer(request.payload.loan_offer_id)
        .then(_loanOffer => {
          loanOffer = _loanOffer
          return KBClient.getApplication(loanOffer.application_id)
        })
        .then(application => {
          return P.all([
            KBClient.createAddress({
              user_id: request.auth.credentials.id,
              street_one: request.payload.street_one,
              street_two: request.payload.street_two,
              city: request.payload.city,
              state: request.payload.state,
              zip_code: request.payload.zip_code
            })
            .then(address => {
              return KBClient.createLandlord({
                name: request.payload.name,
                phone_number: request.payload.phone_number,
                email: request.payload.email,
                address_id: address.id
              }) 
            }),
            P.map(request.payload.files, (file, idx) => {
              return KBClient.createUpload(request.auth.credentials.id, file, request.payload.categories[idx])
              .tap(() => {
                if (fs.existsSync(file.path)) {
                  fs.unlinkSync(file.path)
                }
              })
            })
          ])
          .spread((landlord, uploads) => {
            return P.all([
              KBClient.leaseAttachUploads(application.lease_id, uploads.map(upload => upload.id)),
              KBClient.leaseAttachLandlord(application.lease_id, landlord.id),
              KBClient.loanOfferUpdateCurrentStep(request.payload.loan_offer_id, 'PAYMENT')
            ])
          })
          .then(() => {
            return KBClient.getLoanOffer(request.payload.loan_offer_id)
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
      },
      validate: {
        payload: server.plugins.schemas.loanOfferPayoffDetails,
        options: {stripUnknown: true}
      }
    }

  }])

  next()
}

exports.register.attributes = {
  name: 'checkout',
  version: '1.0.0'
}
