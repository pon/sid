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

  modelsExport.Address.belongsTo(modelsExport.State, {foreignKey: 'state_id'})
  modelsExport.State.hasMany(modelsExport.Address, {foreignKey: 'state_id'})

  modelsExport.Lease.belongsTo(modelsExport.Address, {foreignKey: 'address_id'})
  modelsExport.Address.hasMany(modelsExport.Lease, {foreignKey: 'address_id'})

  modelsExport.Application.belongsTo(modelsExport.CreditReport, {foreignKey: 'credit_report_id'})
  modelsExport.CreditReport.hasMany(modelsExport.Application, {foreignKey: 'credit_report_id'})

  modelsExport.Application.belongsToMany(modelsExport.Income, {
    as: 'Incomes',
    through: modelsExport.ApplicationIncome,
    foreignKey: 'application_id',
    otherKey: 'income_id'
  })

  modelsExport.Income.belongsToMany(modelsExport.Application, {
    as: 'Applications',
    through: modelsExport.ApplicationIncome,
    foreignKey: 'income_id',
    otherKey: 'application_id'
  })

  modelsExport.Application.belongsTo(modelsExport.Lease, {foreignKey: 'lease_id'})
  modelsExport.Lease.hasMany(modelsExport.Application, {foreignKey: 'lease_id'})

  return modelsExport
}
