var mongoose = require('mongoose')
var Schema = mongoose.Schema

var dynamicsSchema = new Schema({
  'userid': String,
  'createtime': Number,
  'thumbs': Number,
  "thumbslist": Array,
  'collect': Number,
  'forward': Number,
  'imgurl': Array,
  'comment': Number,
  'commentlist': Array,
  'content': String,
  'dynamicsid': String,
  'nickname': String,
  'username': String,
  'avatarurl': String,
  'country': String
})

module.exports = mongoose.model('Dynamics', dynamicsSchema)