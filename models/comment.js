var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commentSchema = new Schema({
  'userid': String,
  'createtime': Number,
  'thumbs': Number,
  'imgurl': Array,
  'content': String,
  'commentid': String,
  'dynamicsid': String,
  'nickname': String,
  'username': String,
  'avatarurl': String,
  'country': String
})

module.exports = mongoose.model('Comments', commentSchema)