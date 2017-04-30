var path=require('path');
var [p1,p2,taskName,...fileNames] = process.argv;

var moduleName = taskName.split(':')[0];
var mode = taskName.split(':')[1]
var port=taskName.split(':')[2]||3000;
console.log(taskName,fileNames);
if (!moduleName) {
    throw new Error('expect a moduleName of modules.js file')
}

if (!mode) {
    throw new Error('expect a mode, it must be one of ["dev", "prod"]')
}
var WebpackDevServer = require("webpack-dev-server");
var webpack = require('webpack')
var modules = require('./webpack/modules')
var configMode=mode==='prod'?'prod':'dev';
var webpackConfig = require('./webpack/webpack.config.' + configMode)
// 是否打包库文件
var isLib = mode.indexOf('lib') !== -1
// 是否生产模式
var isProduction = mode === 'prod';
var isHot=mode === 'hot';
runWebpack(webpackConfig,isProduction);

function runWebpack(baseConfig, isProduction) {
    var config = Object.create(baseConfig)
    var basePath=path.join.apply(path,moduleName.split('-'))
    var moduleConfig = modules(basePath,fileNames,isProduction)
    var outputType = typeof moduleConfig.output

    // merge moduleConfit to config
    Object.assign(config, moduleConfig)
    // handle entry
    config.entry = {}
    config.entry = moduleConfig.entry

    // handle output
    if (outputType === 'string') {
        config.output = {}
        config.output.path = moduleConfig.output
    } else if (outputType === 'object') {
        config.output = Object.assign({}, config.output, moduleConfig.output)
    }
	
    // handle productionConfig
    if (isProduction) {
		basePath = basePath.replace(/\\/,'/');
        config.output.publicPath = `https://ceair-resource.oss-cn-shanghai.aliyuncs.com/${basePath}/js/`;
    }

    return new Promise(function(resolve, reject) {
        var count = 0
        
        var compiler=webpack(config, function(err, stats) {
            if (err) {
                reject(err)
            }
            if (!stats) {
                return
            }
            var info = stats.toString({
                // output options
                colors: true,
                chunks: false,
                cached: true
            })
            console.log(info)
            if (count === 0) {
                resolve(info)
            } else {
                console.log('change times: ' + count)
            }
            count += 1
        })

        if(isHot){
            runHot(compiler)
        }
    })
}

function runHot(compiler){
    var server = new WebpackDevServer(compiler, {
        contentBase: path.resolve("./transfer/app/dest/"),
        historyApiFallback: {
            disableDotRule: true,
        },
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
          },
        stats: { colors: true },
        inline: true,
        filename: "index.min.js",
    });
    server.listen(port, "localhost", function() {

    });
}

function logInfo(message) {
    console.log(message)
}
