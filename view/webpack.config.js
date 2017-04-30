var path = require("path");
var webpack = require('webpack');
var sourceConfig = require('./source.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var banner = 'lastmodify: ' + new Date().toLocaleString();
var config = {
    entry: {
    },
    output: {
        //path: path.join(__dirname, './dest/hotel'),   //打包输出的路径
        filename: '[name].min.js',                              //打包后的名字
        //publicPath:"../../dest/hotel/js/",                     //html引用路径，在这里是本地地址。
        chunkFilename : '[name].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.(js|jsx)(-lazy)?$/,
                exclude: /node_modules/,
                loader : 'babel-loader',
                discardComments: {removeAll: true}
            },{
                test: /\.less$/, loader: 'style!css!less'
            },{
                test: /\.css$/, loader: "style-loader!css-loader"
            },{
                test: /\.html$/,
                loader: "text"
            },{
                test: /\.pug$/,
                loader: "pug-loader"
            },{
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            }
        ],
        postLoaders : [{
                test: /\.(js|jsx)(-lazy)?$/,
                loaders: ['es3ify-loader']
            },
            // 这个配置放到打包到生产环境中去，测试环境打到一个包
            {
                test: /-lazy\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'bundle-loader?lazy&name=[name]'
            }
        ]
    },
    htmlLoader: {
        ignoreCustomFragments: [/\{\{.*?}}/]
    },
    resolve:{
        modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
        // extensions:['','.js','.json','less','scss','html','.web.js'],
        extensions: ['', '.web.js', '.js', '.json','less','scss','html'],
        root: path.dirname(__dirname),
        alias: {
            'jquery' : path.join(__dirname,'./scripts/core/jquery-1.8.3.min'),
            'zepto' : path.join(__dirname,'./scripts/core/zepto'),
        }
    },
    resolveLoader: {
        root: path.join(__dirname, './node_modules')
    },
    externals: {
        'react': 'window.React',
        'react-dom': 'window.ReactDOM'
    },
    plugins: [
        //new webpack.optimize.OccurenceOrderPlugin(),

        // 使用babel-plugin-import支持组件加载
        // ['import', { libraryName: 'antd-mobile', style: 'css' }]
        /*new webpack.optimize.CommonsChunkPlugin({
            name : ["common"],
            minChunks: 2
        })*/

    ]
};
Object.assign(config.resolve.alias,sourceConfig);
module.exports = config;

//test
