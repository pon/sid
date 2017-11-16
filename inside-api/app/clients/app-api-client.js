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

class AppApiClient {
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

  getUserEmail(userId) {
    return this._get(`/users/${userId}/email`, {json: true})
    .then(res => res.body)
  }
}

module.exports = AppApiClient
