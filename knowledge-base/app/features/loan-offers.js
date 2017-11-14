const Joi     = require('joi')
const moment  = require('moment')
const P       = require('bluebird')

exports.register = (server, options, next) => {

  const Events = options.events

  const Application = server.plugins.db.models.Application
  const LoanOffer   = server.plugins.db.models.LoanOffer

  server.route([{
    method: 'GET',
    path: '/loan-offers/{loanOfferId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        P.resolve()
        .then(() => {
          if (!request.query.as_of) {
            return LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
            .then(loanOffer => {
              if (!loanOffer) throw server.plugins.errors.loanOfferNotFound
              return loanOffer
            })
          }

          return Event.findAll({
            where: {aggregate_id: request.params.loanOfferId},
            order: [['id', 'ASC']]
          })
          .filter(event => {
            return event.created_at.getTime() <= request.query.as_of
          })
          .then(events => {
            if (!events.length) throw server.plugins.errors.loanOfferNotFound
            const loanOffer = LoanOffer.build()
            events.forEach(event => {
              loanOffer.process(event.type, event.payload, true)
            })

            return loanOffer
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid},
        query: server.plugins.schemas.asOfQuery
      }
    }
  }, {
    method: 'GET',
    path: '/applications/{applicationId}/loan-offer',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {application_id: request.params.applicationId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound
          return loanOffer
        })
        .asCallback(reply)
      },
      validate: {
        params: {applicationId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'GET',
    path: '/loan-offers/{loanOfferId}/events',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Event.findAll({
          where: {aggregate_id: request.params.loanOfferId},
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
            url: `/loan-offers/${request.params.loanOfferId}?as_of=${as_of}`
          }
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        Application.findOne({where: {id: request.payload.application_id, deleted_at: null}})
        .then(application => {
          if (!application) throw server.plugins.errors.applicationNotFound

          return LoanOffer.findAll({where: {application_id: request.payload.application_id, deleted_at: null}})
          .then(offers => {
            if (offers.length !== 0) {
              throw server.plugins.errors.loanOfferAlreadyExists
            }

            const loanOffer = LoanOffer.build()

            request.payload.id = loanOffer.id
            request.payload.expires_at = moment().add(7, 'days')

            const LoanOfferCreatedEvent = new Events.LOAN_OFFER_CREATED(request.payload)

            return loanOffer.process(LoanOfferCreatedEvent.type, LoanOfferCreatedEvent.toJSON())
            .then(() => {
              server.emit('KB', LoanOfferCreatedEvent)
              return loanOffer
            })
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.loanOfferCreate,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'PATCH',
    path: '/loan-offers/{loanOfferId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferUpdatedEvent = new Events.LOAN_OFFER_UPDATED(
            loanOffer.id,
            request.payload
          )

          return loanOffer.process(LoanOfferUpdatedEvent.type, LoanOfferUpdatedEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferUpdatedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid},
        payload: server.plugins.schemas.loanOfferUpdate
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/consent-to-esign',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferConsentToEsignEvent = new Events.LOAN_OFFER_CONSENT_TO_ESIGN(request.params.loanOfferId)
          return loanOffer.process(LoanOfferConsentToEsignEvent.type, LoanOfferConsentToEsignEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferConsentToEsignEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/withdraw-esign-consent',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferWithdrawEsignConsentEvent =
            new Events.LOAN_OFFER_WITHDRAW_ESIGN_CONSENT(request.params.loanOfferId)
          return loanOffer.process(
            LoanOfferWithdrawEsignConsentEvent.type,
            LoanOfferWithdrawEsignConsentEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', LoanOfferWithdrawEsignConsentEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/sign',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          if (!loanOffer.has_esign_consent) throw server.plugins.errors.loanOfferNotSignable

          const LoanOfferSignedEvent = new Events.LOAN_OFFER_SIGNED(request.params.loanOfferId, request.payload.signature)
          return loanOffer.process(LoanOfferSignedEvent.type, LoanOfferSignedEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferSignedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid},
        payload: server.plugins.schemas.loanOfferSign,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/unsign',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferUnsignedEvent = new Events.LOAN_OFFER_UNSIGNED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferUnsignedEvent.type, LoanOfferUnsignedEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferUnsignedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/revoke',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          if (loanOffer.status === 'SIGNED') throw server.plugins.errors.loanOfferAlreadySigned

          const LoanOfferRevokedEvent = new Events.LOAN_OFFER_REVOKED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferRevokedEvent.type, LoanOfferRevokedEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferRevokedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/unrevoke',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferUnrevokedEvent = new Events.LOAN_OFFER_UNREVOKED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferUnrevokedEvent.type, LoanOfferUnrevokedEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferUnrevokedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/reject',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          if (loanOffer.status === 'SIGNED') throw server.plugins.errors.loanOfferAlreadySigned

          const LoanOfferRejectedEvent = new Events.LOAN_OFFER_REJECTED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferRejectedEvent.type, LoanOfferRejectedEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferRejectedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/unreject',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferUnrejectedEvent = new Events.LOAN_OFFER_UNREJECTED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferUnrejectedEvent.type, LoanOfferUnrejectedEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferUnrejectedEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/expire',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          if (loanOffer.status === 'SIGNED') throw server.plugins.errors.loanOfferAlreadySigned

          const LoanOfferExpiredEvent = new Events.LOAN_OFFER_EXPIRED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferExpiredEvent.type, LoanOfferExpiredEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferExpiredEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/unexpire',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferUnexpiredEvent = new Events.LOAN_OFFER_UNEXPIRED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferUnexpiredEvent.type, LoanOfferUnexpiredEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferUnexpiredEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'DELETE',
    path: '/loan-offers/{loanOfferId}',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferDeletedEvent= new Events.LOAN_OFFER_DELETED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferDeletedEvent.type, LoanOfferDeletedEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferDeletedEvent)
          })
          .asCallback(reply)
        })
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/restore',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({
          where: {
            id: request.params.loanOfferId,
            deleted_at: {$ne: null}
          }
        })
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound

          const LoanOfferRestoredEvent = new Events.LOAN_OFFER_RESTORED(request.params.loanOfferId)
          return loanOffer.process(LoanOfferRestoredEvent.type, LoanOfferRestoredEvent.toJSON())
          .then(() => {
            server.emit('KB', LoanOfferRestoredEvent)
          })
        })
        .asCallback(reply)
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid}
      }
    }
  }, {
    method: 'POST',
    path: '/loan-offers/{loanOfferId}/update-current-step',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        LoanOffer.findOne({where: {id: request.params.loanOfferId, deleted_at: null}})
        .then(loanOffer => {
          if (!loanOffer) throw server.plugins.errors.loanOfferNotFound
          else if (loanOffer.status !== 'AWAITING_SIGNATURE') {
            throw server.plugins.errors.loanOfferInvalidStatusToUpdateStep
          }          
          
          const LoanOfferCurrentStepUpdatedEvent = new Events.LOAN_OFFER_CURRENT_STEP_UPDATED(
            loanOffer.id,
            request.payload.current_step
          )

          return loanOffer.process(
            LoanOfferCurrentStepUpdatedEvent.type,
            LoanOfferCurrentStepUpdatedEvent.toJSON()
          )
          .then(() => {
            server.emit('KB', LoanOfferCurrentStepUpdatedEvent)
            return loanOffer
          })
        })
        .asCallback(reply) 
      },
      validate: {
        params: {loanOfferId: server.plugins.schemas.uuid},
        payload: server.plugins.schemas.loanOfferUpdateCurrentStep
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'loan-offers',
  version: '1.0.0'
}
