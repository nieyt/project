/**
 * Created by sunyi on 16/6/20.
 */
import './json2';
import {ctiyJson} from './airCityFormat';
import * as config from '../mod/mod-public-config';
//添加隐藏域用于存储date
    $('body').append('<input type="hidden" value="" class="chufago"><input type="hidden" value="" class="daodato"><input type="hidden" value="" class="qifei"><input type="hidden" value="" class="jiudian">');
    //创建cookie
    var addCookie=function (sName,sValue,day) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate()+day);
        //设置失效时间
        document.cookie = sName + '=' + encodeURIComponent(sValue) +';expires=' + expireDate.toGMTString()+';path=/';   //toGMTString() 把日期对象转成字符串
    };
    /*
     机票
     * */
    function departure(url, name) {
        var url = url, name = $(name);
        name.css('cursor', 'pointer');
        /*name.on('blur', function () {
         var oldValue = $(this).attr('data-value');
         var curValue = $(this).val();
         var ie8placeholder = $(this).attr('placeholder');
         if (curValue != oldValue && curValue != ""&&curValue!=ie8placeholder) {
         name.val('');
         }
         });*/
        name.off('click').on('click',function (e) {
            $('.result').hide();
            e.stopPropagation();

            var qbList = '',
                guonr = '',
                guoji = '',
                hotList = '',
                ptList = '';

            qbList += '<div class="cityPanel hideBox" style="position:absolute;">';//容器
            qbList += '<div class="type guojiadiqu"><ul><li rel="Domestic" class="guonr_s active">国内</li><li rel="International" class="guoji_s">国际/地区</li></ul><div class="clear"></div></div>';//容器头部类型
            qbList += '</div>';
            guonr += '<div class="regional regionalZg" style="display: block; min-height: 100px; position: relative;">';
            guonr += '<div class="title"><ul class="clearfix"><li rel="热门城市" class="active">热门城市</li><li rel="其他城市">其他城市</li></ul></div>';
            guonr +='<div class="body">';
            guoji += '<div class="regional regionalGj" style="display: none">';
            guoji += '<div class="title"><ul class="clearfix"><li rel="热门城市" class="active">热门城市</li><li rel="其他城市">其他城市</li></ul></div>';
            guoji +='<div class="body">';
            hotList += '<div class="city_body" style="display:block"><ul>';
            ptList += '<div class="city_body"><ul>';

            $('.cityfrom').hide();//先隐藏别的
            $('.cityPanel').remove(); //先清空
            $('body').append(qbList); //在添加
            $('.cityPanel .regional').remove();		//先清空国内 国际
            $('.cityPanel').find('.type').after(guonr, guoji);	//添加国内 国际
            $('.cityPanel .city_body').remove(); //先删除tab内容
            $('.cityPanel .regionalZg').find('.body').append(hotList, ptList);
            $('.cityPanel .regionalGj').find('.body').append(hotList, ptList);
            //容器位置
            var top = name.offset().top + 30,
                left = name.offset().left;
            $('.cityPanel').css({'top': top, 'left': left});
            //ajax方法
            function ajaxadd(data) {
                var $thisname=name[0].name;  //input name值
                $('.cityPanel').attr('data-name',$thisname);
                if (typeof data.Data == 'object') {
                    console.error(data.Data);
                    $.each(data.Data, function (i, item) {
                        if (item!=null&&typeof item == 'object') {
                            hotList = '';
                            ptList = '';
                            $.each(item, function (j, val) {
                                if (val.IsHot) {
                                    hotList += '<li data-Id="' + val.ID + '">' + val.CityName + '</li>'
                                } else {
                                    ptList += '<li data-Id="' + val.ID + '">' + val.CityName + '</li>'
                                }
                            });
                            if (i == 'InternalCityList') {
                                $('.cityPanel .regionalZg .city_body').eq(0).find('ul').append(hotList);
                                $('.cityPanel .regionalZg .city_body').eq(1).find('ul').append(ptList);
                            } else if (i == 'ForeignCityList') {
                                $('.cityPanel .regionalGj .city_body').eq(0).find('ul').append(hotList);
                                $('.cityPanel .regionalGj .city_body').eq(1).find('ul').append(ptList);
                            } else {
                                $('.cityPanel .guojiadiqu li').eq(1).hide();
                                $('.cityPanel .regionalZg .city_body').eq(0).find('ul').append(hotList);
                                $('.cityPanel .regionalZg .city_body').eq(1).find('ul').append(ptList);
                            }
                        }
                    });
                }
                //国内tab绑定
                $('.cityPanel .regionalZg .clearfix li').click(function (e) {
                    e.stopPropagation();
                    var $thisindex = $(this).index();
                    $('.cityPanel .regionalZg .clearfix li').removeClass('active');
                    $(this).addClass('active');
                    $('.cityPanel .regionalZg .city_body').hide();
                    $('.cityPanel .regionalZg .city_body').eq($thisindex).show();
                });
                //国际tab绑定
                $('.cityPanel .regionalGj .clearfix li').click(function (e) {
                    e.stopPropagation();
                    var $thisindex = $(this).index();
                    $('.cityPanel .regionalGj .clearfix li').removeClass('active');
                    $(this).addClass('active');
                    $('.cityPanel .regionalGj .city_body').hide();
                    $('.cityPanel .regionalGj .city_body').eq($thisindex).show();
                });
                //地区绑定
                $('.cityPanel .guojiadiqu li').click(function (e) {
                    e.stopPropagation();
                    var $thisindex = $(this).index();
                    $('.cityPanel .guojiadiqu li').removeClass('active');
                    $(this).addClass('active');
                    $('.cityPanel .regional').hide();
                    $('.cityPanel .regional').eq($thisindex).show();
                });
                //将值传入
                $('.cityPanel .city_body li').click(function (e) {
                    e.stopPropagation();
                    var $thisval = $(this).html(),
                        $thisid = $(this).attr('data-id');
                    if (name.hasClass('changeCity')) {
                        $('.lt_place .city').empty();
                        $('.lt_place .city').append($thisval);
                        $('.lt_place .city').attr('data-id', $thisid);
                        $('.cityPanel ').hide();
                        //存cookie用于区分读取
                        addCookie('fingerid',$thisid,30);
                        addCookie('fingername',$thisval,30);
                        if($('body').attr('data-page')=='home'){
                            // shouye($thisid);  //切换加载首页数据
                        }else {
                            var tyle=$('#type_item_div').find('.selected').attr('item');
                            var diqu=$('#depCity_item_div').find('.selected').attr('item') || '';
                            var OrderBy=$('#orderBy_item_fig').find('.currut').attr('id');
                            var r='';
                            var CountryID=$('#arrCity_item_div').find('.selected').attr('item');
                            var keyword=$.trim($('.searchInput').val());
                            if(OrderBy=='start_price'){
                                if($('#orderBy_item_fig').find('.ascend-s').css('display')=='none'){
                                    r='OrderBy=1&SortType=0';  //价格 升序  0升序 1降序
                                }else{
                                    r='OrderBy=1&SortType=1';  //价格 降序
                                }
                            }else{
                                r='OrderBy=0&SortType=';   //最受欢迎 不传
                            }
                            cityCallback && cityCallback($thisid);
                            // xqList($thisid,diqu,tyle,r,CountryID,keyword);
                        }
                    }else{
                        name.val($thisval);
                        name.attr('data-id', $thisid);
                        name.attr('data-value', $thisval);
                        $('.cityPanel').hide();
                        if(name.hasClass("select_city")){
                            var inputDateVal=$("#inputDate").val();
                            if(inputDateVal=='' || inputDateVal=="入店时间"|| inputDateVal=="\u5165\u5e97\u65f6\u95f4"){
                                $("#inputDate").click().focus();
                            }
                        }else if(name.hasClass("select_city1")){
                            var inputDateVal=$("#inputDate").val();
                            if(inputDateVal=='' || inputDateVal=="入店时间"|| inputDateVal=="\u5165\u5e97\u65f6\u95f4"){
                                $("#inputDate").click().focus();
                            }
                        }else if(name.hasClass("leaveCity")){
                            var inputDateVal=$("#inputDate3").val();
                            if(inputDateVal=='' || inputDateVal=="出发时间"|| inputDateVal=="\u51fa\u53d1\u65f6\u95f4"){
                                $("#inputDate3").click().focus();
                            }
                        }else if(name.hasClass("leaveCity1")){
                            $('.select_city1').val($(this).html());
                            var inputDateVal=$("#inputDate3").val();
                            if(inputDateVal=='' || inputDateVal=="出发时间"|| inputDateVal=="\u51fa\u53d1\u65f6\u95f4"){
                                $("#inputDate3").click().focus();
                            }
                        }
                    }
                    var $thisname=$(this).parents('.cityPanel').attr('data-name'),
                        $thisval=$(this).html(),$thisSzm=$(this).attr("data-id");
                    if($thisname=='AirEndCity'){
                        $('.select_city').val($thisval).attr("data-id",$thisSzm);
                    }
                   //将城市id发送出去
                });
                //将最小高度删除 改为自适应
                $('.cityPanel .regionalZg').css({'min-height':'0'});
            }
            //判断点击对象
            if(name.hasClass("select_city")){
                if($('.daodato').val() != ''){
                    var datato=$('.daodato').val();
                    //调用ajax方法
                    console.log(1);
                    ajaxadd(JSON.parse(datato));
                }else{
                    $('#ajax_loadingcair').remove();    //先清空效果
                    //在添加效果
                    $('.regionalZg .body').append('<div class="ajax_loading ajax_loading2 absolute" id="ajax_loadingcair" style="width:220px; height: 90px; position: absolute; top: 1px; left: 83px;"><div class="info">正在加载中，请稍候...</div><div class="mask hide"></div></div>');
                    $.ajax({
                        type: "get",
                        url: url,
                        cache:true,
                        success: function (data) {
                            //讲值放入隐藏预
                            $('.daodato').val(JSON.stringify(data));
                            ajaxadd(data);
                        },
                        complete:function () {
                            $('#ajax_loadingcair').remove();
                        }
                    });
                }
            }else if(name.hasClass("leaveCity")){
                if($('.jiudian').val() != ''){
                    var datajiu=$('.jiudian').val();
                    //调用ajax方法
                    ajaxadd(JSON.parse(datajiu));
                }else{
                    $('#ajax_loadingcair').remove();    //先清空效果
                    //在添加效果
                    $('.regionalZg .body').append('<div class="ajax_loading ajax_loading2 absolute" id="ajax_loadingcair" style="width:220px; height: 90px; position: absolute; top: 1px; left: 83px;"><div class="info">正在加载中，请稍候...</div><div class="mask hide"></div></div>');
                    $.ajax({
                        type: "get",
                        url: url,
                        cache:true,
                        data:{
                            isRequireFilterByAirport:true
                        },
                        success: function (data) {
                            //讲值放入隐藏预
                            $('.jiudian').val(JSON.stringify(data));
                            ajaxadd(data);
                        },
                        complete:function () {
                            $('#ajax_loadingcair').remove();
                        }
                    });
                }
            }else if(name.hasClass("select_city1")){
                if($('.daodato').val() != ''){
                    var datato=$('.daodato').val();
                    //调用ajax方法
                    ajaxadd(JSON.parse(datato));
                }else{
                    $('#ajax_loadingcair').remove();    //先清空效果
                    //在添加效果
                    $('.regionalZg .body').append('<div class="ajax_loading ajax_loading2 absolute" id="ajax_loadingcair" style="width:220px; height: 90px; position: absolute; top: 1px; left: 83px;"><div class="info">正在加载中，请稍候...</div><div class="mask hide"></div></div>');
                    $.ajax({
                        type: "get",
                        url: url,
                        cache:true,
                        success: function (data) {
                            //讲值放入隐藏预
                            $('.daodato').val(JSON.stringify(data));
                            ajaxadd(data);
                        },
                        complete:function () {
                            $('#ajax_loadingcair').remove();
                        }
                    });
                }
            }else if(name.hasClass("leaveCity1")){
                if($('.jiudian').val() != ''){
                    var datajiu=$('.jiudian').val();
                    //调用ajax方法
                    ajaxadd(JSON.parse(datajiu));
                }else{
                    $('#ajax_loadingcair').remove();    //先清空效果
                    //在添加效果
                    $('.regionalZg .body').append('<div class="ajax_loading ajax_loading2 absolute" id="ajax_loadingcair" style="width:220px; height: 90px; position: absolute; top: 1px; left: 83px;"><div class="info">正在加载中，请稍候...</div><div class="mask hide"></div></div>');
                    $.ajax({
                        type: "get",
                        url: url,
                        cache:true,
                        data:{
                            isRequireFilterByAirport:true
                        },
                        success: function (data) {
                            //讲值放入隐藏预
                            $('.jiudian').val(JSON.stringify(data));
                            ajaxadd(data);
                        },
                        complete:function () {
                            $('#ajax_loadingcair').remove();
                        }
                    });
                }
            }else {
                if($('.chufago').val() != ''){
                    var datago=$('.chufago').val();
                    //调用ajax方法
                    ajaxadd(JSON.parse(datago));
                }else{
                    $('#ajax_loadingcair').remove();    //先清空效果
                    //在添加效果
                    $('.regionalZg .body').append('<div class="ajax_loading ajax_loading2 absolute" id="ajax_loadingcair" style="width:220px; height: 90px; position: absolute; top: 1px; left: 83px;"><div class="info">正在加载中，请稍候...</div><div class="mask hide"></div></div>');
                    $.ajax({
                        type: "get",
                        url: url,
                        cache:true,
                        success: function (data) {
                            //讲值放入隐藏预
                            $('.chufago').val(JSON.stringify(data));
                            ajaxadd(data);
                        },
                        complete:function () {
                            $('#ajax_loadingcair').remove();
                        }
                    });
                }
            }
        });
    }
    window.departure=departure;

    departure(config.API.baseUrl + config.API.product.GetDestinationCityList, '.select_city');
    departure(config.API.baseUrl + config.API.product.GetDestinationCityList, '.select_city1');
    //departure(API.baseUrl + API.product.GetDepartureCityList, '.goCity');
    departure(config.API.baseUrl + config.API.product.GetDestinationCityList, '.leaveCity');
    departure(config.API.baseUrl + config.API.product.GetDestinationCityList, '.leaveCity1');
    departure(config.API.baseUrl + config.API.product.GetDepartureCityList, '.changeCity');

    $('.changePosition').click(function () {
        var $qianval = $('.goCity').val();
        var $qianid = $('.goCity').attr('.data-id');
        var $houval = $('.leaveCity').val();
        var $houid = $('.leaveCity').attr('.data-id');
        $('.goCity').val($houval);
        $('.goCity').attr('.data-id', $houid);
        $('.leaveCity').val($qianval);
        $('.leaveCity').attr('.data-id', $qianid);
    });
    $('.changePosition1').click(function () {
        var $qianval = $('.goCity1').val();
        var $qianid = $('.goCity1').attr('.data-id');
        var $houval = $('.leaveCity1').val();
        var $houid = $('.leaveCity1').attr('.data-id');
        $('.goCity1').val($houval);
        $('.goCity1').attr('.data-id', $houid);
        $('.leaveCity1').val($qianval);
        $('.leaveCity1').attr('.data-id', $qianid);
    });

    //迪士尼插件 起飞城市
    ;(function(){
        var airCity = {
            init:function(){
                var _this = this;
                _this.horn();
            },
            easyAjax: function(opts){
                //定义公共ajax调用
                var define = {
                    type:'GET',
                    url:'null',
                    scriptCharset: "utf-8",
                    dataType:'json',
                    data:{},
                    cache:true,
                    success:function(data){},
                    error:function(sta,xhr,thrown){
                        var isIE = navigator.userAgent;
                        if (isIE.indexOf( 'MSIE' ) < 0) {
                            // 不在IE下打印报错
                            console.log(sta);
                            console.log(xhr);
                            console.log(thrown);
                        }
                    }
                };
                $.extend(define, opts);
                return $.ajax(define);
            },
            horn:function () {
                var cityFun,
                    tablefun,   //tab页切换
                    ishoyfun,   //字母标签
                    livalfun,
                    livalfun1;
                //全部城市模块
                var ctiyall='<div class="cityfrom" style="display: none">'+
                    '<div class="type"><ul><li rel="Domestic" class="guonr_s active">国内</li><li rel="International" class="guoji_s">国际/地区</li></ul><div class="clear"></div></div>'+
                    '<div class="regional">'+
                    '<div class="title">'+
                    '<ul class="clearfix tit_ctiy">'+
                    '<li rel="热门城市" class="active">热门城市</li>'+
                    '</ul>'+
                    '</div>'+
                    '<div class="body">'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                $('body').append(ctiyall);
                ishoyfun=function (name) {
                    if(name=='HotCities'){
                        return '';
                    }else{
                        return '<i>'+name+'</i>';
                    }
                };
                cityFun=function (data,name) {
                    var tithtml='',     //头部title
                        listhtml='',    //内容
                        gwlisthtml='';  //国外热门内容
                    gwlisthtml+='<div class="city_body" data-mhcx="HotCities">'+
                        '<ul class="clearfix">';
                    $.each(data, function(i, item){
                        if(name==0){
                            if(item.FirstGroupName=='国内'){
                                tithtml='<li rel="ABCD" class="">ABCD</li>'+
                                    '<li rel="EFGH" class="">EFGH</li>'+
                                    '<li rel="JKLM" class="">JKLM</li>'+
                                    '<li rel="NOPORS" class="">NOPQRS</li>'+
                                    '<li rel="TUVWX" class="">TUVWX</li>'+
                                    '<li rel="YZ" class="">YZ</li>';
                                $.each(item.groupInfo,function (k,val) {
                                    if(k != 'AllCities' && val.length>0){
                                        listhtml+='<div class="city_body" data-mhcx="'+k+'">'+
                                            ishoyfun(k)+
                                            '<ul class="clearfix">';
                                        $.each(val,function (j,obj) {
                                            listhtml+='<li data-options="" data-SZM="'+obj.SZM+'">'+obj.name+'</li>';
                                        });
                                        listhtml+='</ul>'+
                                            '</div>';
                                    }
                                });
                            }
                        }else {
                            if(item.FirstGroupName!='国内'){
                                tithtml+='<li rel="'+item.FirstGroupName+'" class="">'+item.FirstGroupName+'</li>';
                                listhtml+='<div class="city_body" data-mhcx="'+item.FirstGroupName+'">'+
                                    '<ul class="clearfix">';
                                $.each(item.groupInfo,function (k,val) {
                                    //console.log(k=='HotCities');
                                    if(k != 'AllCities' && k!='HotCities' && val.length>0){
                                        $.each(val,function (j,obj) {
                                            listhtml+='<li data-options="" data-SZM="'+obj.SZM+'">'+obj.name+'</li>';
                                        });
                                    }
                                    if(k=='HotCities'){
                                        $.each(val,function (j,obj) {
                                            gwlisthtml+='<li data-options="" data-SZM="'+obj.SZM+'">'+obj.name+'</li>';
                                        });
                                    }
                                });
                                listhtml+='</ul>'+
                                    '</div>';
                            }
                        }
                    });
                    gwlisthtml+='</ul>'+
                        '</div>';
                    //$('.cityfrom').attr('data-name',name);  //添加识别
                    $('.cityfrom .title li:first-child').addClass('active');  //给第一个添加选择样式
                    $('.cityfrom .title li:first-child').nextAll().remove(); //先删除城市列表
                    $('.cityfrom .title li').after(tithtml);  //添加城市列表
                    $('.cityfrom .body').empty().append(listhtml);   //添加城市信息
                    if(name==0){
                        $('.cityfrom .city_body:first-child').find('ul').css({'width':'419px','margin':'0 auto'});
                        $('.cityfrom .city_body:first-child').show();    //显示第一个
                    }else{
                        $('.cityfrom .body').prepend(gwlisthtml);
                        $('.cityfrom .city_body:first-child').show();    //显示第一个
                        $('.cityfrom .city_body').find('ul').css({'width':'419px','margin':'0 auto'});
                    }
                };
                //点击弹出城市列表
                $('.goCity').click(function (e) {
                    e.stopPropagation();
                    $('.cityPanel').remove(); //先清空
                    var $thisval=$(this).attr('class'),
                        top=$(this).offset().top+30,
                        left=$(this).offset().left,
                        qjthisclass=$thisval. substring($thisval.indexOf(' ')+1, $thisval.length);
                    $('.cityfrom').css({'display':'block','position':"absolute","top":top+'px','left':left+'px','zIndex':999});
                    cityFun(ctiyJson,0);
                    $('.cityfrom .type li').removeClass('active');
                    $('.cityfrom .type li').eq(0).addClass('active');
                });
                var qieall=function (e) {
                    e.stopPropagation();
                    var $thisdex=$(this).index();
                    $('.cityfrom .type li').removeClass('active');
                    $(this).addClass('active');
                    cityFun(ctiyJson,$thisdex);
                };
                $('body').undelegate('.cityfrom .type li','clcik');
                $('body').delegate('.cityfrom .type li','click',qieall);
                tablefun = function(e){
                    e.stopPropagation();
                    var $thisidex=$(this).index(),
                        nr=$('.cityfrom .city_body'),
                        pipei =$.trim($(this).html()),
                        aimVal;
                    $('.cityfrom .title li').removeClass('active');
                    $(this).addClass('active');
                    $('.cityfrom .city_body').hide();
                    if($thisidex==0){
                        $('.cityfrom .city_body:first-child').show();
                    }else{
                        for(var i=0; i < nr.length; i++){
                            aimVal = $.trim(nr.eq(i).attr('data-mhcx'));
                            if(pipei.indexOf(aimVal) != -1 && aimVal != ''){
                                nr.eq(i).show();
                            }
                        }
                    }
                };
                $('body').undelegate('.cityfrom .title li','click');
                $('body').delegate('.cityfrom .title li','click',tablefun);
                livalfun= function(e){
                    e.stopPropagation();
                    var $thisval=$(this).html()
                        // $thisfname=$(this).parents('.cityfrom').attr('data-name');
                    //$('.'+$thisfname).val($thisval);
                    //$('.'+$thisfname).attr('data-szm',$thisszm);
                    $('.goCity').val($thisval);
                    // $('.goCity').attr('data-szm',$thisszm);
                    //$('.'+$thisfname).blur();  //点击触发blur
                    $('.leaveCity').click().focus();
                    $('.cityfrom').hide();
                };
                $('body').undelegate('.cityfrom .city_body li','clcik');
                $('body').delegate('.cityfrom .city_body li','click',livalfun);

            }
        };
        if($('body').attr('data-page')!='dsnHome'){
            airCity.init();
        }
    })();

    //点击body 隐藏弹窗
    $('body').click(function () {
        $('.cityPanel').hide();
        $('.cityfrom').hide();
        $('.result').hide()
    });

    //关键字搜索
    ;(function () {
        var that, $option, airdata = [], hotelData = [], config;

        function SearchTip() {
            return this;
        }
        SearchTip.prototype.start = function (fng) {
            var _this = this;
            $option = $.extend(true, {
                result: ".search-results",
                ajaxUrl: "",
                ajaxUrl2: "",
                activeClass: "active",
                maxLength: false
            }, fng);
            $.when(
                $.ajax({url: $option.ajaxUrl, type: "get",dataType:"jsonp"}),
                $.ajax({url: $option.ajaxUrl2, type: "get"})
            ).done(function (d,d2,d3) {
                if (d2[0].Code == 200 && d2[0] && typeof d2[0].Data === "object") {
                    hotelData = $.map(d2[0].Data,function(e){
                            return e;
                    })
                }
                airdata=d;
                _this.bindInput.call($.extend(true, _this, $option));
                _this.bindBlur.call($.extend(true, _this, $option));
            });
            $($option.result).css("position") != "absolute" && $($option.result).css("position") != "fixed" ? $($option.result).css("position", "relative") : "";
            return this;
        };
        SearchTip.prototype.bindInput = function () {
            var _this = this;
            var resultHeight=$(_this.result).height()==0?32:$(_this.result).height();
            var config = {
                    li: "<li>",
                    $ul: $("<ul>", {"class": "result"}).css({
                        "position": "absolute",
                        "left": "0",
                        "top":resultHeight
                    }),
                    $a: $("<a>")
                };
            $("input[type=text]", this.result).on("input", function () {
                var val =$.trim($(this).val()), obj = [], num = 0;
                var that = $(this);
                val = val.toLocaleLowerCase();
                $("ul.result", _this.result).html("");
                if (that.attr("data-type") == "hotel" || that.attr('name') == 'AirEndCity') {
                    var realSZM=[],realSZMname=[];
                    $.each(hotelData, function (v, k) {
                        if (val != '') {
                            if (k.CityName&&k.CityName.indexOf(val) > -1) {
                                var txt = k.CityName.replace(val, '<strong>' + val + '</strong>');
                                obj.push("<li data-id='" + k.ID + "'><span>" + txt + "</span></li>");
                                realSZM.push(k.ID);
                                realSZMname.push(txt.replace(/<[^>]+>/g,""));
                                if (typeof(_this.maxLength) === "number" && num == _this.maxLength - 1) {
                                    return false;
                                }
                                num++;
                            }
                        }
                    });
                    if (val!= '') {
                        if(realSZM.length==1&&val==realSZMname[0]){
                            that.attr("data-id",realSZM[0]);
                        }else if(realSZM.length==0&&val!=''){
                            that.removeAttr("data-id");
                            obj.push("<li class='no_sub'><span style='color:#e10f0f'>对不起，暂不支持该地点</span></li>");
                        }else{
                            that.removeAttr("data-id");
                        }
                    }
                }
                else if (that.attr('name') == 'AirStarCity') {
                    var airdataBox = [],realSZM=[],realSZMname=[];
                    airdataBox = $.map(airdata[0],function(e){
                        return $.map(e.cap,function(b){
                            return b.cities;
                        });
                    });
                    $.each(airdataBox, function (v, k) {
                        if (val != '') {
                            if (k.name.indexOf(val) > -1 || k.captial.toLowerCase().indexOf(val.toLowerCase()) > -1  || k.SZM.toLowerCase().indexOf(val.toLowerCase()) > -1 || k.namespell.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                                var txt = k.name.replace(val, '<strong>' + val + '</strong>');
                                obj.push("<li data-id='" + k.SZM + "'><span>" + txt + "</span></li>");
                                realSZM.push(k.SZM);
                                realSZMname.push(txt.replace(/<[^>]+>/g,""));
                                if (typeof(_this.maxLength) === "number" && num == _this.maxLength - 1) {
                                    return false;
                                }
                                num++;
                            }
                        }
                    });
                    if(realSZM.length==1&&val==realSZMname[0]){
                        that.attr("data-szm",realSZM[0]);
                    }else if(realSZM.length==0&&val!=''){
                        that.removeAttr("data-szm");
                        obj.push("<li class='no_sub'><span style='color:#e10f0f'>对不起，暂不支持该地点</span></li>");
                    }else{
                        that.removeAttr("data-szm");
                    }
                }
                if (that.attr("data-type") == "hotel1" || that.attr('name') == 'AirEndCity1') {
                    var realSZM=[],realSZMname=[];
                    $.each(hotelData, function (v, k) {
                        if (val != '') {
                            if (k.CityName&&k.CityName.indexOf(val) > -1) {
                                var txt = k.CityName.replace(val, '<strong>' + val + '</strong>');
                                obj.push("<li data-id='" + k.ID + "'><span>" + txt + "</span></li>");
                                realSZM.push(k.ID);
                                realSZMname.push(txt.replace(/<[^>]+>/g,""));
                                if (typeof(_this.maxLength) === "number" && num == _this.maxLength - 1) {
                                    return false;
                                }
                                num++;
                            }
                        }
                    });
                    if (val!= '') {
                        if(realSZM.length==1&&val==realSZMname[0]){
                            that.attr("data-id",realSZM[0]);
                        }else if(realSZM.length==0&&val!=''){
                            that.removeAttr("data-id");
                            obj.push("<li class='no_sub'><span style='color:#e10f0f'>对不起，暂不支持该地点</span></li>");
                        }else{
                            that.removeAttr("data-id");
                        }
                    }
                }
                else if (that.attr('name') == 'AirStarCity1') {
                    var airdataBox = [],realSZM=[],realSZMname=[];
                    airdataBox = $.map(airdata[0],function(e){
                        return $.map(e.cap,function(b){
                            return b.cities;
                        });
                    });
                    $.each(airdataBox, function (v, k) {
                        if (val != '') {
                            if (k.name.indexOf(val) > -1 || k.captial.toLowerCase().indexOf(val.toLowerCase()) > -1  || k.SZM.toLowerCase().indexOf(val.toLowerCase()) > -1 || k.namespell.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                                var txt = k.name.replace(val, '<strong>' + val + '</strong>');
                                obj.push("<li data-id='" + k.SZM + "'><span>" + txt + "</span></li>");
                                realSZM.push(k.SZM);
                                realSZMname.push(txt.replace(/<[^>]+>/g,""));
                                if (typeof(_this.maxLength) === "number" && num == _this.maxLength - 1) {
                                    return false;
                                }
                                num++;
                            }
                        }
                    });
                    if(realSZM.length==1&&val==realSZMname[0]){
                        that.attr("data-szm",realSZM[0]);
                    }else if(realSZM.length==0&&val!=''){
                        that.removeAttr("data-szm");
                        obj.push("<li class='no_sub'><span style='color:#e10f0f'>对不起，暂不支持该地点</span></li>");
                    }else{
                        that.removeAttr("data-szm");
                    }
                }

                config.$ul.append(obj.join(""));
                $(this).parent(_this.result).append(config.$ul);
                if(that.attr('name') == 'AirEndCity'){
                    $("ul.result", _this.result).css({"left":"116px","z-index":"1000"});
                }
                else{
                    $("ul.result", _this.result).css({"left":"0","z-index":"1000"});
                }
                $("li", config.$ul).off("click").on("click", function () {
                    if($(this).hasClass("no_sub")){$(this).remove();return;}
                    $(this).addClass("active").siblings().removeClass("active");
                    _this.confirm.call(_this, that);
                });
                _this.keyDown.call(_this);
            });
            return this;
        };
        SearchTip.prototype.bindBlur = function () {
            $("input[name=AirStarCity]", this.result).on("blur", function (e) {
                if(!$(this).attr("data-szm")){
                    $(this).val("");
                }
            })
            $("input[name=AirStarCity1]", this.result).on("blur", function (e) {
                if(!$(this).attr("data-szm")){
                    $(this).val("");
                }
            })
            $("input[name=AirEndCity]", this.result).on("blur", function (e) {
                if(!$(this).attr("data-id")){
                    $(this).val("");
                }
            })
            $("input[name=AirEndCity1]", this.result).on("blur", function (e) {
                if(!$(this).attr("data-id")){
                    $(this).val("");
                }
            })
            $("input[name=gw_city]", this.result).on("blur", function (e) {
                if(!$(this).attr("data-id")){
                    $(this).val("");
                }
            })
        };
        SearchTip.prototype.keyDown = function (e) {
            var _this = this;
            if($("li",this.result).length>0){$(this.result).find(".result").show();}else{$(this.result).find(".result").hide();} //add by 000144
            $("input[type=text]", this.result).off("keyup").on("keyup", function (e) {
                //回车出发验证
                $(this).blur(function () {
                    if($(this)[0].name=='AirEndCity'){
                        $('.select_city').val($(this).val());
                    }
                    // if($(this)[0].name=='AirEndCity'){
                    //     $('.select_city').val($(this).val());
                    // }
                });
                switch (e.keyCode) {
                    case 38://up
                        _this.keyDown_up.call(_this, $(this));
                        break;
                    case 40: //down
                        _this.keyDown_down.call(_this, $(this));
                        break;
                    case 13: //confirm
                        _this.confirm.call(_this, $(this));
                        break;
                }
                $('.cityPanel').hide();
                $('.cityfrom').hide();
            });
        };
        SearchTip.prototype.keyDown_up = function (that) {
            var _this = this,
                parent = that.parents(".search-results"),
                index = $("ul>li.active", parent).index(),
                length = $("ul>li", parent).length;
            if (index == -1 || index == 0) {
                $("ul>li", parent).eq(length - 1).addClass(_this.activeClass).siblings().removeClass(_this.activeClass);
            } else {
                $("ul>li", parent).eq(index - 1).addClass(_this.activeClass).siblings().removeClass(_this.activeClass);
            }
        };
        SearchTip.prototype.keyDown_down = function (that) {
            var _this = this,
                parent = that.parents(".search-results"),
                index = $("ul>li.active", parent).index(),
                length = $("ul>li", parent).length;
            if (index == -1 || index == length - 1) {
                $("ul>li", parent).eq(0).addClass(_this.activeClass).siblings().removeClass(_this.activeClass);
            } else {
                $("ul>li", parent).eq(index + 1).addClass(_this.activeClass).siblings().removeClass(_this.activeClass);
            }
        };
        SearchTip.prototype.confirm = function (that) {
            //console.info('11111111111');
            $(this.result).find(".result").hide();
            if (that.hasClass("start")) {
                $('input[name="AirEndCity"]').focus();
            }
            if (that.hasClass("start1")) {
                $('input[name="AirEndCity1"]').focus();
            }
            var _this = this,
                dom = $("ul>li.active", this.result);
            if (dom.index() != -1) {
                var inputClass;
                if(that.hasClass('goCity')){
                    inputClass=".goCity";
                }
                else if(that.hasClass('leaveCity')){
                    inputClass=".leaveCity";
                }
                else if(that.hasClass('city')){
                    inputClass=".city";
                }
                // if(that.hasClass('goCity1')){
                //     inputClass=".goCity1";
                // }
                // else if(that.hasClass('leaveCity1')){
                //     inputClass=".leaveCity1";
                // }
                else if(that.hasClass('city1')){
                    inputClass=".city1";
                }
                //dom.parents(_this.result).find(inputClass).val(dom.text()).attr({
                dom.parents(_this.result).find(that).val(dom.text()).attr({
                    "data-id": dom.attr("data-id"),
                    "data-szm": dom.attr("data-id"),
                    "data-option": dom.text()
                });
            }
        };
        window.searchTip = SearchTip;
    })();
    /* var search = new searchTip();
     search.start({result:".search-results",ajaxUrl:"../../assets/json/airCity.json",ajaxUrl2:"../../assets/json//hotel.json",maxLength:2});*/
    var search = new searchTip();
    search.start({
        result: ".search-results",
        ajaxUrl:config._CONFIG_[config.__webState].airCityJson,
        ajaxUrl2: config.API.baseUrl + config.API.product.GetDepartureCityList+'?isRequireFilterByAirport=true',
        maxLength: 2
    });
    search=null;
