const Joi     = require('joi')

exports.register = (server, options, next) => {

  const Events = options.events

  const Address = server.plugins.db.models.Address
  const State   = server.plugins.db.models.State
  server.route([{
    method: 'POST',
    path: '/users/{userId}/addresses',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return State.findById(request.payload.state.toUpperCase())
        .then(state => {
          if (!state) throw server.plugins.errors.invalidState

          return Address.create({
            user_id: request.params.userId,
            street_one: request.payload.streetOne,
            street_two: request.payload.streetTwo,
            city: request.payload.city,
            state_id: state.id,
            zip_code: request.payload.zipCode
          })
          .then(address => {
            const AddressCreatedEvent = new Events.ADDRESS_CREATED(address)
            server.emit('KB', AddressCreatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.address
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'addresses',
  version: '1.0.0'
}
