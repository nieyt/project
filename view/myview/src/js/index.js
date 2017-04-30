/**
 * Created by 000058 on 2017/3/14.
 */
import  'es5';
// import './mod/mod-public-head';
import './mod/mod-public-method';
import * as config from './mod/mod-public-config';
import basePC from'basePC';
import 'layerPc301';
import imgSlider from './control/imgSlider';
import horizontalScroll from './control/horizontalScroll';
import commonBanner from  './mod/mod-index-commonBanner';
// import './control/hotelCity';
// import 'datePicker';

class travelIndex extends basePC {
    constructor() {
        super();
    }
    init() {
        //随便写写，可以优化修改
        $(".mainNav dd").mouseover(function () {
            // $(".indexLeftNav").addClass("hover");
            $(this).addClass("select").siblings().removeClass("select");
            var curIndex = $(this).index();
            $(".indexLeftNavContent .ilNavContent").eq(curIndex).show().siblings().hide();
        })
        $(".indexLeftNav").on("mouseleave", function (e) {
            $(".indexLeftNav").removeClass("hover");
            $(".indexLeftNav dd").removeClass("select");
            $(".indexLeftNavContent .ilNavContent").hide();
        });

        //轮播图
        new imgSlider({
            wrap: $('#imageScroll')
        });
        //左右滚动切换图
        new horizontalScroll({
            wrap: $('#fbImgScroll'),
            prev: $('#fbImgScroll').siblings('.prev'),
            next: $('#fbImgScroll').siblings('.next')
        });
        //旅游产品推荐
        new commonBanner({
            wrap: $('body>.mainContent>.commonBanner'),
            api:config.API.baseUrl+config.API.product.IndexMarketProduct,
            config
        });


        $('.tc01').on('click','.tcTab>a',function () {
            $(this).addClass('active').siblings().removeClass('active');
        });

        $('[data-src]').lazyload();

        //创建cookie
        // function addCookie(sName,sValue,day) {
        //     var expireDate = new Date();
        //     expireDate.setDate(expireDate.getDate()+day);
        //     //设置失效时间
        //     document.cookie = sName + '=' + encodeURIComponent(sValue) +';expires=' + expireDate.toGMTString()+';path=/';   //toGMTString() 把日期对象转成字符串
        // }
        //读取cookie用于区分出发城市
        // function getCookie(name){
        //     var strCookie=document.cookie;
        //     var arrCookie=strCookie.split("; ");
        //     for(var i=0;i<arrCookie.length;i++){
        //         var arr=arrCookie[i].split("=");
        //         if(arr[0]==name){
        //             return arr[1];
        //         }
        //     }
        //     return "";
        // }
        // var cookName=decodeURIComponent(getCookie('fingername')) || null;
        // var cookID=decodeURIComponent(getCookie('fingerid')) || null;
    }
}

new travelIndex().init();