const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('loan_offer', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false
    },
    application_id: {type: Sequelize.STRING(255), allowNull: false},
    status: {
        type: Sequelize.ENUM('AWAITING_SIGNATURE', 'REJECTED', 'REVOKED', 'EXPIRED', 'AGREED'),
      allowNull: false
    },
    interest_rate: {type: Sequelize.INTEGER, allowNull: false},
    interest_rate_type: {type: Sequelize.ENUM('interest_only_fixed'), allowNull: false},
    term_in_months: {type: Sequelize.INTEGER, allowNull: true},
    principal_amount: {type: Sequelize.INTEGER, allowNull: false},
    expires_at: {type: Sequelize.DATE, allowNull: false},
    has_esign_consent: {type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    signature: {type: Sequelize.STRING(255), allowNull: true},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'LOAN_OFFER_CREATED':
            this.id = event.id
            this.application_id = event.application_id
            this.status = event.status
            this.interest_rate = event.interest_rate
            this.interest_rate_type = event.interest_rate_type
            this.term_in_months = event.term_in_months
            this.principal_amount = event.principal_amount
            this.expires_at = event.expires_at
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_UPDATED':
            [
              'interest_rate',
              'interest_rate_type',
              'term_in_months',
              'principal_amount',
              'expires_at'
            ].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_CONSENT_TO_ESIGN':
            this.has_esign_consent = true
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_WITHDRAW_ESIGN_CONSENT':
            this.has_esign_consent = false
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_SIGNED':
            this.signature = event.signature
            this.status = 'AGREED'
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_UNSIGNED':
            this.signature = null
            this.status = 'AWAITING_SIGNATURE'
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_REJECTED':
            this.status = 'REJECTED'
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_UNREJECTED':
            this.status = 'AWAITING_SIGNATURE'
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_REVOKED':
            this.status = 'REVOKED'
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_UNREVOKED':
            this.status = 'AWAITING_SIGNATURE'
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_EXPIRED':
            this.status = 'EXPIRED'
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_UNEXPIRED':
            this.status = 'AWAITING_SIGNATURE'
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'LOAN_OFFER_RESTORED':
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
