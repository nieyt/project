import  'es5';
// import './mod/mod-public-head';
import './mod/mod-public-method';
import basePC from'basePC';
import 'layerPc301';
import imgSlider from './control/imgSlider';
import horizontalScroll from './control/horizontalScroll';
import commonBanner from  './mod/mod-index-commonBanner';

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
        new commonBanner({
            wrap: $('body>.mainContent>.commonBanner')
        });
        $('.tc01').on('click','.tcTab>a',function () {
            $(this).addClass('active').siblings().removeClass('active');
        });
        $('[data-src]').lazyload();
    }
}

new travelIndex().init();