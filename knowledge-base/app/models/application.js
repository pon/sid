const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('application', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false
    },
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    status: {
      type: Sequelize.ENUM('APPLYING', 'VERIFYING', 'UNDERWRITING', 'APPROVED', 'DECLINED'),
      allowNull: false
    },
    credit_report_id: {type: Sequelize.UUID, references: {model: 'credit_reports', key: 'id'}},
    employment_id: {type: Sequelize.UUID, references: {model: 'employments', key: 'id'}},
    lease_id: {type: Sequelize.UUID, references: {model: 'leases', key: 'id'}},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'APPLICATION_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.status = event.status
            this.credit_report_id = event.credit_report_id
            this.employment_id = event.employment_id
            this.lease_id = event.lease_id
            if (!inMemory) return this.save()
            break
          case 'APPLICATION_CREDIT_REPORT_ATTACHED':
            this.credit_report_id = event.credit_report_id
            if (!inMemory) return this.save()
            break
          case 'APPLICATION_EMPLOYMENT_ATTACHED':
            this.employment_id = event.employment_id
            if (!inMemory) return this.save()
            break
          case 'APPLICATION_LEASE_ATTACHED':
            this.lease_id = event.lease_id
            if (!inMemory) return this.save()
            break
          case 'APPLICATION_APPLIED':
            this.status = 'VERIFYING'
            if (!inMemory) return this.save()
            break
          case 'APPLICATION_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'APPLICATION_RESTORED':
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
