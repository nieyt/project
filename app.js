var express = require('express');
var bodyParser = require('body-parser');//bodyParser中间件用来解析http请求体
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
var path = require('path');
var configure = require('./configure');
require('./models');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var ueditor = require("ueditor");
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var auth = require('./middlewares/auth');
var errorPageMiddleware = require('./middlewares/error_page');
var crypto = require('crypto');
var routes = require('./router');

var app = express();/*启动一个web服务器*/

mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/myproj");

app.set('views', 'view/myview/temp');
app.set('view engine', 'pug');
app.locals.moment = require('moment');//app.locals中的属性可以在jade模板中调用
//app.use(bodyParser.json());//bodyParser.json是用来解析json数据格式的
app.use(bodyParser.urlencoded({extended:true}));//bodyParser.urlencoded()用来解析我们通常的form表单提交的数据;extended选项允许配置使用querystring(值为false)或qs(值为true)来解析数据，默认值是true
/*app.use(express.bodyParser());bodyParser 已经不再与Express捆绑，需要独立安装*/
/*app.use(express.static(path.join(__dirname,"bower_components")));//静态资源所在的文件夹, __dirname代表当前的目录*/
// app.use(serveStatic('view/myview/dest'));
// // auth 中间件
// app.use(auth.authUser);

// app.use('/', routes);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   return res.render404('404');
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// module.exports = app;
