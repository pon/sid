const Boom  = require('boom')
const P     = require('bluebird')

exports.register = (server, options, next) => {

  const KBClient = server.plugins.clients.KnowledgeBaseClient
  const User     = server.plugins.db.models.User

  server.route([{
    method: 'GET',
    path: '/apply',
    config: {
      tags: ['api'],
      auth: {strategy: 'jwt', mode: 'try'},
      handler: (request, reply) => {
        return P.resolve()
        .then(() => {
          if (!request.auth.isAuthenticated) {
            return null
          }

          return KBClient.getUserApplications(request.auth.credentials.id)
          .filter(app => app.status === 'APPLYING')
          .then(apps => apps[0])
          .then(app => {
            if (!app) return null

            return P.props({
              application: KBClient.getApplication(app.id),
              profile: KBClient.getProfile(request.auth.credentials.id)
            })
          })
        })
        .asCallback(reply)
      }
    }
  }, {
    method: 'POST',
    path: '/apply/step-one',
    config: {
      tags: ['api'],
      auth: {strategy: 'jwt', mode: 'try'},
      handler: (request, reply) => {
        let registerPayload
        return P.resolve()
        .then(() => {
          if (!request.auth.isAuthenticated) {
            return P.resolve(server.inject({
              method: 'POST',
              url: '/register',
              payload: {
                email: request.payload.email,
                password: request.payload.password
              }
            }))
            .then(res => {
              res.payload = JSON.parse(res.payload)
              if (res.statusCode === 200) {
                return res.payload
              } else if (res.statusCode === 400) {
                throw Boom.badRequest(res.payload.message)
              } else {
                throw Boom.internalServer()
              }
            })
            .then(payload => {
              registerPayload = payload
              return payload.user_id
            })
          }

          return request.auth.credentials.id
        })
        .then(userId => {
          return P.all([
            KBClient.createProfile({
              user_id: userId,
              first_name: request.payload.first_name,
              last_name: request.payload.last_name
            }),
            KBClient.createApplication({user_id: userId})
            .then(application => {
              return KBClient.getApplication(application.id)
            })
          ])
        })
        .spread((profile, application) => {
          registerPayload.profile = profile
          registerPayload.application = application
          return registerPayload
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.applyStepOne,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/apply/step-two',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        let application
        return P.all([
          KBClient.updateProfile(request.auth.credentials.id, {
            date_of_birth: request.payload.date_of_birth,
            citizenship: request.payload.citizenship
          }),
          KBClient.createAddress({
            user_id: request.auth.credentials.id,
            street_one: request.payload.street_one,
            street_two: request.payload.street_two,
            city: request.payload.city,
            state: request.payload.state,
            zip_code: request.payload.zip_code
          })
        ]).spread((_profile, address) => {
          return P.all([
            KBClient.createLease({
              user_id: request.auth.credentials.id,
              address_id: address.id,
              security_deposit: request.payload.security_deposit,
              monthly_rent: request.payload.monthly_rent,
              start_date: request.payload.start_date,
              end_date: request.payload.end_date,
              term_months: request.payload.term_months
            }),
            KBClient.createEmployment({
              user_id: request.auth.credentials.id,
              status: request.payload.status,
              employer_name: request.payload.employer_name,
              start_month: request.payload.start_month,
              start_year: request.payload.start_year,
              is_self_employed: request.payload.is_self_employed,
              stated_income: request.payload.stated_income
            })
          ])
        }).spread((lease, employment) => {
          return P.all([
            KBClient.applicationAttachEmployment(request.payload.application_id, employment.id),
            KBClient.applicationAttachLease(request.payload.application_id, lease.id)
          ])
        })
        .then(() => {
          return P.props({
            application: KBClient.getApplication(request.payload.application_id),
            profile: KBClient.getProfile(request.auth.credentials.id)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.applyStepTwo,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/apply/step-three',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return KBClient.applicationApply(request.payload.application_id)
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.applyStepThree,
        options: {stripUnknown: true}
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'apply',
  version: '1.0.0'
}
