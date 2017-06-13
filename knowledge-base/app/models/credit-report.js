const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('credit_report', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false
    },
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    provider: {type: Sequelize.ENUM('EXPERIAN'), defaultValue: 'EXPERIAN', allowNull: false},
    raw_credit_report: {type: Sequelize.JSON, allowNull: false},
    fico_score: {type: Sequelize.INTEGER, allowNull: false},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'CREDIT_REPORT_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.raw_credit_report = event.raw_credit_report
            this.fico_score = event.fico_score
            if (!inMemory) return this.save()
            break
          case 'CREDIT_REPORT_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'CREDIT_REPORT_RESTORED':
            this.deleted_at = null
            if (!inMemory) return this.save()
            break
          default:
            console.log(eventType, 'event not supported')
        }
      }
    }
  })
}
