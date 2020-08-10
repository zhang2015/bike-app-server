var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')
// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mytest')

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected success.')
})

mongoose.connection.on('error', () => {
  console.log('MongoDB connected fail.')
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connected disconnected.')
})

// 查询商品列表数据
router.get("/", (req, res, next) => {
  // 接受前端传来的参数
  let id = req.param('id')
  console.log(id)
  let goodsModel = Goods.deleteOne(
    { 'id': id } //查找条件
  )
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: 'success',
        result: {
        }
      })
    }
  })
})

module.exports = router;