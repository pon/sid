exports.register = (server, options, next) => {

  const Plaid = require('plaid')

  const PlaidClient = new Plaid.Client(
    options.plaidClientId, 
    options.plaidSecret, 
    options.plaidKey,
    Plaid.environments[options.plaidEnvironment]
  )

  server.expose({
    PlaidClient: PlaidClient
  })

  next()
}

exports.register.attributes = {
  name: 'plaid',
  version: '1.0.0'
}
