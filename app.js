var express = require('express');
var bodyParser = require('body-parser');//bodyParser中间件用来解析http请求体
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
var _ = require('underscore');//引入该模块主要是想使用其extend属性来实现对象的替换
var path = require('path');
var port = process.env.PORT ||  8080;
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
app.use(serveStatic('view/myview/dest'));
app.listen(port);
console.log('sever is start on ' + port);
