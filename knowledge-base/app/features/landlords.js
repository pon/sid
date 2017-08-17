const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Address   = server.plugins.db.models.Address
  const Event     = server.plugins.db.models.Event
  const Landlord  = server.plugins.db.models.Landlord

  server.route([{
    method: 'GET',
    path: '/landlords/{landlordId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return Landlord.findOne({where: {id: request.params.landlordId, deleted_at: null}})
            .then(landlord => {
              if (!landlord) throw server.plugins.errors.landlordNotFound
                return landlord
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.landlordId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.landlordNotFound
            const landlord = Landlord.build()
            events.forEach(event => {
              landlord.process(event.type, event.payload, true)
            })

            return landlord
          })
        })
        .then(landlord => {
          landlord = landlord.toJSON()
          landlord.address = `/addresses/${landlord.address_id}`
          landlord.address = landlord.address + (request.query.as_of ? `?as_of=${request.query.as_of}` : '')
          return landlord
        })
        .asCallback(reply)
      },
      validate: {
        params: {landlordId: server.plugins.schemas.uuid},
        query: server.plugins.schemas.asOfQuery
      }
    }
  }, {
    method: 'GET',
    path: '/landlords/{landlordId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Event.findAll({
          where: {aggregate_id: request.params.landlordId},
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
            url: `/landlords/${request.params.landlordId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      },
      validate: {
        params: {landlordId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/landlords',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Address.findOne({where: {id: request.payload.address_id, deleted_at: null}})
        .then(address => {
          if (!address) throw server.plugins.errors.addressNotFound

          const landlord = Landlord.build()

          request.payload.id = landlord.id

          const LandlordCreatedEvent = new Events.LANDLORD_CREATED(request.payload)

          return landlord.process(LandlordCreatedEvent.type, LandlordCreatedEvent.toJSON())
          .then(() => {
            server.emit('KB', LandlordCreatedEvent)
            return landlord
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.landlordCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'PATCH',
    path: '/landlords/{landlordId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Landlord.findOne({where: {id: request.params.landlordId, deleted_at: null}})
        .then(landlord => {
          if (!landlord) throw server.plugins.errors.landlordNotFound

          const LandlordUpdatedEvent= new Events.LANDLORD_UPDATED(
            landlord.id,
            request.payload
          )

          return landlord.process(LandlordUpdatedEvent.type, LandlordUpdatedEvent.toJSON())
          .then(() => {
            server.emit('KB', LandlordUpdatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {landlordId: server.plugins.schemas.uuid},
        payload: server.plugins.schemas.landlordUpdate
      }
    }
  }, {
    method: 'DELETE',
    path: '/landlords/{landlordId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Landlord.findOne({where: {id: request.params.landlordId, deleted_at: null}})
        .then(landlord => {
          if (!landlord) throw server.plugins.errors.landlordNotFound

          const LandlordDeletedEvent = new Events.LANDLORD_DELETED(request.params.landlordId)
          return landlord.process(LandlordDeletedEvent.type, LandlordDeletedEvent.toJSON())
          .then(() => {
            server.emit('KB', LandlordDeletedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {landlordId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/landlords/{landlordId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Landlord.findOne({
          where: {
            id: request.params.landlordId,
            deleted_at: {$ne: null}
          }
        })
        .then(landlord => {
          if (!landlord) throw server.plugins.errors.landlordNotFound

          const LandlordRestoredEvent = new Events.LANDLORD_RESTORED(request.params.landlordId)

          return landlord.process(LandlordRestoredEvent.type, LandlordRestoredEvent.toJSON())
          .then(() => {
            server.emit('KB', LandlordRestoredEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {landlordId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/landlords/{landlordId}/verify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Landlord.findOne({where: {id: request.params.landlordId, deleted_at: null}})
        .then(landlord => {
          if (!landlord) {
            throw server.plugins.errors.landlordNotFound
          } else if (landlord.verified) {
            throw server.plugins.errors.landlordAlreadyVerified
          }

          const LandlordVerifiedEvent = new Events.LANDLORD_VERIFIED(landlord.id)

          return landlord.process(LandlordVerifiedEvent.type, LandlordVerifiedEvent.toJSON())
          .then(() => {
            server.emit('KB', LandlordVerifiedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {landlordId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/landlords/{landlordId}/unverify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Landlord.findOne({where: {id: request.params.landlordId, deleted_at: null}})
        .then(landlord => {
          if (!landlord) {
            throw server.plugins.errors.landlordNotFound
          } else if (!landlord.verified) {
            throw server.plugins.errors.landlordNotVerified
          }

          const LandlordUnverifiedEvent = new Events.LANDLORD_UNVERIFIED(
            request.params.landlordId
          )

          return landlord.process(
            LandlordUnverifiedEvent.type,
            LandlordUnverifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', LandlordUnverifiedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {landlordId: server.plugins.schemas.uuid}
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'landlords',
  version: '1.0.0'
}
