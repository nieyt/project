var webpack = require('webpack')
var path = path = require('path')
var rootPath = path.dirname(__dirname)
var os = require('os');
const pxtorem = require('postcss-pxtorem');
var banner = os.userInfo().username + ' modified this file at ' + new Date().toLocaleString()
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const extractCSS = new ExtractTextPlugin('../css/[name].css?[contenthash]');
const extractCSS = new ExtractTextPlugin('../css/[name]-common.css');
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
  // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
];
module.exports = {
    module: {
        loaders: [{
            test: /\.(js|jsx)(-lazy)?$/,
            exclude: /node_modules/,
            loaders: ['babel-loader']
        },
        // 处理antd的loader，会将antd相关的css抽离生成对应的name-common.css，
        // author: 邵健
        // time 2017/3/21
        {
            test: /\.(css|less)$/,
            // 如果antd-mobile才需要处理打包
            include: /(antd-mobile|normalize|\.\.\/travel\/app\/src\/js\/components)/,
            // loader: "style-loader!css-loader"
            loader: extractCSS.extract('style-loader', ['css-loader','postcss','less-loader'])
          }
        ,
        //兼容原有项目。非antd-mobile和normalize对应的css在项目中引入还是会打入js bundle中。
        // author: 邵健
        // time 2017/3/21
        {
            test: /\.css$/,
            exclude: /(antd-mobile|normalize|\.\.\/travel\/app\/src\/js\/components)/,
            loader: 'style!css'
            // loader: extractCSS.extract('style-loader', ['css-loader',, 'less-loader'])
        },{
            test: /\.html$/,
            loader: "text"
        },{
            test: /\.pug$/,
            loader: "pug-loader"
        },{
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
        },{
            test: /\.(svg)$/i,
            loader: 'svg-sprite',include: svgDirs  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
        },
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
    resolve: {
        modulesDirectories: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['', '.web.js', '.js', '.json','less','scss','html','.js-lazy', '.jsx-lazy'],

        // extensions: ['', '.js', '.jsx', '.js-lazy', '.jsx-lazy'],
        root: rootPath,
        alias: {
            'basePC': path.join(__dirname,'../scripts/core/base-pc.js'),
            'baseApp': path.join(__dirname,'../scripts/core/base-app.js'),
            // plugin
            'iscroll' : path.join(__dirname,'../scripts/widget/iscroll'),
            'swiper' : path.join(__dirname,'../scripts/widget/swiper'),
            //'datepicker' : path.join(__dirname,'../scripts/widget/datepicker'),
            'wechart' : path.join(__dirname,'../scripts/widget/jweixin-1.0.0'),
            'lazyload' : path.join(__dirname,'../scripts/widget/lazyload'),
            'underscore': path.join(__dirname,'../scripts/widget/underscore'),
            'layerApp' : path.join(__dirname,'../scripts/widget/layer-mobile/layer'),
            'layerAppCss' : path.join(__dirname,'../scripts/widget/layer-mobile/need/layer.css'),
            'layerPc' : path.join(__dirname,'../scripts/widget/layer-pc/layer'),
            'layerPcCss' : path.join(__dirname,'../scripts/widget/layer-pc/skin/layer.css'),
            'layerPc301' : path.join(__dirname,'../scripts/widget/layer301-pc/layer'),
            'layerPcCss301' : path.join(__dirname,'../scripts/widget/layer301-pc/skin/layer.css'),
            'pjax' : path.join(__dirname,'../scripts/widget/pjax'),
            'serialize' : path.join(__dirname,'../scripts/widget/serialize-lazy'),
            'validatePC' : path.join(__dirname,'../scripts/widget/validate-pc-lazy'),
            'serialize1' : path.join(__dirname,'../scripts/widget/serialize'),
            'validatePC1' : path.join(__dirname,'../scripts/widget/validate-pc'),
            'Picker':path.join(__dirname,'../scripts/widget/picker.min.js'),
            'Time':path.join(__dirname,'../scripts/widget/Time.js'),
            'jqueryForm' : path.join(__dirname,'../scripts/widget/jquery-form'),
            'sliderPc' : path.join(__dirname,'../scripts/widget/slider-pc'),
            'datePicker' : path.join(__dirname,'../scripts/widget/datepicker/datepicker'),
            'pagerControlPC' : path.join(__dirname,'../scripts/widget/pagerControl'),
            // template

            // react
            'Modal' : path.join(__dirname,'../node_modules/amazeui-touch/lib/Modal/Modal'),
            'ModalTrigger' : path.join(__dirname,'../node_modules/amazeui-touch/lib/ModalTrigger'),
            'Button' : path.join(__dirname,'../node_modules/amazeui-touch/lib/Button'),

            // util
            'util' : path.join(__dirname,'../scripts/utils/util'),
            'utility_app' : path.join(__dirname,'../scripts/utils/utility_app'),
            'cookieUtils' : path.join(__dirname,'../scripts/utils/cookie'),
            'fetch': path.join(__dirname,'../scripts/utils/util.fetch'),
            'queryString' : path.join(__dirname,'../scripts/utils/util.querystring'),
            'ga':path.join(__dirname,'../scripts/utils/util.ga'),
            'ga360':path.join(__dirname,'../scripts/utils/util.ga-360'),
            'validate':path.join(__dirname,'../scripts/utils/util.validate'),
			'storage':path.join(__dirname,'../scripts/utils/storage'),
			'storage11':path.join(__dirname,'../scripts/utils/util.storage.1.1'),
            'reactUI':path.join(__dirname,'../scripts/widget/react-ui/'),
            'reactCalendar': path.join(__dirname,'../scripts/widget/react-ui/calendar/calendar'),
            'reactStepper': path.join(__dirname,'../scripts/widget/react-ui/stepper/stepper'),
            // less
            'modalLess' : path.join(__dirname,'../node_modules/amazeui/dist/css/amazeui.min.css'),
            // core
            'es5' : path.join(__dirname,'../scripts/core/es5'),
            'layui' : path.join(__dirname,'../scripts/core/layui'),
            'BaseFetch':path.join(__dirname,'../scripts/core/base-fetch'),

            // jquery ui
            'datepickerJs' : path.join(__dirname,'../scripts/widget/jquery-ui/datepicker/jquery-ui.js'),
            'datepickerCss' : path.join(__dirname,'../scripts/widget/jquery-ui/datepicker/jquery-ui.css')
        }
    },
    externals: {
        'react': 'window.React',
        'react-dom': 'window.ReactDOM',
        'jQuery':'window.jQuery',
        'jquery':'window.jQuery',
        'Zepto':'window.Zepto'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.BannerPlugin(banner, {
            entryOnly: true
        }),
        extractCSS
    ],
    // ,
    postcss: function () {
        return [require('autoprefixer'),pxtorem({
          rootValue: 100,
          propWhiteList: [],
        })];
    }
}
