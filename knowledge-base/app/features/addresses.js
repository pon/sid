const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Address = server.plugins.db.models.Address
  const Event   = server.plugins.db.models.Event
  const State   = server.plugins.db.models.State

  server.route([{
    method: 'GET',
    path: '/addresses/{addressId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return Address.findOne({where: {id: request.params.addressId, deleted_at: null}})
            .then(address => {
              if (!address) throw server.plugins.errors.addressNotFound
              return address
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.addressId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.addressNotFound
            const address = Address.build()
            events.forEach(event => {
              address.process(event.type, event.payload, true)
            })

            return address
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'GET',
    path: '/addresses/{addressId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Event.findAll({
          where: {aggregate_id: request.params.addressId},
          order: [['id', 'ASC']]
        })
        .map(event => {
          const as_of = event.created_at.getTime()
          return {
            id: event.id,
            type: event.type,
            meta_data: event.meta_data,
            payload: event.payload,
            created_at: as_of,
            url: `/addresses/${request.params.addressId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/addresses',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return State.findById(request.payload.state.toUpperCase())
        .then(state => {
          if (!state) throw server.plugins.errors.invalidState

          const address = Address.build()

          const AddressCreatedEvent = new Events.ADDRESS_CREATED({
            id: address.id,
            user_id: request.payload.user_id,
            street_one: request.payload.street_one,
            street_two: request.payload.street_two,
            city: request.payload.city,
            state_id: state.id,
            zip_code: request.payload.zip_code
          })

          return address.process(AddressCreatedEvent.type, AddressCreatedEvent.toJSON())
          .then(() => {
            server.emit('KB', AddressCreatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.addressCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'PATCH',
    path: '/addresses/{addressId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        let state
        return P.resolve()
        .then(() => {
          if (request.payload.state) {
            return State.findById(request.payload.state.toUpperCase())
            .then(_state => {
              if (!_state) throw server.plugins.errors.invalidState
              state = _state
            })
          }
        })
        .then(() => {
          return Address.findById(request.params.addressId)
        })
        .then(address => {
          if (!address) throw server.plugins.errors.addressNotFound

          let addressUpdate = Object.keys(request.payload).reduce((agg, key) => {
            if (request.payload[key] !== undefined && key !== 'state') {
              agg[key] = request.payload[key]
            }

            return agg
          }, {});

          if (state) {
            addressUpdate.state_id = state.id
          }

          const AddressUpdatedEvent = new Events.ADDRESS_UPDATED(
            address.id,
            addressUpdate
          )

          return address.process(AddressUpdatedEvent.type, AddressUpdatedEvent.toJSON())
          .then(() => {
            server.emit('KB', AddressUpdatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.addressUpdate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/addresses/{addressId}/verify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Address.findById(request.params.addressId)
        .then(address => {
          if (!address) {
            throw server.plugins.errors.addressNotFound
          } else if (address.verified) {
            throw server.plugins.errors.addressAlreadyVerified
          }

          const AddressVerifiedEvent = new Events.ADDRESS_VERIFIED(request.params.addressId)

          return address.process(AddressVerifiedEvent.type, AddressVerifiedEvent.toJSON())
          .then(() => {
            server.emit('KB', AddressVerifiedEvent)
          })
          .asCallback(reply)
        })
      }
    }
  }, {
    method: 'POST',
    path: '/addresses/{addressId}/unverify',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Address.findById(request.params.addressId)
        .then(address => {
          if (!address) {
            throw server.plugins.errors.addressNotFound
          } else if (!address.verified) {
            throw server.plugins.errors.addressNotVerified
          }

          const AddressUnverifiedEvent = new Events.ADDRESS_UNVERIFIED(request.params.addressId)

          return address.process(AddressUnverifiedEvent.type, AddressUnverifiedEvent.toJSON())
          .then(() => {
            server.emit('KB', AddressUnverifiedEvent)
          })
          .asCallback(reply)
        })
      }
    }

  }, {
    method: 'DELETE',
    path: '/addresses/{addressId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Address.findById(request.params.addressId)
        .then(address => {
          if (!address) throw server.plugins.errors.addressNotFound

          const AddressDeletedEvent = new Events.ADDRESS_DELETED(request.params.addressId)
          return address.process(AddressDeletedEvent.type, AddressDeletedEvent.toJSON())
          .then(() => {
            server.emit('KB', AddressDeletedEvent)
          })
          .asCallback(reply)
        })
      }
    }
  }, {
    method: 'POST',
    path: '/addresses/{addressId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Address.findById(request.params.addressId, {paranoid: false})
        .then(address => {
          if (!address) throw server.plugins.errors.addressNotFound

          const AddressRestoredEvent = new Events.ADDRESS_RESTORED(request.params.addressId)
          return address.process(AddressRestoredEvent.type, AddressRestoredEvent.toJSON())
          .then(() => {
            server.emit('KB', AddressRestoredEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'addresses',
  version: '1.0.0'
}
