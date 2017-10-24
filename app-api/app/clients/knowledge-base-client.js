const fs      = require('fs')
const Joi     = require('joi')
const P       = require('bluebird')
const Request = require('request')

const pRequest = P.promisify(Request)

function InternalServer(message) {
  this.name = 'InternalServer';
  this.message = message || '';
  this.stack = (new Error()).stack;
}
InternalServer.prototype = Object.create(Error.prototype);

function NotFound(message) {
  this.name = 'NotFound';
  this.message = message || '';
  this.stack = (new Error()).stack;
}
NotFound.prototype = Object.create(Error.prototype);

function InvalidParameters(message) {
  this.name = 'InvalidParameters';
  this.message = message || '';
  this.stack = (new Error()).stack;
}
InvalidParameters.prototype = Object.create(Error.prototype);

function BadRequest(message) {
  this.name = 'BadRequest';
  this.message = message || '';
  this.stack = (new Error()).stack;
}
BadRequest.prototype = Object.create(Error.prototype);

class KnowledgeBaseClient {
  constructor(options) {
    const optionsSchema = {
      url: Joi.string().required(),
      logger: Joi.func().required()
    }

    const res = Joi.validate(options, optionsSchema)
    if (res.error) {
      throw new Error(`Invalid Options: ${res.error.message}`)
    }

    this.options = options

    this.InternalServer     = InternalServer
    this.NotFound           = NotFound
    this.InvalidParameters  = InvalidParameters
    this.BadRequest         = BadRequest
  }

  _sendReq(opts) {
    opts.uri = this.options.url + opts.uri

    let log = {
      options: opts,
      error: null,
      statusCode: null
    }

    return pRequest(opts)
    .tap(response => {
      log.statusCode = response.statusCode
      if (response.statusCode >= 400) {
        log.error = response.body
      }
    })
    .then(response => {
      if (response.statusCode >= 500) {
        throw new this.InternalServer()
      } else if (response.statusCode === 404) {
        throw new this.NotFound(response.body.message || '')
      } else if (response.statusCode === 400) {
        throw new this.BadRequest(response.body.message || '')
      }

      return response
    })
    .finally(() => {
      if (log.options && log.options.formData && log.options.formData.file) {
        log.options.formData.file = '[REDACTED]'
      }
      this.options.logger(log)
    })
  }

   _get(uri, options) {
    options = options || {};
    options.uri = uri;
    options.method = 'GET';
    return this._sendReq(options);
  }

  _patch(uri, options) {
    options = options || {};
    options.uri = uri;
    options.method = 'PATCH';
    return this._sendReq(options);
  }

  _post(uri, options) {
    options = options || {};
    options.uri = uri;
    options.method = 'POST';
    return this._sendReq(options);
  }

  _delete(uri, options) {
    options = options || {};
    options.uri = uri;
    options.method = 'DELETE';
    return this._sendReq(options);
  }

  ping() {
    return this._get('/ping').then(res => res.body)
  }

  getAddress(addressId, asOf) {
    return this._get(
      `/addresses/${addressId}`,
      asOf ? {json: true, qs: {as_of: asOf}} : {json: true}
    )
    .then(res => res.body)
  }

  getAddressEvents(addressId) {
    return this._get(`/addresses/${addressId}/events`, {json: true})
    .then(res => res.body)
  }

  createAddress(address) {
    return this._post('/addresses', {body: address, json: true})
    .then(res => res.body)
  }

  deleteAddress(addressId) {
    return this._delete(`/addresses/${addressId}`)
  }

  updateAddress(addressId, updates) {
    return this._patch(`/addresses/${addressId}`, {body: updates, json: true})
  }

  restoreAddress(addressId) {
    return this._post(`/addresses/${addressId}/restore`)
  }

  createIncomes(incomes) {
    return P.map(incomes, income => {
      return this._post('/incomes', {body: income, json: true})
      .then(res => res.body)
    })
  }

  getIncome(incomeId, asOf) {
    return this._get(
      `/incomes/${incomeId}`,
      asOf ? {json: true, qs: {as_of: asOf}} : {json: true}
    )
    .then(res => res.body)
  }

  createLease(lease) {
    return this._post('/leases', {body: lease, json: true})
    .then(res => res.body)
  }

  updateLease(leaseId, updates) {
    return this._patch(`/leases/${leaseId}`, {body: updates, json: true})
  }

  leaseAttachLandlord(leaseId, landlordId) {
    return this._post(`/leases/${leaseId}/attach_landlord`, {
      body: {landlord_id: landlordId},
      json: true
    })
  }

  getLease(leaseId, asOf) {
    return this._get(
      `/leases/${leaseId}`,
      asOf ? {json: true, qs: {as_of: asOf}} : {json: true}
    )
    .then(res => res.body)
    .then(lease => {
      if (!lease.address_id) return lease
      return this.getAddress(lease.address_id)
      .then(address => {
        lease.address = address
        return lease
      })
    })
    .then(lease => {
      if (!lease.landlord_id) return lease
      return this.getLandlord(lease.landlord_id)
      .then(landlord => {
        lease.landlord = landlord
        return lease
      })
    })
  }

  deleteLease(leaseId) {
    return this._delete(`/leases/${leaseId}`)
  }

  getLeaseEvents(leaseId) {
    return this._get(`/leases/${leaseId}/events`, {json: true})
    .then(res => res.body)
  }

  restoreLease(leaseId) {
    return this._post(`/leases/${leaseId}/restore`)
  }

  createCreditReport(creditReport) {
    return this._post('/credit-reports', {body: creditReport, json: true})
  }

  deleteCreditReport(creditReportId) {
    return this._delete(`/credit-reports/${creditReportId}`)
  }

  getCreditReport(creditReportId, asOf) {
    return this._get(
      `/credit-reports/${creditReportId}`,
      asOf ? {json: true, qs: {as_of: asOf}} : {json: true}
    )
    .then(res => res.body)
  }

  getCreditReportEvents(creditReportId) {
    return this._get(`/credit-reports/${creditReportId}/events`, {json: true})
    .then(res => res.body)
  }

  createUpload(userId, file, category) {
    return this._post('/uploads', {
      formData: {
        user_id: userId,
        file: {
          value:  fs.createReadStream(file.path),
          options: {
            filename: file.filename,
            contentType: file.headers['content-type']
          }
        },
        category: category
      },
      json: true
    })
    .then(res => res.body)
  }

  deleteUpload(uploadId) {
    return this._delete(`/uploads/${uploadId}`)
  }

  restoreUpload(uploadId) {
    return this._post(`/uploads/${uploadId}/restore`)
  }

  getUploadEvents(uploadId) {
    return this._get(`/uploads/${uploadId}/events`, {json: true})
    .then(res => res.body)
  }

  getUserUploads(userId) {
    return this._get(`/users/${userId}/uploads`)
    .then(res => res.body)
  }

  getUpload(uploadId, asOf) {
    return this._get(
      `/uploads/${uploadId}`,
      asOf ? {json: true, qs: {as_of: asOf}} : {json: true}
    )
    .then(res => res.body)
  }

  createApplication(application) {
    return this._post('/applications', {body: application, json: true}).then(res => res.body)
  }

  getApplication(applicationId, asOf) {
    let application
    return this._get(
      `/applications/${applicationId}`,
      asOf ? {json: true, qs: {as_of: asOf}} : {json: true}
    )
    .then(res => res.body)
    .then(_application => {
      application = _application
      return P.all([
        _application.income_ids && P.map(_application.income_ids, incomeId => {
          return this.getIncome(incomeId)
        }),
        _application.lease_id && this.getLease(_application.lease_id)
      ])
      .spread((incomes, lease) => {
        if (incomes) application.incomes = incomes
        if (lease) application.lease = lease

        return application
      })
    })
  }

  getApplicationEvents(applicationId) {
    return this._get(`/applications/${applicationId}/events`, {json: true})
    .then(res => res.body)
  }

  getUserApplications(userId) {
    return this._get(`/users/${userId}/applications`, {json: true}).then(res => res.body)
  }

  applicationApply(applicationId) {
    return this._post(`/applications/${applicationId}/apply`, {json: true}).then(res => res.body)
  }

  applicationAttachCreditReport(applicationId, creditReportId) {
    return this._post(`/applications/${applicationId}/attach_credit_report`, {
      body: {credit_report_id: creditReportId},
      json: true
    })
  }

  applicationAttachEmployment(applicationId, employmentId) {
    return this._post(`/applications/${applicationId}/attach_employment`, {
      body: {employment_id: employmentId},
      json: true
    })
  }

  applicationAttachIncomes(applicationId, incomeIds) {
    return this._post(`/applications/${applicationId}/attach_incomes`, {
      body: {income_ids: incomeIds},
      json: true
    })
  }

  applicationAttachUploads(applicationId, uploadIds) {
    return this._post(`/applications/${applicationId}/attach_uploads`, {
      body: {upload_ids: uploadIds},
      json: true
    })
  }

  applicationAttachLease(applicationId, leaseId) {
    return this._post(`/applications/${applicationId}/attach_lease`, {
      body: {lease_id: leaseId},
      json: true
    })
  }

  createProfile(profile) {
    return this._post('/profiles', {body: profile, json: true}).then(res => res.body)
  }

  getProfile(userId, asOf) {
    return this._get(
      `/users/${userId}/profile`,
      asOf ? {json: true, qs: {as_of: asOf}} : {json: true}
    )
    .then(res => res.body)
  }

  getProfileEvents(userId) {
    return this._get(`/users/${userId}/profile/events`, {json: true})
    .then(res => res.body)
  }

  updateProfile(userId, updates) {
    return this._patch(`/users/${userId}/profile`, {body: updates, json: true})
  }

  profileVerifyIdentity(userId) {
    return this._post(`/users/${userId}/profile/verify-identity`)
  }

  profileUnverifyIdentity(userId) {
    return this._post(`/users/${userId}/profile/unverify-identity`)
  }

  profileVerifyCitizenship(userId) {
    return this._post(`/users/${userId}/profile/verify-citizenship`)
  }

  profileUnverifyCitizenship(userId) {
    return this._post(`/users/${userId}/profile/unverify-citizenship`)
  }

  getApplicationLoanOffer(applicationId) {
    return this._get(`/applications/${applicationId}/loan-offer`, {json: true})
    .then(res => res.body)
  }

  getLandlord(landlordId, asOf) {
    return this._get(
      `/landlords/${landlordId}`,
      asOf ? {json: true, qs: {as_of: asOf}} : {json: true}
    )
    .then(res => res.body)
  }

  getLandlordEvents(landlordId) {
    return this._get(`/landlords/${landlordId}/events`, {json: true})
    .then(res => res.body)
  }

  createLandlord(landlord) {
    return this._post('/landlords', {body: landlord, json: true})
    .then(res => res.body)
  }

  updateLandlord(landlordId, updates) {
    return this._patch(`/landlords/${landlordId}`, {body: updates, json: true})
  }

  deleteLandlord(landlordId) {
    return this._delete(`/landlords/${landlordId}`)
  }

  restoreLandlord(landlordId) {
    return this._post(`/landlords/${landlordId}/restore`)
  }

  verifyLandlord(landlordId) {
    return this._post(`/landlords/${landlordId}/verify`)
  }

  unverifyLandlord(landlordId) {
    return this._post(`/landlords/${landlordId}/unverify`)
  }
}

module.exports = KnowledgeBaseClient
