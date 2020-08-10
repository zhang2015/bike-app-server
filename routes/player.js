var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Players = require('../models/players')
var Users = require('../models/user')
var Dynamics = require('../models/dynamics')
var Collects = require('../models/collects')
var Comments = require('../models/comment')
var Subcomments = require('../models/subcomment')
var Thumbs = require('../models/thumbs')
const fs = require('fs');
const formidable = require('formidable');
// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/bikeapp')

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

  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param("sort")
  let skip = (page - 1) * pageSize
  let params = {};
  // let playersModel = Players.find(params).skip(skip).limit(pageSize)
  let playersModel = Players.find(params)
  playersModel.sort({ 'salePrice': sort })
  playersModel.exec((err, doc) => {
    console.log(doc)
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})
router.get("/detail", (req, res, next) => {

  let id = req.param('id')
  let playersModel = Players.find({ id: id })
  playersModel.exec((err, doc) => {
    console.log(doc)
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

router.post("/login", (req, res, next) => {

  console.log(req.body)
  let username = req.body.params.userName;
  let password = req.body.params.pass;
  console.log(username, password)
  let UsersModel = Users.find({ username: username })
  UsersModel.exec((err, doc) => {
    console.log(doc)
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc.length > 0) {
        let userInfo = doc[0]
        if (userInfo.password == password) {
          res.json({
            status: '0',
            msg: 'success',
            result: userInfo
          })
        } else {
          res.json({
            status: '1',
            msg: '密码错误'
          })
        }
      } else {
        let userid = makeUserId();
        let createtime = new Date().getTime();
        Users.create({
          username: username,
          password: password,
          nickname: '',
          avatarurl: '',
          userid: userid,
          slogan: '',
          age: 0,
          createtime: createtime,
          phone: '',
          email: '',
          gender: 0,
          province: '',
          city: '',
          country: '',
          follow: 0,
          benoticed: 0
        }, (err, doc) => {
          console.log(doc)
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            res.json({
              status: '0',
              msg: 'success',
              result: doc
            })
          }
        })
      }
    }
  })
})

router.post("/userInfo", (req, res, next) => {

  let userid = req.body.params.userid;
  let UsersModel = Users.find({ userid: userid })
  UsersModel.exec((err, doc) => {
    console.log(doc)
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc.length > 0) {
        let userInfo = doc[0]
        res.json({
          status: '0',
          msg: 'success',
          result: userInfo
        })
      } else {
        res.json({
          status: '1',
          msg: '没有该用户'
        })
      }
    }
  })
})

router.post("/updateUserInfo", (req, res, next) => {

  let userid = req.body.params.userid;
  console.log(req.body.params)
  let UsersModel = Users.updateOne({ userid: userid }, req.body.params)
  UsersModel.exec((err, doc) => {
    console.log(doc)
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: 'success',
      })
    }
  })
})

router.post("/uploadImg", (req, res, next) => {
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = '../../lalala/my-appa/public/service/';    //设置上传目录
  form.keepExtensions = true;  //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
  form.parse(req, function (err, fields, files) {

    if (err) {
      return res.json({
        "status": '1',
        "msg": "内部服务器错误"
      })
    }
    // 限制文件大小 单位默认字节 这里限制大小为2m
    if (files.tweetPic.size > form.maxFieldsSize) {
      fs.unlink(files.tweetPic.path)
      return res.json({
        "status": '1',
        "msg": "图片应小于2M"
      })
    }

    var extName = '';  //后缀名
    switch (files.tweetPic.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }

    if (extName.length == 0) {
      return res.json({
        "status": '1',
        "msg": "只支持png和jpg格式图片"
      })
    }

    //使用第三方模块silly-datetime
    var t = new Date().getTime();
    //生成随机数
    var ran = parseInt(Math.random() * 8999 + 10000);

    // 生成新图片名称
    var avatarName = t + '_' + ran + '.' + extName;
    // 新图片路径
    var newPath = form.uploadDir + avatarName;

    // 更改名字和路径
    fs.rename(files.tweetPic.path, newPath, function (err) {
      if (err) {
        return res.json({
          "status": '1',
          "msg": "图片上传失败"
        })
      }
      return res.json({
        "status": '0',
        "msg": "上传成功",
        "result": { path: 'http://localhost:3001/service/' + avatarName }
      })
    })
  });
})
//创建动态
router.post("/createDynamic", (req, res, next) => {
  let userid = req.body.params.userid;
  let content = req.body.params.content || "";
  let imgurl = req.body.params.imgurl || [];
  let createtime = new Date().getTime();
  let dynamicsid = createtime + randomString(4);
  let nickname = "";
  let username = "";
  let avatarurl = "";
  let country = "";
  let UsersModel = Users.find({ userid: userid })
  UsersModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc.length > 0) {
        let userInfo = doc[0]
        console.log(userInfo)
        nickname = userInfo.nickname
        username = userInfo.username
        avatarurl = userInfo.avatarurl
        country = userInfo.country
        Dynamics.create({
          userid: userid,
          createtime: createtime,
          thumbs: 0,
          thumbslist: [],
          collect: 0,
          forward: 0,
          comment: 0,
          commentlist: [],
          content: content,
          imgurl: imgurl,
          dynamicsid: dynamicsid,
          nickname: nickname,
          username: username,
          avatarurl: avatarurl,
          country: country
        }, (err, doc) => {
          console.log(doc)
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            res.json({
              status: '0',
              msg: 'success',
              result: doc
            })
          }
        })
      }
    }
  })
})
function getDynamics(userid, skip, pageSize, sort) {
  return new Promise((res, rej) => {
    let params = {}
    if (userid) {
      params = { userid: userid }
    }
    let dynamicsModel = Dynamics.find(params).skip(skip).limit(pageSize)
    dynamicsModel.sort({ '_id': sort })
    dynamicsModel.exec((err, doc) => {
      doc.forEach(element => {
        element.thumbs = element.thumbslist.length
      })
      res(doc)
    })
  })
}
// 从库中提取用户信息
function findUserInfo(userid) {
  return new Promise((res, rej) => {
    let UsersModel = Users.find({ userid: userid })
    UsersModel.exec((err, doc) => {
      let userInfo = doc[0]
      res(userInfo)
    })
  })
}
//关注
router.post('/follow', async (req, res, next) => {
  let type = req.body.params.type;
  let userid = req.body.params.userid;
  let targetuserid = req.body.params.targetuserid;
  let UsersModel = await findUserInfo(userid);
  let followUser = {
    userid: UsersModel.userid,
    username: UsersModel.username,
    nickname: UsersModel.nickname,
    avatarurl: UsersModel.avatarurl
  }
  let TargetUserModel = await findUserInfo(targetuserid);
  let TargetFollowUser = {
    userid: TargetUserModel.userid,
    username: TargetUserModel.username,
    nickname: TargetUserModel.nickname,
    avatarurl: TargetUserModel.avatarurl
  }
  if (type) {
    Users.updateOne({ userid: targetuserid }, {
      benoticedlist: [...TargetUserModel.benoticedlist, followUser],
      benoticed: TargetUserModel.benoticedlist.length + 1
    }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        Users.updateOne({ userid: userid }, {
          followlist: [...UsersModel.followlist, TargetFollowUser],
          follow: UsersModel.followlist.length + 1
        }, (err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            res.json({
              status: '0',
              msg: 'success',
              result: { benoticed: TargetUserModel.benoticedlist.length + 1 }
            })
          }
        })

      }
    })
  } else {
    TargetUserModel.benoticedlist.forEach((element, index) => {
      if (element.userid == userid) {
        TargetUserModel.benoticedlist.splice(index, 1);
      }
    })
    Users.updateOne({ userid: targetuserid }, {
      benoticedlist: [...TargetUserModel.benoticedlist],
      benoticed: TargetUserModel.benoticedlist.length
    }, (err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message
        })
      } else {
        UsersModel.followlist.forEach((element, index) => {
          if (element.userid == targetuserid) {
            UsersModel.followlist.splice(index, 1);
          }
        })
        Users.updateOne({ userid: userid }, {
          followlist: [...TargetUserModel.followlist],
          followlist: TargetUserModel.followlist.length
        }, (err, doc) => {
          if (err) {
            res.json({
              status: '1',
              msg: err.message
            })
          } else {
            res.json({
              status: '0',
              msg: 'success',
              result: { benoticed: TargetUserModel.benoticedlist.length }
            })
          }
        })
      }
    })
  }

})
//回复信息
router.post("/sendComment", async (req, res, next) => {
  let userid = req.body.params.userid;
  let content = req.body.params.content;
  let createtime = new Date().getTime();
  let dynamicsid = req.body.params.dynamicsid;
  let commentid = createtime + randomString(6);
  let UsersModel = await findUserInfo(userid);
  let nickname = UsersModel.nickname;
  let username = UsersModel.username;
  let avatarurl = UsersModel.avatarurl;
  let dynamicsModel = await getDynamicDetail(dynamicsid);
  Dynamics.updateOne({ dynamicsid: dynamicsid }, {
    commentlist: [...dynamicsModel.commentlist, {
      userid: userid,
      content: content,
      createtime: createtime,
      dynamicsid: dynamicsid,
      commentid: commentid,
      nickname: nickname,
      username: username,
      avatarurl: avatarurl,
      subcommentlist: []
    }],
    comment: dynamicsModel.commentlist.length + 1
  }, (err, doc) => {
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
          userid: userid,
          content: content,
          createtime: createtime,
          dynamicsid: dynamicsid,
          commentid: commentid,
          nickname: nickname,
          username: username,
          avatarurl: avatarurl,
          subcommentlist: []
        }
      })
    }
  })
})

//回复评论
router.post("/replyComment", async (req, res, next) => {
  let fromuserid = req.body.params.fromuserid;
  let touserid = req.body.params.touserid;
  let content = req.body.params.content;
  let createtime = new Date().getTime();
  let dynamicsid = req.body.params.dynamicsid;
  let commentid = req.body.params.commentid;
  let subcommentid = createtime + randomString(8);
  let fromUsersModel = await findUserInfo(fromuserid);
  let fromnickname = fromUsersModel.nickname;
  let fromusername = fromUsersModel.username;
  let fromavatarurl = fromUsersModel.avatarurl;
  let toUsersModel = touserid ? await findUserInfo(touserid) : "";
  let tonickname = toUsersModel ? toUsersModel.nickname : "";
  let tousername = toUsersModel ? toUsersModel.username : "";
  let toavatarurl = toUsersModel ? toUsersModel.avatarurl : "";
  let dynamicsModel = await getDynamicDetail(dynamicsid);
  let commentlist = dynamicsModel.commentlist
  commentlist.forEach(element => {
    if (element.commentid === commentid) {
      element.subcommentlist = [...element.subcommentlist, {
        fromuserid: fromuserid,
        touserid: touserid,
        content: content,
        createtime: createtime,
        dynamicsid: dynamicsid,
        subcommentid: subcommentid,
        fromnickname: fromnickname,
        fromusername: fromusername,
        fromavatarurl: fromavatarurl,
        tonickname: tonickname,
        tousername: tousername,
        toavatarurl: toavatarurl
      }]
    }
  })
  Dynamics.updateOne({ dynamicsid: dynamicsid }, {
    commentlist: commentlist,
    comment: dynamicsModel.commentlist.length + 1
  }, (err, doc) => {
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
          fromuserid: fromuserid,
          touserid: touserid,
          content: content,
          createtime: createtime,
          dynamicsid: dynamicsid,
          subcommentid: subcommentid,
          fromnickname: fromnickname,
          fromusername: fromusername,
          fromavatarurl: fromavatarurl,
          tonickname: tonickname,
          tousername: tousername,
          toavatarurl: toavatarurl
        }
      })
    }
  })
})

router.get("/getDynamicsList", async (req, res, next) => {
  let userid = req.param('userid')
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param('pageSize'))
  let sort = req.param("sort")
  let skip = (page - 1) * pageSize
  let params = { userid: userid };
  let dynamicsModel = await getDynamics(userid, skip, pageSize, sort);
  console.log(dynamicsModel, 'dynamicsModel')

  res.json({
    status: '0',
    msg: '',
    result: {
      count: dynamicsModel.length,
      list: dynamicsModel
    }
  })
})
function getDynamicDetail(dynamicid) {
  return new Promise((res, rej) => {
    let params = { dynamicsid: dynamicid }
    let dynamicsModel = Dynamics.find(params)
    dynamicsModel.exec((err, doc) => {
      console.log(doc, "----asd")
      doc[0].thumbs = doc[0].thumbslist.length
      res(doc[0])
    })
  })
}
router.get("/getDynamicDetail", async (req, res, next) => {
  let dynamicid = req.param('dynamicid')
  let dynamicsModel = await getDynamicDetail(dynamicid);
  res.json({
    status: '0',
    msg: '',
    result: dynamicsModel
  })
})
//点赞
router.post("/thumbs", (req, res, next) => {
  let userid = req.body.params.userid;
  let createtime = new Date().getTime();
  let dynamicsid = req.body.params.dynamicsid;
  let commentid = req.body.params.commentid;
  let type = req.body.params.type;
  let nickname = "";
  let username = "";
  let avatarurl = "";
  let UsersModel = Users.find({ userid: userid })
  UsersModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      let userInfo = doc[0]
      nickname = userInfo.nickname
      username = userInfo.username
      avatarurl = userInfo.avatarurl
      Dynamics.find({ dynamicsid: dynamicsid }, (err, doc) => {
        console.log(doc[0].thumbslist, 'doc---')
        if (type) {
          Dynamics.updateOne({ dynamicsid: dynamicsid }, {
            thumbslist: [...doc[0].thumbslist, {
              userid: userid,
              createtime: createtime,
              dynamicsid: dynamicsid,
              commentid: commentid,
              nickname: nickname,
              username: username,
              avatarurl: avatarurl
            }],
            thumbs: doc[0].thumbslist.length + 1
          }, (err, doc) => {
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              })
            } else {
              res.json({
                status: '0',
                msg: 'success'
              })
            }
          })
        } else {
          let arr = doc[0].thumbslist
          arr.forEach((element, index) => {
            if (element.userid == userid) {
              arr.splice(index, 1);
            }
          })
          Dynamics.updateOne({ dynamicsid: dynamicsid }, {
            thumbslist: [...arr],
            thumbs: arr.length + 1
          }, (err, doc) => {
            if (err) {
              res.json({
                status: '1',
                msg: err.message
              })
            } else {
              res.json({
                status: '0',
                msg: 'success'
              })
            }
          })
        }
      })
    }
  })
})


let makeUserId = () => {
  let id = `pro${randomString(8)}`;
  return id;
}
function randomString(len) {
  len = len;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
module.exports = router;