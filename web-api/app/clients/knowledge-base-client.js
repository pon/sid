const Joi     = require('joi')
const P       = require('bluebird')
const Request = require('request')

const pRequest = P.promisify(Request)

function InternalServer(message) {
  this.name = 'InternalServer';
  this.message = message || '';
  this.stack = (new Error()).stack;
}
InternalServer.prototype = Error.prototype;

function NotFound(message) {
  this.name = 'NotFound';
  this.message = message || '';
  this.stack = (new Error()).stack;
}
NotFound.prototype = Error.prototype;

function InvalidParameters(message) {
  this.name = 'InvalidParameters';
  this.message = message || '';
  this.stack = (new Error()).stack;
}
InvalidParameters.prototype = Error.prototype;

function BadRequest(message) {
  this.name = 'BadRequest';
  this.message = message || '';
  this.stack = (new Error()).stack;
}
BadRequest.prototype = Error.prototype;

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
      asOf ? {json: true, as_of: asOf} : {json: true}
    )
    .then(res => res.body)
  }

  getAddressEvents(addressId) {
    return this._get(`/addresses/${addressId}/events`, {json: true})
    .then(res => res.body)
  }

  createAddress(address) {
    return this._post('/addresses', {body: address, json: true})
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

  createEmployment(employment) {
    return this._post('/employments', {body: employment, json: true})
  }

  updateEmployment(employmentId, updates) {
    return this._patch(`/employments/${employmentId}`, {body: updates, json: true})
  }

  getEmployment(employmentId, asOf) {
    return this._get(
      `/employments/${employmentId}`,
      asOf ? {json: true, as_of: asOf} : {json: true}
    )
    .then(res => res.body)
  }

  deleteEmployment(employmentId) {
    return this._delete(`/employments/${employmentId}`)
  }

  getEmploymentEvents(employmentId) {
    return this._get(`/employments/${employmentId}/events`, {json: true})
    .then(res => res.body)
  }

  restoreEmployment(employmentId) {
    return this._post(`/employments/${employmentId}/restore`)
  }

  verifyEmployment(employmentId, body) {
    return this._post(`/employments/${employmentId}/verify`, {body: body, json: true})
  }

  unverifyEmployment(employmentId) {
    return this._post(`/employments/${employmentId}/unverify`)
  }

  createLease(lease) {
    return this._post('/leases', {body: lease, json: true})
  }

  updateLease(leaseId, updates) {
    return this._patch(`/leases/${leaseId}`, {body: updates, json: true})
  }

  getLease(leaseId, asOf) {
    return this._get(
      `/leases/${leaseId}`,
      asOf ? {json: true, as_of: asOf} : {json: true}
    )
    .then(res => res.body)
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
      asOf ? {json: true, as_of: asOf} : {json: true}
    )
    .then(res => res.body)
  }

  getCreditReportEvents(creditReportId) {
    return this._get(`/credit-reports/${creditReportId}/events`, {json: true})
    .then(res => res.body)
  }

  createUpload(userId, file) {
    return this._post('/uploads', {
      formData: {user_id: userId, file: file}
    })
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
      asOf ? {json: true, as_of: asOf} : {json: true}
    )
    .then(res => res.body)
  }

  createApplication(application) {
    return this._post('/applications', {body: application, json: true})
  }

  getApplication(applicationId, asOf) {
    return this._get(
      `/applications/${applicationId}`,
      asOf ? {json: true, as_of: asOf} : {json: true}
    )
    .then(res => res.body)
  }

  getApplicationEvents(applicationId) {
    return this._get(`/applications/${applicationId}/events`, {json: true})
    .then(res => res.body)
  }

  getUserApplications(userId) {
    return this._get(`/users/${userId}/applications`).then(res => res.body)
  }

  applicationApply(applicationId) {
    return this._post(`/applications/${applicationId}/apply`)
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

  applicationAttachLease(applicationId, leaseId) {
    return this._post(`/applications/${applicationId}/attach_lease`, {
      body: {lease_id: leaseId},
      json: true
    })
  }
}

module.exports = KnowledgeBaseClient
