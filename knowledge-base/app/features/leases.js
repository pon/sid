const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Address   = server.plugins.db.models.Address
  const Event     = server.plugins.db.models.Event
  const Lease     = server.plugins.db.models.Lease

  server.route([{
    method: 'GET',
    path: '/leases/{leaseId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return Lease.findOne({where: {id: request.params.leaseId, deleted_at: null}})
            .then(lease => {
              if (!lease) throw server.plugins.errors.leaseNotFound
                return lease
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.leaseId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.leaseNotFound
            const lease = Lease.build()
            events.forEach(event => {
              lease.process(event.type, event.payload, true)
            })

            return lease
          })
        })
        .asCallback(reply)
      },
      validate: {query: server.plugins.schemas.asOfQuery}
    }
  }, {
    method: 'GET',
    path: '/leases/{leaseId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Event.findAll({
          where: {aggregate_id: request.params.leaseId},
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
            url: `/leases/${request.params.leaseId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/leases',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Address.findOne({where: {id: request.payload.address_id, deleted_at: null}})
        .then(address => {
          if (!address) throw server.plugins.errors.addressNotFound

          const lease = Lease.build()

          request.payload.id = lease.id

          const LeaseCreatedEvent = new Events.LEASE_CREATED(request.payload)

          return lease.process(LeaseCreatedEvent.type, LeaseCreatedEvent.toJSON())
          .then(() => {
            server.emit('KB', LeaseCreatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.leaseCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'PATCH',
    path: '/leases/{leaseId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Lease.findOne({where: {id: request.params.leaseId, deleted_at: null}})
        .then(lease => {
          if (!lease) throw server.plugins.errors.leaseNotFound

          const LeaseUpdatedEvent = new Events.LEASE_UPDATED(
            lease.id,
            request.payload
          )

          return lease.process(LeaseUpdatedEvent.type, LeaseUpdatedEvent.toJSON())
          .then(() => {
            server.emit('KB', LeaseUpdatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.leaseUpdate
      }
    }
  }, {
    method: 'DELETE',
    path: '/leases/{leaseId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Lease.findOne({where: {id: request.params.leaseId, deleted_at: null}})
        .then(lease => {
          if (!lease) throw server.plugins.errors.leaseNotFound

          const LeaseDeletedEvent = new Events.LEASE_DELETED(request.params.leaseId)
          return lease.process(LeaseDeletedEvent.type, LeaseDeletedEvent.toJSON())
          .then(() => {
            server.emit('KB', LeaseDeletedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/leases/{leaseId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return Lease.findOne({
          where: {
            id: request.params.leaseId,
            deleted_at: {$ne: null}
          }
        })
        .then(lease => {
          if (!lease) throw server.plugins.errors.leaseNotFound

          const LeaseRestoredEvent = new Events.LEASE_RESTORED(request.params.leaseId)

          return lease.process(LeaseRestoredEvent.type, LeaseRestoredEvent.toJSON())
          .then(() => {
            server.emit('KB', LeaseRestoredEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'leases',
  version: '1.0.0'
}
