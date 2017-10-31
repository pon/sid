const Joi = require('joi')
const P   = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Address    = server.plugins.db.models.Address
  const Event      = server.plugins.db.models.Event
  const Profile    = server.plugins.db.models.Profile

  server.route([{
    method: 'GET',
    path: '/users/{userId}/profile',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        P.resolve()
        .then(() => {
          return Profile.findOne({where: {user_id: request.params.userId, deleted_at: null}})
          .then(profile => {
            if (!profile) throw server.plugins.errors.profileNotFound
            else if (!request.query.as_of) return profile

            return Event.findAll({
              where: {aggregate_id: profile.id},
              order: [['id', 'ASC']]
            })
            .filter(event => {
              return event.created_at.getTime() <= request.query.as_of
            })
            .then(events => {
              if (!events.length) throw server.plugins.errors.profileNotFound
              const profile = Profile.build()
              events.forEach(event => {
                profile.process(event.type, event.payload, true)
              })

              return profile
            })
          })
        })
        .then(profile => {
          profile = profile.toJSON()
          if (profile.current_address_id) {
            profile.current_address = `/addresses/${profile.current_address_id}`
          }

          return profile
        })
        .asCallback(reply)
      },
      validate: {
        query: server.plugins.schemas.asOfQuery
      }
    }
  }, {
    method: 'GET',
    path: '/users/{userId}/profile/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Profile.findOne({where: {user_id: request.params.userId, deleted_at: null}})
        .then(profile => {
          if (!profile) throw server.plugins.errors.profileNotFound

          return Event.findAll({
            where: {aggregate_id: profile.id},
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
              url: `/users/${request.params.userId}/profile?as_of=${as_of}`
            }
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/profiles',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Profile.findOne({where: {user_id: request.payload.user_id, deleted_at: null}})
        .then(existingProfile => {
          if (existingProfile) throw server.plugins.errors.profileAlreadyExists

          const profile = Profile.build()
          request.payload.id = profile.id

          const ProfileCreatedEvent = new Events.PROFILE_CREATED(request.payload)

          return profile.process(ProfileCreatedEvent.type, ProfileCreatedEvent)
          .then(() => {
            server.emit('KB', ProfileCreatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.profileCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'PATCH',
    path: '/users/{userId}/profile',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Profile.findOne({where: {user_id: request.params.userId, deleted_at: null}})
        .then(profile => {
          if (!profile) throw server.plugins.errors.profileNotFound

          const ProfileUpdatedEvent = new Events.PROFILE_UPDATED(
            profile.id,
            request.payload
          )

          return profile.process(ProfileUpdatedEvent.type, ProfileUpdatedEvent.toJSON())
          .then(() => {
            server.emit('KB', ProfileUpdatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.profileUpdate
      }
    }
  }, {
    method: 'POST',
    path: '/users/{userId}/profile/verify-identity',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Profile.findOne({where: {user_id: request.params.userId, deleted_at: null}})
        .then(profile => {
          if (!profile) throw server.plugins.errors.profileNotFound
          else if (profile.identity_verified) throw server.plugins.errors.profileAlreadyVerified

          const ProfileIdentityVerifiedEvent = new Events.PROFILE_IDENTITY_VERIFIED(profile.id)

          return profile.process(
            ProfileIdentityVerifiedEvent.type,
            ProfileIdentityVerifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ProfileIdentityVerifiedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/users/{userId}/profile/unverify-identity',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Profile.findOne({where: {user_id: request.params.userId, deleted_at: null}})
        .then(profile => {
          if (!profile) throw server.plugins.errors.profileNotFound
          else if (!profile.identity_verified) throw server.plugins.errors.profileNotVerified

          const ProfileIdentityUnverifiedEvent = new Events.PROFILE_IDENTITY_UNVERIFIED(profile.id)

          return profile.process(
            ProfileIdentityUnverifiedEvent.type,
            ProfileIdentityUnverifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ProfileIdentityUnverifiedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/users/{userId}/profile/verify-citizenship',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Profile.findOne({where: {user_id: request.params.userId, deleted_at: null}})
        .then(profile => {
          if (!profile) throw server.plugins.errors.profileNotFound
          else if (profile.citizenship_verified) throw server.plugins.errors.profileAlreadyVerified

          const ProfileCitizenshipVerifiedEvent = new Events.PROFILE_CITIZENSHIP_VERIFIED(profile.id)

          return profile.process(
            ProfileCitizenshipVerifiedEvent.type,
            ProfileCitizenshipVerifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ProfileCitizenshipVerifiedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/users/{userId}/profile/unverify-citizenship',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Profile.findOne({where: {user_id: request.params.userId, deleted_at: null}})
        .then(profile => {
          if (!profile) throw server.plugins.errors.profileNotFound
          else if (!profile.citizenship_verified) throw server.plugins.errors.profileNotVerified

          const ProfileCitizenshipUnverifiedEvent = new Events.PROFILE_CITIZENSHIP_UNVERIFIED(profile.id)

          return profile.process(
            ProfileCitizenshipUnverifiedEvent.type,
            ProfileCitizenshipUnverifiedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ProfileCitizenshipUnverifiedEvent)
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/users/{userId}/profile/attach-current-address',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        let profile
        Profile.findOne({where: {user_id: request.params.userId, deleted_at: null}})
        .then(_profile => {
          profile = _profile
          if (!profile) throw server.plugins.errors.profileNotFound
          return Address.findOne({
            where: {
              id: request.payload.address_id, 
              user_id: request.params.userId,
              deleted_at: null
            }
          })
        })
        .then(address => {
          if (!address) throw server.plugins.errors.addressNotFound
          
          const ProfileCurrentAddressAttachedEvent = new Events.PROFILE_CURRENT_ADDRESS_ATTACHED(profile.id, address.id)

          return profile.process(
            ProfileCurrentAddressAttachedEvent.type,
            ProfileCurrentAddressAttachedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', ProfileCurrentAddressAttachedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.profileAttachCurrentAddress
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'profiles',
  version: '1.0.0'
}
