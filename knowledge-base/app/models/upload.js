const Sequelize = require('sequelize')

module.exports = db => {
  return db.define('upload', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false
    },
    user_id: {type: Sequelize.STRING(255), allowNull: false},
    file_name: {type: Sequelize.STRING(255), allowNull: false},
    bucket_name: {type: Sequelize.STRING(255), allowNull: false},
    path: {type: Sequelize.STRING(255), allowNull: false},
    content_type: {type: Sequelize.STRING(255), allowNull: false},
    category: {type: Sequelize.STRING(255), allowNull: false},
    deleted_at: {type: Sequelize.DATE}
  }, {
    paranoid: false,
    deletedAt: false,
    instanceMethods: {
      process: function (eventType, event, inMemory = false) {
        switch (eventType) {
          case 'UPLOAD_CREATED':
            this.id = event.id
            this.user_id = event.user_id
            this.file_name = event.file_name
            this.bucket_name = event.bucket_name
            this.path = event.path
            this.content_type = event.content_type
            this.category = event.category
            if (!inMemory) return this.save()
            break
          case 'UPLOAD_DELETED':
            this.deleted_at = event.deleted_at
            if (!inMemory) return this.save()
            break
          case 'UPLOAD_RESTORED':
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
