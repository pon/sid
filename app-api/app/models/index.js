const requireDirectory = require('require-directory')
const models = requireDirectory(module)

module.exports = function (db) {
  const modelsExport = {}

  Object.getOwnPropertyNames(models).map(model => {
    const key = model.split('-').map(split => {
      return split.charAt(0).toUpperCase() + split.slice(1)
    }).join('')

    modelsExport[key] = models[model](db)
  })

  modelsExport.User.hasMany(modelsExport.EmailVerification, {foreignKey: 'user_id'})
  modelsExport.EmailVerification.belongsTo(modelsExport.User, {foreignKey: 'user_id'})
  modelsExport.User.hasMany(modelsExport.PasswordReset, {foreignKey: 'user_id'})
  modelsExport.PasswordReset.belongsTo(modelsExport.User, {foreignKey: 'user_id'})

  return modelsExport
}
