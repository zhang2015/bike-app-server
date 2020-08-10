var mongoose = require('mongoose')
var Schema = mongoose.Schema

var collectSchema = new Schema({
  'userid': String,
  'createtime': Number, 
  'dynamicsid': String
})

module.exports = mongoose.model('Collects', collectSchema)