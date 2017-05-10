/*
 gulp hote-app-js:index || gulp hotel-app-js
 */
const gulp = require('gulp');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngcrush = require('imagemin-pngcrush');
const htmlmin = require('gulp-htmlmin'); //html压缩const
const webpackConfig = require('./webpack.config');
const replace = require('gulp-replace');
const webpack = require('webpack');
const gulpwebpack = require('gulp-webpack');
const livereload = require('gulp-livereload');
const uglify = require('gulp-uglify');
const oader = require('exports-loader');
const autoprefixer = require('gulp-autoprefixer');
const cache = require('gulp-cache');
const path = require('path');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');
var plumber = require('gulp-plumber');
var processors = [px2rem({remUnit:75 })];
var htmlreplace = require('gulp-html-replace');
const gulpPug = require('gulp-pug');
const folderName = process.argv[2];
// 引入组件
const cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename');//文件更名
// 打包的项目名：hotel,travel,mall...
const projectName = (()=>{
    var str = folderName.split('-')[0];
    return str.replace('.','');
})();
// app,pc
//const platformName = (()=>{
//    var str = folderName.split('-')[1] || 'app';
//    return str;
//})();
// 要打包的文件类型 js、css、less、images
const sourceType = (()=>{
    var str = folderName.split('-')[1];
    str = str.split(':')[0];
    return str;
})();
// 打包的文件名
const fileName = (()=>{
    var pt = folderName.split(':')[1];
    return pt;
})();
// 监控 || 打包
const isWatch = (()=>{
    var bl = folderName.indexOf('.') == 0 ? "watch" : 'compile'+sourceType;
    return bl;
})();
let method = {
    //监控
    watch(){
        var server = livereload();
        livereload.listen();
        switch (sourceType){
            case "all":
                //gulp.watch('' + projectName + '/src/js/**/**', method.compilejs);
                gulp.watch('./' + projectName + '/src/less/**/**', method.compileless);
                gulp.watch('./' + projectName + '/src/css/*.css', method.compilecss);
                gulp.watch('./' + projectName + '/*.html', method.compilehtml);
                // gulp.watch('./' + projectName + '/src/template/*.pug', method.compilejs);
                gulp.watch('./' + projectName + '/temp/*.pug', method.compilepug);
                break;
            case "js":
                gulp.watch('' + projectName + '/src/js/**/**', method.compilejs);
                gulp.watch('./' + projectName + '/src/template/*.pug', method.compilejs);
                break;
            case "less":
                gulp.watch('./' + projectName + '/src/less/**/**', method.compileless);
                break;
            case "img":
                gulp.watch('./' + projectName + '/src/images/**/**', method.compileimg);
                break;
            case "template":
                gulp.watch('./' + projectName + '/src/template/*.html', method.compiletemplate);
                break;
            case "html":
                gulp.watch('./' + projectName + '/*.html', method.compilehtml);
                break;
            case "css":
                gulp.watch('./' + projectName + '/src/css/*.css', method.compilecss);
                break;
            case "pug":
                gulp.watch('./' + projectName + '/temp/*.pug', method.compilepug);
                break;
        }
        require('./proxy');//启动web服务
    },
    // 压缩JS
    compilejs(){
        var from = path.join(__dirname, './**/**/src/*.js');
        var to = path.join(__dirname, projectName, '/', './dest/js/');
        /*if(platformName == 'app'){
         webpackConfig.entry = {
         common: ['react','react-dom'],
         };
         }else{
         webpackConfig.entry = {
         common: ['jquery'],
         };
         }*/
        /*,'amazeui-touch'*/
        webpackConfig.entry[fileName] = './' + projectName + '/src/js/' + fileName + '.js';
        webpackConfig.output.publicPath = "./dest/js/"; // 相对页面的配置

        if(isWatch != "watch") {
            webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output:{
                    comments: false
                },
                mangle: {
                    except: ['$super', '$', 'exports', 'require']
                },
            }));
        }
        compile();
        function compile(){
            gulp.src(from)
                .pipe(gulpwebpack(webpackConfig))
                .pipe(gulp.dest(to))
                .pipe(livereload());
            console.log(sourceType + ": success!");
        }
    },
    compilecss(){
        var from = path.join(__dirname,projectName,'./src/css/*.css');
        var to = path.join(__dirname,projectName,'./dest/css/');

        compile();
        function compile(){
            gulp.src(from) //多个文件以数组形式传入
                .pipe(plumber())
                .pipe(less())
                .pipe(autoprefixer({
                    browsers: ['last 2 versions', 'Android >= 4.0'],
                    cascade: true, //是否美化属性值 默认：true 像这样：
                    //-webkit-transform: rotate(45deg);
                    //        transform: rotate(45deg);
                    remove:true //是否去掉不必要的前缀 默认：true
                }))
                .pipe(cleanCSS())
                .pipe(gulp.dest(to))
                .pipe(livereload());
            console.log(sourceType + ": success!");
        }
    },
    compileless(){
        var from = path.join(__dirname,projectName,'./src/less/*.less');
        var to = path.join(__dirname,projectName,'./dest/css/');
        compile();
        function compile(){
            gulp.src(from) //多个文件以数组形式传入
                .pipe(plumber())
                .pipe(less())
                .pipe(less())
                // .pipe(cleanCSS())
                .pipe(autoprefixer({
                    browsers: ['last 2 versions', 'Android >= 4.0'],
                    cascade: true, //是否美化属性值 默认：true 像这样：
                    //-webkit-transform: rotate(45deg);
                    //        transform: rotate(45deg);
                    remove:false //是否去掉不必要的前缀 默认：true
                }))
                .pipe(cleanCSS())
                .pipe(gulp.dest(to))
                .pipe(livereload());
            console.log(sourceType + ": success!");
        }
    },
    compileimg(){
        var from = path.join(__dirname,projectName,'./src/images/**/**');
        var to = path.join(__dirname,projectName,'/','./dest/images/');
        compile();
        function compile(){
            gulp.src(from)
                .pipe(cache(imagemin({
                    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                    // interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    // multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化progressive: true,
                    svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
                    use: [pngcrush()] //使用pngquant深度压缩png图片的imagemin插件
                })))
                .pipe(gulp.dest(to))
            console.log(sourceType + ": success!");
        }
    },
    compiletemplate(){
        var from = path.join(__dirname,projectName,'./src/template/*.html');
        var to = path.join(__dirname,projectName,'/','./dest/template/');
        compile();
        function compile() {
            gulp.src(from)
                .pipe(htmlmin({collapseWhitespace: true}))
                .pipe(gulp.dest(to))
        }
    },
    compilehtml(){
        var from = path.join(__dirname,projectName,'./*.html');
        var to = path.join(__dirname,projectName,'/','./dest/html/');
        compile();
        function compile() {
            gulp.src(from)
                .pipe(htmlmin({collapseWhitespace: true}))
                .pipe(replace(/\.js/ig,'.js?_='+new Date().getTime()))
                .pipe(replace(/\.css/ig,'.css?_='+new Date().getTime()))
                .pipe(gulp.dest(to))
                .pipe(livereload());
        }
    },
    compilepug(){
        var from = path.join(__dirname,projectName,'./temp/*.pug');
        var to = path.join(__dirname,projectName,'/','./dest/html/');
        compile();
        function compile() {
            gulp.src(from)
                .pipe(plumber())
                .pipe(gulpPug({
                    pretty:true   //是否美化代码
                }))
                .pipe(replace(/dest\//g,'./'))
                .pipe(replace(/\.js/ig,'.js?_='+new Date().getTime()))
                .pipe(replace(/\.css/ig,'.css?_='+new Date().getTime()))
                .pipe(gulp.dest(to))
                .pipe(livereload());
        }
    }
}

gulp.task(process.argv[2],method[isWatch]);
