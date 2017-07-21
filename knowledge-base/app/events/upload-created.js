'use strict'

module.exports = class UploadCreated {
  constructor(args) {
    this._type = 'UPLOAD_CREATED'
    this._id = args.id
    this._user_id = args.user_id
    this._file_name = args.file_name
    this._bucket_name = args.bucket_name
    this._path =args.path
    this._content_type = args.content_type
    this._category = args.category
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._user_id,
      file_name: this._file_name,
      bucket_name: this._bucket_name,
      path: this._path,
      content_type: this._content_type,
      category: this._category
    }
  }

  // Aggregate ID
  get aggregateId() {return this._id}

  // Basic Getters
  get id() {return this._id}
  get type() {return this._type}
  get user_id() {return this._user_id}
  get file_name() {return this._file_name}
  get bucket_name() {return this._bucket_name}
  get path() {return this._path}
  get content_type() {return this._content_type}
  get category() {return this._category}
}
