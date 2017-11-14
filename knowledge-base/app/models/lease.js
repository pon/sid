const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('lease', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false
    },
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    address_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {model: 'addresses', key: 'id'}
    },
    landlord_id: {
      type: Sequelize.UUID,
      references: {model: 'landlords', key: 'id'}
    },
    security_deposit: {type: Sequelize.INTEGER, allowNull: false},
    monthly_rent: {type: Sequelize.INTEGER, allowNull: false},
    start_date: {type: Sequelize.DATE, allowNull: false},
    end_date: {type: Sequelize.DATE, allowNull: false},
    term_months: {type: Sequelize.INTEGER, allowNull: false},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      toJSON: function () {
        return {
          id: this.id,
          user_id: this.user_id,
          address_id: this.address_id,
          landlord_id: this.landlord_id,
          security_deposit: this.security_deposit,
          monthly_rent: this.monthly_rent,
          start_date: this.start_date,
          end_date: this.end_date,
          term_months: this.term_months,
          upload_ids: this.uploads ? this.uploads.map(upload => upload.id) : this.upload_ids,
          created_at: this.created_at,
          updated_at: this.updated_at,
          deleted_at: this.deleted_at
        } 
      },
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'LEASE_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.address_id = event.address_id
            this.security_deposit = event.security_deposit
            this.monthly_rent = event.monthly_rent
            this.start_date = event.start_date
            this.end_date = event.end_date
            this.term_months = event.term_months
            if (!inMemory) return this.save()
            break
          case 'LEASE_UPDATED':
            [
              'security_deposit',
              'monthly_rent',
              'start_date',
              'end_date',
              'term_months'
            ].forEach(key => {
              if (event[key] !== undefined) {
                this[key] = event[key]
              }
            })
            if (!inMemory) return this.save()
            break
          case 'LEASE_LANDLORD_ATTACHED':
            this.landlord_id = event.landlord_id
            if (!inMemory) return this.save()
            break
          case 'LEASE_UPLOADS_ATTACHED':
            this.upload_ids = this.upload_ids || []
            event.upload_ids.map(uploadId => {
              this.upload_ids.push(uploadId)
              this.addUpload(uploadId)
            })
            if (!inMemory) return this.save()
            break
          case 'LEASE_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'LEASE_RESTORED':
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
