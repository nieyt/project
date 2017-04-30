var path = require("path");
module.exports = {
	// base 
	'basePC': path.join(__dirname,'./scripts/core/base-pc.js'),
    'baseApp': path.join(__dirname,'./scripts/core/base-app.js'),
    // plugin
    'iscroll' : path.join(__dirname,'./scripts/widget/iscroll'),
    'swiper' : path.join(__dirname,'./scripts/widget/swiper'),
    'datepicker' : path.join(__dirname,'./scripts/widget/datepicker'),
    'layerApp' : path.join(__dirname,'./scripts/widget/layer-mobile/layer'),
    'wechart' : path.join(__dirname,'./scripts/widget/jweixin-1.0.0'),
    'lazyload' : path.join(__dirname,'./scripts/widget/lazyload'),
    'underscore': path.join(__dirname,'./scripts/widget/underscore'),
    'layerAppCss' : path.join(__dirname,'./scripts/widget/layer-mobile/need/layer.css'),
    'layerPc' : path.join(__dirname,'./scripts/widget/layer-pc/layer'),
    'layerPcCss' : path.join(__dirname,'./scripts/widget/layer-pc/skin/layer.css'),
    'pjax' : path.join(__dirname,'./scripts/widget/pjax'),
    'serialize' : path.join(__dirname,'./scripts/widget/serialize-lazy'),
    'validatePC' : path.join(__dirname,'./scripts/widget/validate-pc-lazy'),
    'jqueryForm' : path.join(__dirname,'./scripts/widget/jquery-form'),
    'sliderPc' : path.join(__dirname,'./scripts/widget/slider-pc'),
    // template

    // react 
    'Modal' : path.join(__dirname,'./node_modules/amazeui-touch/lib/Modal/Modal'),
    'ModalTrigger' : path.join(__dirname,'./node_modules/amazeui-touch/lib/ModalTrigger'),
    'Button' : path.join(__dirname,'./node_modules/amazeui-touch/lib/Button'),

    // util 
    'util' : path.join(__dirname,'./scripts/utils/util'),
	'utility_app' : path.join(__dirname,'./scripts/utils/utility_app'),
	'cookieUtils' : path.join(__dirname,'./scripts/utils/cookie'),
    'fetch': path.join(__dirname,'./scripts/utils/util.fetch'),
    'queryString' : path.join(__dirname,'./scripts/utils/util.querystring'),
    'ga':path.join(__dirname,'./scripts/utils/util.ga'),
    'ga360':path.join(__dirname,'./scripts/utils/util.ga-360'),
    'validate':path.join(__dirname,'./scripts/utils/util.validate'),
    // less
    'modalLess' : path.join(__dirname,'./node_modules/amazeui/dist/css/amazeui.min.css'),
	// core
	'es5' : path.join(__dirname,'./scripts/core/es5'),
    'layui' : path.join(__dirname,'./scripts/core/layui'),
    'BaseFetch':path.join(__dirname,'./scripts/core/base-fetch'),

};