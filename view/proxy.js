/**
 * Created by Alan(000058) on 2016/11/17.
 * Email: 1480801@qq.com
 *
 * 依赖安装:
 * npm install http http-proxy --save-dev
 *
 * proxy说明:
 * 本程序为了解决大家与后端联调出现跨域后导致的一系列问题
 *
 * 启动方法:
 * 如只需要启动本服务,在本目录下输入node proxy.js即可启动
 * 项目监听时会默认启动本服务
 *
 * 配置方法
 * 1.本地host路由文件新增一条指向本机ip的xx.ceair.com域名
 * 2.配置api.config.js指向的后端开发的api信息,参数信息解析如下
 *   regexp为正则表达式,截取请求的url当中是否包含某关键字,关键字只需要修改[/mudev37]即可对应你需要的关键字
 *       -js请求配置原本为http://192.168.1.37:801/api.ashx
 *       -使用本程序后,js配置应该为/mudev37/api.ashx
 *   api则对应你需要请求的ip以及端口,注意协议不能省略.
 * 3.服务端口默认3000,可在变量中修改
 * */

const apiConfig = require('./api.config');
const http = require('http'),
    url=require('url'),
    fs=require('fs'),
    path=require('path'),
    httpProxy = require('http-proxy'),
    PORT = 3000, //服务端口
    mine = {
        "css": "text/css",
        "gif": "image/gif",
        "html": "text/html",
        "ico": "image/x-icon",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "svg": "image/svg+xml",
        "swf": "application/x-shockwave-flash",
        "tiff": "image/tiff",
        "txt": "text/plain",
        "wav": "audio/x-wav",
        "wma": "audio/x-ms-wma",
        "wmv": "video/x-ms-wmv",
        "xml": "text/xml",
        "woff": "application/x-woff",
        "woff2": "application/x-woff2",
        "tff": "application/x-font-truetype",
        "otf": "application/x-font-opentype",
        "eot": "application/vnd.ms-fontobject"
    };


var apiHost = (pathName)=> {
    //配置API接口服务器IP
    let obj = null;
    apiConfig.map((k,i)=>{
        if(k.regexp.test(pathName)){
            obj = k;
            return;
        }
    });
    return  obj || null;
};

var proxy = httpProxy.createProxyServer({
    target: 'http://127.0.0.1:' + PORT,//默认接口地址
    secure: false
});

proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    console.log(err);
    res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = http.createServer(function (req, res) {
    var pathName = url.parse(req.url).pathname;
    var realPath = decodeURIComponent(path.join(__dirname, pathName));
    var extName = realPath;
    var indexOfQuestionMark = extName.indexOf('?');
    if(indexOfQuestionMark >= 0){
        extName = extName.substring(0, indexOfQuestionMark);
        realPath = realPath.substring(0, indexOfQuestionMark);
    }
    extName = path.extname(extName);
    extName = extName ? extName.slice(1) : 'unknown';

    //判断如果是接口访问，则通过proxy转发
    let retHost = apiHost(pathName);
    if(retHost){
        req.url = req.url.replace(retHost.regexp,'/');
        proxy.web(req, res,{target:retHost.api});
        return;
    }

    fs.exists(realPath, function(exists){
        if(!exists){
            res.writeHead(404, {'content-type': 'text/plain'});
            res.write('The request URL:' + realPath + ' could not be found.');
            res.end();
            return;
        }

        fs.readFile(realPath, 'binary', function(err, file){
            if(err){
                res.writeHead(500, {'content-type': 'text/plain'});
                res.end(err);
                return;
            }

            var contentType = mine[extName] || 'text/plain';
            res.writeHead(200, {'content-type': contentType});
            res.write(file, 'binary');
            res.end();
        });
    });
});
console.log(`Web服务已启动...端口${PORT}.`);
server.listen(PORT);