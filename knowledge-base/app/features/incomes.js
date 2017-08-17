const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Income = server.plugins.db.models.Income
  const Event  = server.plugins.db.models.Event

  server.route([{
    method: 'GET',
    path: '/incomes/{incomeId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return Income.findOne({where: {id: request.params.incomeId, deleted_at: null}})
            .then(income => {
              if (!income) throw server.plugins.errors.incomeNotFound
              return income
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.incomeId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.incomeNotFound
            const income = Income.build()
            events.forEach(event => {
              income.process(event.type, event.payload, true)
            })

            return income
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.uuid},
        query: server.plugins.schemas.asOfQuery
      }
    }
  }, {
    method: 'GET',
    path: '/incomes/{incomeId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Event.findAll({
          where: {aggregate_id: request.params.incomeId},
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
            url: `/incomes/${request.params.incomeId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/incomes',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        const income = Income.build()

        request.payload.id = income.id

        const IncomeCreatedEvent = new Events.INCOME_CREATED(request.payload)

        income.process(IncomeCreatedEvent.type, IncomeCreatedEvent)
        .then(() => {
          server.emit('KB', IncomeCreatedEvent)
          return income
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.incomeCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'PATCH',
    path: '/incomes/{incomeId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Income.findOne({where: {id: request.params.incomeId, deleted_at: null}})
        .then(income => {
          if (!income) throw server.plugins.errors.incomeNotFound

          const IncomeUpdatedEvent = new Events.INCOME_UPDATED(
            income.id,
            request.payload
          )

          return income.process(IncomeUpdatedEvent.type, IncomeUpdatedEvent.toJSON())
          .then(() => {
            server.emit('KB', IncomeUpdatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.uuid},
        payload: server.plugins.schemas.incomeUpdate
      }
    }
  }, {
    method: 'DELETE',
    path: '/incomes/{incomeId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Income.findOne({where: {id: request.params.incomeId, deleted_at: null}})
        .then(income => {
          if (!income) throw server.plugins.errors.incomeNotFound

          const IncomeDeletedEvent = new Events.INCOME_DELETED(request.params.incomeId)
          return income.process(IncomeDeletedEvent.type, IncomeDeletedEvent.toJSON())
          .then(() => {
            server.emit('KB', IncomeDeletedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/incomes/{incomeId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Income.findOne({
          where: {
            id: request.params.incomeId,
            deleted_at: {$ne: null}
          }
        })
        .then(income => {
          if (!income) throw server.plugins.errors.incomeNotFound

          const IncomeRestoredEvent = new Events.INCOME_RESTORED(
            request.params.incomeId
          )

          return income.process(
            IncomeRestoredEvent.type,
            IncomeRestoredEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', IncomeRestoredEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/incomes/{incomeId}/verify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Income.findOne({where: {id: request.params.incomeId, deleted_at: null}})
        .then(income => {
          if (!income) {
            throw server.plugins.errors.incomeNotFound
          } else if (income.verified) {
            throw server.plugins.errors.incomeAlreadyVerified
          }

          const IncomeVerifiedEvent = new Events.INCOME_VERIFIED(
            income.id,
            request.payload.verified_income
          )

          return income.process(
            IncomeVerifiedEvent.type,
            IncomeVerifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', IncomeVerifiedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.uuid},
        payload: server.plugins.schemas.incomeVerify,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/incomes/{incomeId}/unverify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Income.findOne({where: {id: request.params.incomeId, deleted_at: null}})
        .then(income => {
          if (!income) {
            throw server.plugins.errors.incomeNotFound
          } else if (!income.verified) {
            throw server.plugins.errors.incomeNotVerified
          }

          const IncomeUnverifiedEvent = new Events.INCOME_UNVERIFIED(
            request.params.incomeId
          )

          return income.process(
            IncomeUnverifiedEvent.type,
            IncomeUnverifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', IncomeUnverifiedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {incomeId: server.plugins.schemas.uuid}
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'incomes',
  version: '1.0.0'
}
