const Joi   = require('joi')
const P     = require('bluebird')

exports.register = (server, options, next) => {
  const Events = options.events

  const FinancialAccount    = server.plugins.db.models.FinancialAccount
  const FinancialCredential = server.plugins.db.models.FinancialCredential
  const Event               = server.plugins.db.models.Event

  const PlaidClient = server.plugins.plaid.PlaidClient

  server.event('financial-credential-connected')

  server.on('financial-credential-connected', credential => {
    return P.resolve(PlaidClient.getAuth(credential.credentials.exchange_response.access_token))
    .then(response => {
      const accounts = response.accounts.map(account => {
        const acctNumbers = response.numbers.find(number => number.account_id === account.account_id)
        if (acctNumbers) {
          account.numbers = acctNumbers
        }
        
        return account
      })

      return accounts
    })
    .map(account => {
      return FinancialAccount.findOne({where: {remote_id: account.account_id, deleted_at: null}})
      .then(existingAccount => {
        if (!existingAccount) {
          const financialAccount = FinancialAccount.build()

          const FinancialAccountCreatedEvent = new Events.FINANCIAL_ACCOUNT_CREATED({
            id: financialAccount.id,
            financial_credential_id: credential.id,
            remote_id: account.account_id,
            name: account.name,
            account_type: account.type,
            account_subtype: account.subtype,
            available_balance: account.balances.available,
            current_balance: account.balances.current,
            credit_limit: account.balances.limit,
            raw_response: account,
            account_number: account.numbers && account.numbers.account,
            routing_number: account.numbers && account.numbers.routing,
            wire_routing_number: account.numbers && account.numbers.wire_routing_number
          }) 

          return financialAccount.process(
            FinancialAccountCreatedEvent.type,
            FinancialAccountCreatedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', FinancialAccountCreatedEvent)
          })
        } else {
          const FinancialAccountUpdatedEvent = new Events.FINANCIAL_ACCOUNT_UPDATED(existingAccount.id, {
            name: account.name,
            account_type: account.type,
            account_subtype: account.subtype,
            available_balance: account.balances.available,
            current_balance: account.balances.current,
            credit_limit: account.balances.limit,
            raw_response: account,
            account_number: account.numbers && account.numbers.account,
            routing_number: account.numbers && account.numbers.routing,
            wire_routing_number: account.numbers && account.numbers.wire_routing_number
          })

          return existingAccount.process(
            FinancialAccountUpdatedEvent.type,
            FinancialAccountUpdatedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', FinancialAccountUpdatedEvent)
          })
        }
      })
    })
  })

  server.route([{
    method: 'GET',
    path: '/financial/credentials/{credentialId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return FinancialCredential.findOne({where: {id: request.params.credentialId, deleted_at: null}})
            .then(credential => {
              if (!credential) throw server.plugins.errors.financialCredentialNotFound
              return credential
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.credentialId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.credentialNotFound
            const credential = FinancialCredential.build()
            events.forEach(event => {
              credential.process(event.type, event.payload, true)
            })

            return credential
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {credentialId: server.plugins.schemas.uuid},
        query: server.plugins.schemas.asOfQuery
      }
    }
  }, {
    method: 'GET',
    path: '/financial/credentials/{credentialId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Event.findAll({
          where: {aggregate_id: request.params.credentialId},
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
            url: `/financial/credentials/${request.params.credentialId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      },
      validate: {
        params: {credentialId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'GET',
    path: '/users/{userId}/financial-credentials',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        FinancialCredential.findAll({
          where: {
            user_id: request.params.userId,
            deleted_at: null
          } 
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'DELETE',
    path: '/financial/credentials/{credentialId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        FinancialCredential.findOne({where: {id: request.params.credentialId, deleted_at: null}})
        .then(credential => {
          if (!credential) throw server.plugins.errors.credentialNotFound

          const FinancialCredentialDeleted = new Events.FINANCIAL_CREDENTIAL_DELETED(request.params.credentialId)
          return credential.process(FinancialCredentialDeleted.type, FinancialCredentialDeleted.toJSON())
          .then(() => {
            server.emit('KB', FinancialCredentialDeleted)
          })
          .asCallback(reply)
        })
      },
      validate: {
        params: {credentialId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/financial/credentials/{credentialId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        FinancialCredential.findOne({
          where: {
            id: request.params.credentialId,
            deleted_at: {$ne: null}
          }
        })
        .then(credential => {
          if (!credential) throw server.plugins.errors.credentialNotFound

          const FinancialCredentialRestoredEvent = new Events.FINANCIAL_CREDENTIAL_RESTORED(request.params.credentialId)
          return credential.process(FinancialCredentialRestored.type, FinancialCredentialRestored.toJSON())
          .then(() => {
            server.emit('KB', FinancialCredentialRestored)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {credentialId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/financial/credentials',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        P.resolve()
        .then(() => {
          const credential = FinancialCredential.build()

          const FinancialCredentialCreatedEvent = new Events.FINANCIAL_CREDENTIAL_CREATED({
            id: credential.id,
            user_id: request.payload.user_id,
            provider: request.payload.provider,
            institution_name: request.payload.credentials.metadata.institution.name,
            credentials: request.payload.credentials,
            enabled: true
          })

          return credential.process(
            FinancialCredentialCreatedEvent.type,            
            FinancialCredentialCreatedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', FinancialCredentialCreatedEvent)
          })
          .tap(() => {
            return PlaidClient.exchangePublicToken(request.payload.credentials.public_token)
            .then(response => {
              const updatedCredentials = credential.credentials
              updatedCredentials.exchange_response = response
              const FinancialCredentialUpdatedEvent = new Events.FINANCIAL_CREDENTIAL_UPDATED(
                credential.id, {
                  remote_id: response.item_id,
                  credentials: updatedCredentials, 
                  connected: true
                }
              )

              return credential.process(
                FinancialCredentialUpdatedEvent.type,
                FinancialCredentialUpdatedEvent.toJSON()
              )
              .then(() => {
                server.emit('financial-credential-connected', credential)
                server.emit('KB', FinancialCredentialUpdatedEvent)
              })
            })
            .catch(err => {
              const updatedCredentials = credential.credentials
              updatedCredentials.exchange_response = err
              const FinancialCredentialUpdatedEvent = new Events.FINANCIAL_CREDENTIAL_UPDATED(
                credential.id, {credentials: updatedCredentials}
              )

              return credential.process(
                FinancialCredentialUpdatedEvent.type,
                FinancialCredentialUpdatedEvent.toJSON()
              )
              .then(() => {
                server.emit('KB', FinancialCredentialUpdatedEvent)
              })
            })
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.financialCredentialCreate
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'financial',
  version: '1.0.0'
}
