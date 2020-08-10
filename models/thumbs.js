var mongoose = require('mongoose')
var Schema = mongoose.Schema

var thumbsSchema = new Schema({
  'userid': String,
  'createtime': Number,
  'commentid': String,
  'dynamicsid': String,
  'nickname': String,
  'username': String,
  'avatarurl': String
})

module.exports = mongoose.model('Thumbs', thumbsSchema)