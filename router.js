var express = require('express');
var router = express.Router();
var auth = require('./middlewares/auth');
var sign = require('./controllers/sign');
// var index = require('./controllers/index');

// 首屏
router.get('/sign', sign.sign);                                            // 首页
router.post('/sign#signup', sign.register);                                   // 注册页
router.post('/sign#signin', sign.login);                                         // 登录页
// router.get('/logout', sign.logout);                                        // 登出页
// router.get('/index', index.index);                                         // 主页
// router.get('/search', index.search);                                       // 搜索
