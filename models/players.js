var mongoose = require('mongoose')
var Schema = mongoose.Schema
 
var playerSchema = new Schema({
  // 'playerId': {type: String},
  // 'playerName': String,
  // 'playerDesc': String,
  // 'playerImage': String
  // 'productId': {type: String},
  // 'productName': String,
  // 'salePrice': Number,
  // 'productImage': String
})
 
module.exports = mongoose.model('Player', playerSchema)