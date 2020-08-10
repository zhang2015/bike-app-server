var mongoose = require('mongoose')
var Schema = mongoose.Schema
 
var usersSchema = new Schema({
  'username': String,
  'password': String,
  'nickname': String,
  'avatarurl': String,
  'userid': String,
  'slogan': String,
  'age': Number,
  'createtime': Number,
  'phone': String,
  'email': String,
  'gender': Number,
  'province': String,
  'city': String,
  'country': String,
  'follow': Number,
  'followlist': Array,
  'benoticed': Number,
  'benoticedlist': Array
})
 
module.exports = mongoose.model('Users', usersSchema)