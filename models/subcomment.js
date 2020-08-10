var mongoose = require('mongoose')
var Schema = mongoose.Schema

var subcommentSchema = new Schema({
  'from': String,
  'to': String,
  'createtime': Number,
  'content': String,
  'subcommentid': String,
  'commentid': String,
  'dynamicsid': String,
  'fromnickname': String,
  'fromusername': String,
  'tonickname': String,
  'tousername': String
})

module.exports = mongoose.model('Subcomments', subcommentSchema)