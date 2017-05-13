var express = require('express');
var router = express.Router();
// var auth = require('./middlewares/auth');
var sign = require('./controllers/sign');
var index = require('./controllers/index');
var publish = require('./controllers/publish');
var detail = require('./controllers/detail');
var list = require('./controllers/list');

// 首屏
router.get('/',index.index); 
router.get('/sign', sign.signPage); 
router.post('/register', sign.register);           // 注册页
router.post('/login', sign.login);  
router.get('/logout', sign.logout);                // 登录页

// 发布信息
router.get('/publish',publish.publish); 
router.post('/publish',publish.postInfo);
router.post('/uploadimg',publish.uploadimg);

//信息详情
router.get('/detail/:id',detail.getDetail); 

//信息列表
router.get('/shouji',list.renderList);

module.exports = router;
