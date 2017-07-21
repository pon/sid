const Boom    = require('boom')
const fs      = require('fs')
const moment  = require('moment')
const P       = require('bluebird')

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
      payload: {
        allow: 'multipart/form-data'
      },
      handler: (request, reply) => {
        if (!Array.isArray(request.payload.incomes)) {
          request.payload.incomes = [request.payload.incomes]
        }
        let application
        return P.all([
          KBClient.updateProfile(request.auth.credentials.id, {
            date_of_birth: request.payload.date_of_birth,
            citizenship: request.payload.citizenship,
            years_of_employment: request.payload.years_of_employment
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
          const end_date = moment(request.payload.start_date)
                            .add(request.payload.term_months, 'months')
          return P.all([
            KBClient.createLease({
              user_id: request.auth.credentials.id,
              address_id: address.id,
              security_deposit: request.payload.security_deposit,
              monthly_rent: request.payload.monthly_rent,
              start_date: request.payload.start_date,
              end_date: end_date,
              term_months: request.payload.term_months
            }),
            KBClient.createIncomes(request.payload.incomes.map(income => {
              return {
                user_id: request.auth.credentials.id,
                income_type: income.income_type,
                employer_name: income.employer_name !== '' ? income.employer_name : undefined,
                stated_income: income.stated_income
              }
            }))
          ])
        }).spread((lease, incomes) => {
          return P.all([
            KBClient.applicationAttachIncomes(request.payload.application_id, incomes.map(income => income.id)),
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

        return P.map(request.payload.files, (file, idx) => {
          return KBClient.createUpload(request.auth.credentials.id, file, request.payload.categories[idx])
          .tap(() => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path)
            }
          })
        })
        .then(uploads => {
          return KBClient.applicationAttachUploads(request.payload.application_id, uploads.map(upload => upload.id))
        }).then(() => {
          return P.props({
            application: KBClient.getApplication(request.payload.application_id),
            profile: KBClient.getProfile(request.auth.credentials.id)
          })
        })
        .asCallback(reply)
      },
      validate: {
        payload: server.plugins.schemas.applyStepThree,
        options: {stripUnknown: true}
      }
    }
  }, {
    method: 'POST',
    path: '/apply/step-four',
    config: {
      tags: ['api'],
      handler: (request, reply) => {
        return KBClient.updateProfile(request.auth.credentials.id, {
          social_security_number: request.payload.social_security_number
        })
        .then(() => {
          return KBClient.applicationApply(request.payload.application_id)
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
        payload: server.plugins.schemas.applyStepFour,
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
