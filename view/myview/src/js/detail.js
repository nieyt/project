/**
 * Created by Alan(000058) on 2017/03/09.
 * Email: 1480801@qq.com
 */
import 'es5';
import {ga} from 'ga';
import basePC from'basePC';
import {stagesData,html_decode,cookieFun,noData,layerTips} from './mod/mod-public-method';
import * as config from './mod/mod-public-config';
import 'layerPc301';
import './control/pagerControl';
import 'datePicker';
import {carosuel} from './control/imgScroll';
import {watchScroll,tabScroll} from './control/watchScroll';
import {bookingInfor} from './mod/mod-public-template';
ga();
class Render extends basePC{
    constructor(...age) {
        super(...age);
        this.filterBase = $('#filterBase');
        this.filterMore = $('#filterMore');
        this.filterSelected = $('#filterselected');
        this.resultBody = $('#boxContent');
        this.ajaxCount = 0;
        this.ajaxComplete = 0;
        this.config = config;
        this.curHref=window.location.href;
        let ProductInfor=JSON.parse(cookieFun.getCookie("ProductInfor"));
        let productKey="";
        if(ProductInfor&&ProductInfor.ProductKey){
            productKey=ProductInfor.ProductKey;
            this.oriProductID=ProductInfor.produceId;
            this.productType=ProductInfor.ProductType;
        }
        this.productKey=productKey;
        this.productPrice=0;//产品总价
        this.loading=new AjaxLoading();//实例化加载
        this.noData=new noDataShow();
        this.totlaPrice=0;//日历价格选择总价
        this.productExpireDateReal=productDetail.ExpireDate?dataOption.getYearMonthDay(productDetail.ExpireDate):null;//获取产品有效期
        this.productExpireDate = productDetail.ExpireDate?dataOption.getYearMonth(productDetail.ExpireDate,-1):null;//获取产品有效期
        this.produceId=config.URL.parse_url(this.curHref)['ProductID']||productDetail.ProductID;
        this.segmentList=[];
        this.productSegmentID=[];
        this.productTicketResourceID=[];
        this.adults=productDetail.MinBookingCount||2;//成人数
        this.children=0;//儿童数
        this.carr=[];//记录产品详情类别元素
    }
    init() {
        let that=this;
        this.bindControl(); //绑定初始控件
        //获取初始化价格
        this.outStartPrice(productDetail.ProductType,productDetail.startPrice,function () {
            layerTips(".tooltip");
        });
        //显示预定信息
        if(this.oriProductID==this.produceId){
            this.loadBookingInfor(this.productKey);
        }
        else{
            cookieFun.delCookie("ProductInfor");
        }
    }
    getParam(){
        //获取并保存所有URL上的参数
        let urlParam = this.parseUrl();
        // this.param = $.extend(this.param,urlParam,{ChildAgeList:(!urlParam.ChildAgeList ? new Array() : urlParam.ChildAgeList.split(','))});
        return !0;
    }
    //输出初始价格、支持分期和起价规则,ProductType:产品类型，startPrice：产品起价，callback：回调函数
    outStartPrice(ProductType,startPrice,callback){
        var titlePrice=[];
        var str = '',stagesHtml="",startPriceHtml="";
        stagesHtml='<span class="support tooltip" data-text="'+stagesData.dataText+'">支持分期</span>';
        str= '<span class="spRule tooltip" data-text="">';
        str='<b>起价说明：</b><br><p>1、本起价是在可选出发日期中，按双人出行共用一间房核算的最低单人价格，未包含附加服务费（如单人房差、保险费等）；</p><p>2、产品最终价格会根据您所选择的出发日期、出行人数、入住酒店房型、航班或交通以及所选附加服务的不同而有所差别。</p><p>详情请见费用说明</p>';
        if(ProductType == 2){
            str = '<b>起价说明：</b><br><p>本起价未包含附加服务费(如单人房差、保险费等)的基本价格。您最终确认的价格将会随所选出行日期、人数及服务项目而相应变化。</p><p>详情请见费用说明</p>';
        }else if(ProductType == 3){
            stagesHtml="";
        }
        var $titlePrice= $('#titlePrice');
        if(startPrice<0){
            startPriceHtml="<span class='proPrice'><b style='font-size: 18px'>实时特价</b></span>";
        }
        else{
            startPriceHtml="<span class='proPrice'><dnf>￥</dnf>"+startPrice+"<em>起</em></span>";
        }
        titlePrice.push(stagesHtml+'<span  class="spRule tooltip" data-text="'+ html_decode(str) +'">起价规则</span>'+startPriceHtml+'');
        $titlePrice.html(titlePrice.join(''));
        if(typeof callback == 'function'){
            callback();
        }
    }
    bindControl(){
        let that=this;
        //详情页公用方法
        this.CommonAction();
        //日历价格与成人儿童联动
        this.priceTotalMod(productDetail,productDetail.ProductType,function(){
            if(!productDetail.IsCanBooking){
                $('#stepNext').addClass("ordering").html('未上架');
            }
            //给立即预定添加事件
            $('#stepNext').on('click',function(){
                if(!productDetail.IsCanBooking){
                    that.openPop("抱歉，该产品还未上架，现在不可以预定！");
                    return;
                }
                if(productDetail.Status!=5){//当产品在后台未设置上限时不可以下单
                    that.openPop("抱歉，产品未上线不能下单！");
                    return;
                }
                if($(this).hasClass('disabled')) {
                    $("#popDate").click();
                    return;
                }
            })
            //弹出日历
            $("#popDate").on('click',function () {
                $("#pcDatePop").addClass("pcDatePop").fadeIn('fast');
                $("#popShade").fadeIn();
            })
            //关闭日历
            $("#popCancel").on("click",function () {
                $("#pcDatePop").removeClass("pcDatePop");
                $("#popShade").hide();
                $("#hdtNum").val(that.adults);
                $("#chdNum").val(that.children);
                that.upDatePriceHtml(that.productPrice);
            })
            //选择日历并且确定
            $("#popSure").on("click",function () {
                if(!productDetail.IsCanBooking){
                    that.openPop("抱歉，该产品还未上架，现在不可以预定！");
                    return;
                }
                if(productDetail.Status!=5){//当产品在后台未设置上限时不可以下单
                    that.openPop("抱歉，产品未上线不能下单！");
                    return;
                }
                if($(this).hasClass('disabled')) {
                    that.openPop("请点击预定选择航班！");
                    return;
                }
                $("#pcDatePop").removeClass("pcDatePop");
                $("#popShade").hide();
                //$(this).addClass("ordering").html('预定中...');

                //loading.open({"maskClass": "hide"});
                var hdtNum = $('#hdtNum').val();
                var chdNum = $('#chdNum').val();
                if(productDetail.ProductType==3){
                    chdNum=hdtNum;
                }
                var submitPara={
                    "productID": that.produceId,
                    "scheduleID": $(this).attr('ScheduleID'),
                    "adultQuantity": hdtNum,
                    "childrenQuantity":chdNum
                };
                $.ajax({
                    type: 'GET',
                    async: true,
                    dataType: "json",
                    data: submitPara,
                    url:config.API.baseUrl + config.API.product.GetProductResourceItems,
                    beforeSend:function () {
                        if(productDetail.ProductType!=2){
                            $("#bookingAction").html("").show();
                        }
                        that.loading.open({"maskClass": "hide","target": "#bookingAction"});
                    },
                    success: function (data) {
                        //测试结束
                        if (data.Code == 200 && data && typeof data.Data === "object") {
                            cookieFun.delCookie("ProductInfor");
                            var ProductKey=data.Data.ProductKey;
                            var cookieData={
                                "ProductKey":ProductKey,
                                "produceId":that.produceId,
                                "productType":data.Data.PkgProductInfo.ProductType
                            };
                            cookieFun.setCookie("ProductInfor",JSON.stringify(cookieData));
                            that.loadBookingInfor(ProductKey);
                            //window.location.href=that.curHref+"?productKey="+ProductKey;
                        }
                        else if(data.Code!=4){
                            that.openPop(data.Msg);
                        }
                    },
                    error:function (e) {
                        that.openPop(e);
                    },
                    complete:function () {
                        //that.loading.remove();
                    }
                })
            })
            layerTips(".chdTip .tooptip");
        });
        //日期价格载入
        this.getPcDate(function(priceStartDate){
            var myNext =$('#pcDate .myNext');//add by 000144
            $('#pcDate .myPrev').addClass('disabled');
            var StrpriceStartDate=priceStartDate?priceStartDate:new Date();
            if(dataOption.timestamp(that.productExpireDate)<=dataOption.timestamp(StrpriceStartDate)){
                myNext.addClass('disabled');
            }
            else{
                myNext.removeClass('disabled');
            }
            that.carrAction();//产品详情信息联动js
            //$("#travelDateTitle").show();
        });
        //绑定产品关联
        this.loadProductRelation();

    }
    //详情页公用方法
    CommonAction(){
        //绑定图片轮播
        if(scrollImgUrl.length>0){
            var option = {
                img: scrollImgUrl,
                father: '.v_cont',
                width: 95,
                height: 70,
                prev: ".sliderPrevBtn",
                next: '.sliderNextBtn',
                father: '#fatherCarosuel',
                child: '.smallImgList',
                wrap:'.sliderWrapper'
            };
            carosuel(option);//给轮播图片绑定事件
        }
        //产品详情
        var $tr = $('#ProductIntroDesc');
        if($tr&&!$tr.hasClass('hide')){
            this.carr.push($tr);
        }
        //推荐行程
        var $it = $('#itinerary');
        if($it&&!$it.hasClass('hide')){
            this.carr.push($it);
        }
        //费用说明
        var $fd = $('#feeDescription');
        if($fd&&!$fd.hasClass('hide')){
            this.carr.push($fd);
        }
        //预订须知
        var $st = $('#attention');
        if($st&&!$st.hasClass('hide')){
            this.carr.push($st);
        }
        //签证须知
        var $vs=$("#VisaInfro");
        if($vs&&!$vs.hasClass('hide')){
            this.carr.push($vs);
        }
        //其他信息
        var $ot = $('#otherInformation');
        if($ot&&!$ot.hasClass('hide')){
            this.carr.push($ot);
        }
    }
    carrAction(){
        this.carrPush(this.carr);
        if($("#tabs li").length>0){
            tabScroll();
        }
        if(!$("#itinerary").hasClass("hide")){
            watchScroll();//行程安排电梯
        }
    }
    //插入数据
    carrPush(carr){
        var newHarr = [],daysHarr =[];
        $.each(carr, function(i, v){
            newHarr.push($(this).offset().top)
        });
        $.each($(".newitinerary_con>li"),function(){
            daysHarr.push($(this).offset().top);
        });
        $('#tabs').data('heightArray', newHarr);
        $('#tabs').data('daysHeightArray', daysHarr);
    }
    datePicker(o, options){
        let that = this;
        o.DatePicker($.extend({
            format: 'Y-m-d',
            date: o.val(),
            current: o.val(),
            prev: '',
            next: '',
            calendars: 2,
            starts: 1,
            position: 'bottom',
            wrapClass: "priceDate pcDate",
            showBtn:true,
            onRender: function (date) {
                return {
                    disabled: (date.valueOf() <= new Date().valueOf())
                }
            },
            onBeforeShow: function () {
                // $('#inputDate').DatePickerSetDate($('#inputDate').val(), true);
                //$('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                o.val(formated).DatePickerHide();
                //选择时间后，调用判断时间 控件  （绑定回调函数）
                that.checkDate();
            }
        },options));
    }
    //弹层控件
    openLayer(option) {
        let _this = this;
        layer.open(
            $.extend({
                title: "每间房间入住人数",
                content: '',
                area: ['460px'],
                btn: ['确定'],
                btnAlign: 'c',
                move:0,
                skin:"",
                fixed:false
            },option)
        );
    }
    //弹框提示
    openPop(content){
        layer.open({
            title: '提示'
            , content: content
        });
    }
    //日历价格与成人、儿童联动
    priceTotalMod(data,ProductType,callback){
        var priceTotalMod="";
        var stageLowPrice=parseFloat(data.startPrice/12);
        if(ProductType==3){
            priceTotalMod='<div class="nextstep">'+
                '<a id="popCancel" class="yellowBtn popCancel">关闭</a>'+
                '<a id="popSure" class="yellowBtn popSure disabled">确定</a>'+
                '<a class="stepnext disabled" id="stepNext">立即预定<i style="font-family: simsun;margin-left: 5px;">&gt;</i></a>'+
                '<i id="totalPriceStr" class="totalPriceStr"><span class="font">总价格</span><span class="price">￥0</span></i>'+
                '</div>'+
                '<div class="tp" id="popDate">请点击预订选择班期</div>'+
                '<div class="choosenum">'+
                '<i>购买份数</i>'+
                '<span class="">'+
                '<a class="minus" onclick="CalendarPrice01.subNum(\'hdtNum\',true)"></a>'+
                '<input id="hdtNum"  minNum="1"  maxNum="9" minBc="'+ (data.MinBookingCount ? data.MinBookingCount : 1) +'" onchange="CalendarPrice01.countPriceRoomNum(\'hdtNum\'); CalendarPrice01.kebCompute(\'hdtNum\')" onkeyup="this.value.replace(\/\\D\/g,\'\');CalendarPrice01.countPriceRoomNum(\'hdtNum\'); CalendarPrice01.kebCompute(\'hdtNum\')" onafterpaste="this.value.replace(\/\\D\/g,\'\');CalendarPrice01.countPriceRoomNum(\'hdtNum\');"  type="text" value="'+ data.MinBookingCount +'">'+
                '<a class="add" onclick="CalendarPrice01.addNum(\'hdtNum\',true)"></a>'+
                '</span>'+
                '</div>';
        }else if(ProductType==1||ProductType==2){
            priceTotalMod='<div class="nextstep">'+
                '<a id="popCancel" class="yellowBtn popCancel">关闭</a>'+
                '<a id="popSure" class="yellowBtn popSure disabled">确定</a>'+
                '<a class="stepnext disabled" id="stepNext">立即预订<i style="font-family: simsun;margin-left: 5px;">&gt;</i></a>'+
                '<i id="totalPriceStr" class="totalPriceStr"><span class="font">总价格</span><span class="price" data-price="'+(data.totlaPrice?data.totlaPrice:0)+'"><i>￥</i>'+(data.totlaPrice?data.totlaPrice:0)+'</span></i>'+
                '</div>'+
                '<div class="isStagesMod" style="display: none">仅需首付<span class="price"><i>￥</i><em class="num"></em></span>&nbsp;起<em class="tooptip" data-trigger="hover" id="tooptip-Stages" data-class="newStyle" data-place="top" data-bottom="40px" data-right="" data-width="370px" data-text="'+stagesData.dataText+'"></em></span></div>'+
                '<div class="tp" id="popDate">请点击预订选择班期</div>'+
                '<div class="choosenum">'+
                '<i>成人</i>'+
                '<span class="">'+
                '<a class="minus" onclick="CalendarPrice01.subNum(\'hdtNum\',true)"></a>'+
                '<input id="hdtNum" minNum="1" maxNum="9" minBc="'+ (data.MinBookingCount ? data.MinBookingCount : 1) +'" onchange="CalendarPrice01.countPriceRoomNum(\'hdtNum\');CalendarPrice01.kebCompute(\'hdtNum\')" onkeyup="this.value.replace(\/\\D\/g,\'\');CalendarPrice01.countPriceRoomNum(\'hdtNum\');CalendarPrice01.kebCompute(\'hdtNum\', true)" onafterpaste="this.value.replace(\/\\D\/g,\'\');CalendarPrice01.countPriceRoomNum(\'hdtNum\');"  type="text" value="' + (data.AdultQuantity?data.AdultQuantity:data.MinBookingCount) + '">'+
                '<a class="add" onclick="CalendarPrice01.addNum(\'hdtNum\',true)"></a>'+
                '</span>'+
                '</div>'+
                '<div class="choosenum chdChooseNum">'+
                '<i class="chdTip">儿童（2-12岁）<em class="tooptip" data-trigger="hover" id="ga_pcjdetail_icon" data-class="newStyle" data-place="top" data-bottom="40px"  data-left="-42px" data-width="300px" data-text="<h3><b>说明内容:</b></h3><p> 1.儿童不能单独预订</p><p> 2.成人+儿童 最多支持9人</p><p>3.儿童入住需遵循酒店儿童政策，详见购买须知</p><p>4.儿童年龄以最晚航班起飞日期为准</p>"></em></i>'+
                '<span class="">'+
                '<a class="minus" onclick="CalendarPrice01.subNum(\'chdNum\',true)"></a>'+
                '<input id="chdNum" maxlength="1" minNum="0" maxNum="6" type="text" value="'+(data.ChildrenQuantity?data.ChildrenQuantity:0)+'" onkeyup="CalendarPrice01.kebCompute(\'chdNum\', true)">'+
                '<a class="add" onclick="CalendarPrice01.addNum(\'chdNum\',true)"></a>'+
                '</span>'+
                '</div>';
        }
        $('#Numnext').html(priceTotalMod);
        if(typeof callback == 'function'){
            callback();
        }
    }
    //价格联动计算
    CalendarPrice01(){
        let that=this;
        var pcc = {
            regJudge: function (arg) {
                var reg = /^([0-9]\d*)$/;
                if (reg.test(arg)) {
                    return arg;
                } else {
                    return arg.replace(/\D+/g, '');
                }
            },
            childVar: function () {
                var getchdNum = $('#chdNum').val();
                if (getchdNum) {
                    return getchdNum;
                } else {
                    return 0;
                }
            },
            adultVar: function () {
                var gethdtNum = $('#hdtNum').val();
                return this.regJudge(gethdtNum);

            },
            personSum: function () {
                return parseInt(this.childVar()) + parseInt(this.adultVar());
            },
            maxPopInfo: function () {
                var adultInput = $('#hdtNum');
                var maxPes = parseInt(adultInput.attr('maxNum'));
                var str = '根据航空公司规定,出行人数不能超过' + maxPes + '人,<br> 10人以上独立成团，请尽快联系4009695530获取最低出行价！';
                return str;
            },
            adultVschildInfo: '根据航空公司规定,一名成人最多只能带两个儿童！',
            minBookingCount: function () {
                var adultInput = $('#hdtNum');
                var minBc = parseInt(adultInput.attr('minBc') || 1);    //Min booking count
                var str = '最少预订人数为' + minBc + '人';
                return str;
            }
        }
        var  subNum=function(id,Price){
            //--add by joldy
            var childInput = $('#chdNum');
            var adultInput = $('#hdtNum');
            var minBc = parseInt(adultInput.attr('minBc') || 0);
            //--end and
            var $sub = $("#" + id);
            var num = $sub.val();
            var minNum =$sub.attr('minNum');
            if (num >= minNum&&num>0) {
                //--add by joldy
                if(id == 'hdtNum'){
                    if(pcc.personSum() <= minBc){
                        that.openPop(pcc.minBookingCount());
                    }else{
                        $sub.val(parseInt(num) - 1);
                    }
                    if(pcc.adultVar()>minBc&&pcc.childVar() / pcc.adultVar() > 2) {
                        that.openPop(pcc.adultVschildInfo);
                        childInput.val(0);
                        adultInput.val(minBc);
                    }
                }else {
                    if(pcc.personSum() > minBc){
                        $sub.val(parseInt(num) - 1);
                    }
                }
                if(Price){countPriceRoomNum(id);};
            }
        };
        var addNum=function(id,Price){
            var num = $("#" + id).val();
            var maxnum = parseInt($("#" + id).attr('maxNum'));
            //--add by joldy
            var childInput = $('#chdNum');
            var adultInput = $('#hdtNum');
            var minBc = parseInt(adultInput.attr('minBc'));
            var maxPes = parseInt(adultInput.attr('maxNum'));
            if(num<=maxPes){
                //--add by joldy
                if(id == 'hdtNum'){
                    if(pcc.personSum() < maxPes){
                        $("#" + id).val(parseInt(num) + 1);
                    }else{
                        that.openPop(pcc.maxPopInfo());
                    }
                }else{
                    if(pcc.personSum() <= maxPes) {
                        $("#" + id).val(parseInt(num) + 1);
                    }
                    if(pcc.personSum() > maxPes){
                        childInput.val(0);
                        that.openPop(pcc.maxPopInfo());
                    }else if(pcc.childVar() / pcc.adultVar() > 2){
                        childInput.val(0);
                        if(pcc.personSum() < minBc){
                            adultInput.val(minBc);
                        }
                        that.openPop(pcc.adultVschildInfo);
                    }
                }
                if(Price){countPriceRoomNum(id);};
            }
        };
        var kebCompute = function(id,Price){
            var _t = $('#' + id);
            var num =  _t.val();
            var maxnum = parseInt( _t.attr('maxNum'));
            //if(num>maxnum){num=maxnum;$("#" + id).val(maxnum)};
            //--add by joldy
            var childInput = $('#chdNum');
            var adultInput = $('#hdtNum');
            var minBc = parseInt(adultInput.attr('minBc') || 0);    //Min booking count
            var maxPes = parseInt(adultInput.attr('maxNum'));
            var reg = /^([0-9]\d*)$/;
            if(!reg.test(_t.val())){
                _t.val(num.replace(/\D+/g, ''));
            }else{
                if(num<=maxPes){
                    if(id == 'hdtNum') {
                        //alert(pcc.personSum())
                        //--add by joldy

                        if(pcc.personSum() < minBc){
                            adultInput.val(minBc - childInput.val());
                            that.openPop(pcc.minBookingCount());
                        }
                        if(pcc.personSum() > maxPes){
                            adultInput.val(maxPes - pcc.childVar());
                            that.openPop(pcc.maxPopInfo());
                        }
                    }else{
                        if(pcc.personSum() > maxPes){
                            childInput.val(0);
                            that.openPop(pcc.maxPopInfo());
                        }else if(pcc.childVar() / pcc.adultVar() > 2){
                            childInput.val(0);
                            that.openPop(pcc.adultVschildInfo);
                        }
                    }
                    if(Price){countPriceRoomNum(id);};
                }else{
                    num = maxnum;
                    $("#" + id).val(maxnum);
                }
            }
        };
        //CalendarPrice01.countPriceRoomNum
        var countPriceRoomNum = function(id){
            var num = $("#" + id).val();
            var minBc = parseInt( $("#" + id).attr('minBc') || 0);    //Min booking count
            var maxnum = parseInt($("#" + id).attr('maxNum'));
            if(num>maxnum){num=maxnum;$("#" + id).val(maxnum)};
            if(num<minBc){
                that.openPop(pcc.minBookingCount());
                num= minBc;
                $("#" + id).val(minBc);
            }
            var simpleValue = parseFloat($('#totalPriceStr .price').attr('simpleprice')||0);
            var chdValue = parseFloat($('#totalPriceStr .price').attr('chdpricenum')||0);
            var totlaPrice;
            if(pcc.personSum() <= 9){
                //if(that.productKey)
                var adupersonNum = parseInt(pcc.adultVar());
                var childpersonNum = parseInt(pcc.childVar());
                if(simpleValue<0){
                    that.totlaPrice="实时特价";
                    $('#totalPriceStr .price').html("<i style='font-size: 18px'>实时特价</i>");
                    $("#Numnext .isStagesMod").hide();
                }
                else{
                    that.totlaPrice=parseFloat((simpleValue*adupersonNum+childpersonNum*chdValue).toFixed(2));
                    that.upDatePriceHtml(that.totlaPrice);
                }
            }
            //修改人数弹出日历框
            if(!$("#pcDatePop").hasClass("pcDatePop")){
                $("#popDate").click();
            }
        }
        return{
            subNum:subNum,
            addNum:addNum,
            countPriceRoomNum:countPriceRoomNum,
            kebCompute:kebCompute
        };
    }
    //价格日历载入
    getPcDate(callback){
        let that=this;
        //价格日历
        let options = {
            isDateAjax:true,//是否请求加载数据
            nowDate : new Date(),//当前日期
            startDate:dataOption.getYearMonth(new Date()),//起始月份
            dateData:null,//日期价格存储
            priceStartDate:null,
            dateConversion:function(e){ //时间转换
                var month=new Date(e).getMonth() + 1 ,date = new Date(e).getDate();
                if(month<10){
                    month="0"+month;
                };
                if(date<10){
                    date="0"+date;
                };
                return new Date(e).getFullYear()+'-'+month+'-'+ date;
            },
            otherdateConversion:function(e) {//时间转换
                var newOdate = e.substring(0,10);
                return newOdate;
            },
            getDateData:function(callback){//获取价格数据
                if(options.isDateAjax){
                    var paramData ={
                        "ProductID": that.produceId,
                        "StartDepScheduleDate": options.startDate,
                        "EndDepScheduleDate": that.productExpireDateReal
                    };
                    $.ajax({
                        type: "post",
                        beforeSend: function () {
                            options.isDateAjax = false;
                        },
                        data: paramData,
                        url:config.API.baseUrl + config.API.travel.GetProductDatePrice,
                        async: true,
                        success: function (data) {
                            if (data.Code == 200 && data && typeof data.Data === "object") {
                                options.dateData = data.Data.PkgProductScheduleList;
                                options.getPriceStartDate();
                                if(typeof callback == 'function'){
                                    callback();
                                }
                            }
                            else{
                                if(data.Msg){
                                    that.openPop(data.Msg);
                                }else{
                                    that.openPop(data.Message);
                                }
                            }
                        },
                        error:function(e){
                            that.openPop(e);
                        },
                        complete:function(e){
                            $("#hotelDetailBox").removeClass("loadingHidden");
                            $("#ajax_loading").remove();
                        }
                    });
                }
            },
            getPriceStartDate:function(){//获取价格初始月份
                if(options.dateData){
                    var realNum=0;
                    for(var i = 0 ;i < options.dateData.length; i++){
                        var Quantity = parseInt(options.dateData[i].Quantity);
                        var priceNum = options.dateData[i].Amount;
                        if((priceNum>0||priceNum<0)&&Quantity>0){
                            realNum++;
                            if(realNum==1){
                                options.priceStartDate=options.dateData[i].DepartureDate.substring(0,7);
                            }
                        }
                    }
                }
            },
            getNowDatePrice:function(e){//获取当前价格
                var nowDate = options.dateConversion(e);
                var hasPrice=false;
                if(options.dateData){
                    for(var i = 0 ;i < options.dateData.length; i++){
                        if(options.otherdateConversion(options.dateData[i].DepartureDate) == nowDate){
                            var Quantity = parseInt(options.dateData[i].Quantity);
                            var priceNum = options.dateData[i].Amount;
                            var chdpriceNum = options.dateData[i].ChildAmount?options.dateData[i].ChildAmount:priceNum;
                            if(priceNum==0||Quantity<=0){return '<span class="noPrice">--</span>';hasPrice=false};//如果价格和库存为0则过滤掉
                            if(priceNum<0){
                                return "<span class='price dynamicPrice' chdpriceNum="+chdpriceNum+" priceNum="+priceNum+"  ScheduleID="+options.dateData[i].ID+">实时特价</span>";
                                hasPrice=false;
                            }
                            return "<span class='price' chdpriceNum="+chdpriceNum+" priceNum="+priceNum+"  ScheduleID="+options.dateData[i].ID+">￥"+priceNum+"起</span>";
                            hasPrice=true;
                        }
                    }
                }
                if(!hasPrice){
                    return '<span class="noPrice">--</span>';
                }
            }
        };
        options.getDateData(function(){
            var DPcurrent =options.priceStartDate?options.priceStartDate+"-01":"";
            $('#pcDate').DatePicker({
                flat: true,
                date: ['',''],
                calendars: 2,
                mode: 'single',
                starts: 1,
                wrapClass:"priceWrap pcDate w500",
                prev: "",
                next: "",
                weekType:'daysMax',
                onlyDays:true,
                current:DPcurrent,
                onRender: function(date) {
                    //$('#stepNext').addClass('disabled');
                    var priceInfro,addClassName;
                    priceInfro=options.getNowDatePrice(date);
                    addClassName='';
                    if(priceInfro.indexOf('noPrice')>0){
                        addClassName='datepickerDisabled';
                    }
                    return {
                        disabled: (date.valueOf() < options.nowDate.valueOf()-24*60*60*1000),//禁用日期
                        className:addClassName,
                        price: priceInfro
                    }
                },
                onChange: function(formated, dates,domParent,dom){
                    $('#stepNext,#popSure').removeClass('disabled');
                    $('#stepNext,#popSure').attr('ScheduleID',$(dom).find('.price').attr('ScheduleID'));
                    var price=$(dom).find('.price').attr("pricenum");
                    var chdPrice=$(dom).find('.price').attr("chdpricenum");
                    $('#totalPriceStr .price').attr('simplePrice',price).attr("chdpricenum",chdPrice);
                    CalendarPrice01.countPriceRoomNum('hdtNum');
                },
                onChangeYear:function(date){
                    //var curDate = dataOption.getYearMonth(options.nowDate);
                    options.startDate = dataOption.getYearMonth(new Date(date));
                    if(that.productExpireDate==options.startDate){
                        $('#pcDate .myNext').addClass('disabled');
                    }
                    else{
                        $('#pcDate .myNext').removeClass('disabled');
                    }
                    if(options.priceStartDate==options.startDate){
                        $('#pcDate .myPrev').addClass('disabled');
                    }else{
                        $('#pcDate .myPrev').removeClass('disabled');
                    }
                    //切换月份
                }
            });
            if(typeof callback == 'function'){
                callback(options.priceStartDate);
            }
        });
    }
    //加载预定信息
    loadBookingInfor(productKey){
        let that=this;
        if(productDetail.ProductType!=2){
            $("#bookingAction").html("").show();
        }
        if(productKey){
            $.ajax({
                type: "GET",
                dataType: "json",
                url:config.API.baseUrl + config.API.product.GetProductResourceItems+"?productKey="+productKey,
                beforeSend:function () {
                    that.loading.open({"maskClass": "hide","target": "#bookingAction"});
                },
                success: function (data) {
                    if (data.Code == 200 && data && typeof data.Data === "object") {
                        that.productKey=data.Data.ProductKey;
                        that.getBookingPartInfor(data.Data);
                        that.loadBookingHtml(data.Data);
                    } else {
                        //freeProduce.noDataModel(1);
                    }
                },
                complete: function () {
                    that.loading.remove();
                }
            });
        }
    }
    //抽取产品预订信息中的信息
    getBookingPartInfor(data){
        let that=this;
        let segmentList=[];
        let productResource = data.ProductResourceItemList;
        productResource.forEach(function (value, item) {
            var productSegment = value.ProductSegment;
            var airPlaneTicketList = value.AirPlaneTicketList;
            that.productTicketResourceID[item]="";
            if (airPlaneTicketList && airPlaneTicketList.length > 0) {
                let segment={
                    SegmentID:productSegment.ID,   //行程段id
                    Direction:productSegment.GoBackType,       //去程或返程
                    RelationID:productSegment.RelationSegmentID    //关联id
                }
                that.productTicketResourceID[item]=airPlaneTicketList[0].ResourceID;
                segmentList.push(segment);
            }
        });
        this.segmentList=segmentList;
        this.countTotalPriceInt(data.ProductDefultPriceList);
    }
    //加载预订信息
    loadBookingHtml(data){
      //if(productDetail.ProductType!=2){
          //只有自由行跟目的地才能加载数据
          let bookingHtml=bookingInfor({data:data});
          $("#bookingAction").html(bookingHtml);
          this.laodOtherProduct(data);
          this.loadBookingAction();
      //}
    }
    //加载附加产品
    laodOtherProduct(data){
        let that=this;
        let zIndex=1000;
        var productResource = data.ProductResourceItemList;
        let freeInfro=[];
        freeInfro.push('<div class="otherDefaultBox mt10"><div class="icoBox"><span class="other_ico"></span><span class="newCeairIco">附加产品</span></div><div class="otherTicketContent"><div class="freeResource"><table class="ct_table"><thead><tr><th>类型</th><th>产品名称</th><th>使用日期</th><th>份数</th><th>单价</th></tr></thead>');
        productResource.forEach(function (value, item) {
            var productSegment = value.ProductSegment;
            //门票和保险
            var scenSpotTicketList = value.ScenSpotTicketList;
            var insuranceList = value.InsuranceList;
            //机票红包
            var flightEnvelopeList = value.FlightEnvelopeList;
            //附加费用
            var localEntertainmentList = value.LocalEntertainmentList;
            var adults = parseInt(that.productKey.split("_")[2]);
            var children = parseInt(that.productKey.split("_")[3]);
            that.adults=adults;
            that.children=children;
            that.productSegmentID.push(productSegment.ID);
            //门票的信息
            $.each(scenSpotTicketList, function (v, k) {
                zIndex--;
                var originalPrice, bookingcounts;
                k.PriceInfoList.forEach(function (v, i) {
                    if (v.PassagerType == 1) {
                        bookingcounts = adults;
                    } else if (v.PassagerType == 2) {
                        bookingcounts = children;
                    }
                });

                originalPrice = k.PriceInfoList[0].OriginalPrice;
                //计算和区分房间数
                var roomNum = '';

                //价格是否显示
                if (k.IsRequire) {
                    k.SalePrice = "---";
                    k.ProductNum = '<div class="selectModel">' +
                        '<span>' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '</div>';
                } else {
                    var dsnNums;
                    if (that.productType == 3) {//目的地
                        dsnNums = adults * 2;
                    } else {
                        dsnNums = (adults + children) * 2;
                    }

                    if (k.TicketType == 1 && !!~k.ResourceName.indexOf("成人票")) {
                        for (var i = 0; i <= dsnNums; i++) {
                            roomNum += ('<li>' + i + '</li>');
                        }
                    } else if (k.TicketType == 1 && !!~k.ResourceName.indexOf("儿童票")) {
                        for (var i = 0; i <= dsnNums - (Math.ceil(dsnNums / 5)); i++) {
                            roomNum += ('<li>' + i + '</li>');
                        }
                    } else if (k.TicketType == 1 && !!~k.ResourceName.indexOf("老人票")) {
                        for (var i = 0; i <= dsnNums; i++) {
                            roomNum += ('<li>' + i + '</li>');
                        }
                    } else {
                        for (var i = 0; i <= 9; i++) {
                            roomNum += ('<li>' + i + '</li>');
                        }
                    }


                    k.SalePrice = "￥" + originalPrice;

                    k.ProductNum = '<div class="selectModel"  style="z-index:'+zIndex+'">' +
                        '<span class="select">' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '<ul class="downList">' +
                        roomNum +
                        '</ul>' +
                        '</div>';

                }

                //根据行程段计算门票的日期
                var useDateLists = '', ticketDate;

                for (var i = 0; i < productSegment.StayDays; i++) {
                    useDateLists += ('<li>' + dataOption.getYearMonthDay(new Date(new Date(productSegment.DepartureTime.slice(0, -9).replace(/\-/g, "/")).getTime() + i * 24 * 60 * 60 * 1000)) + '</li>');
                }
                ;

                ticketDate = '<div class="selectModel"  style="z-index:'+zIndex+'">' +
                    '<span class="select">' +
                    dataOption.getYearMonthDay(new Date(k.UseDate * 1000)) +
                    '</span>' +
                    '<ul class="downList">' +
                    useDateLists +
                    '</ul></div>';


                freeInfro.push('<tr class="adTicket">' +
                    '<td class="productType" data-segment="' +
                    productSegment.ID +
                    '" data-ticketid="' +
                    k.ResourceID +
                    '" data-tickettype="' +
                    k.TicketType +
                    '">' + '门票' + '</td>' +
                    '<td class="productName">' +

                    (function (_b) {
                        if (!!_b) {
                            return '<span class="tooptip" data-trigger="click" data-class="newStyle" data-place="top" data-bottom="45px"  data-left="-160px" data-width="500px" data-text="' +
                                dataOption.textReplace(k.BookingLimit) +
                                '">' +
                                '<a id="ga_pcjselect_fjzy" class="grayColor" style="cursor: help;">' +
                                k.ResourceName +
                                '</a>' +
                                '</span>'
                        } else {
                            return '<a id="ga_pcjselect_fjzy" class="grayColor">' +
                                k.ResourceName +
                                '</a>'
                        }
                    })(k.BookingLimit) +

                    '</td>' +
                    '<td class="productDate">' +
                    ticketDate +
                    '</td>' +
                    '<td class="productNum">' +
                    ((k.ProductNum) == null ? '' : k.ProductNum) +
                    '</td>' +
                    '<td class="productPrice"><span data-originalPrice="' +
                    originalPrice +
                    '" class="price">' + k.SalePrice + '</span></td>' +
                    '</tr>');
            });
            //保险的信息
            $.each(insuranceList, function (v, k) {
                zIndex--;
                var originalPrice, bookingcounts;
                k.PriceInfoList.forEach(function (v, i) {
                    if (v.PassagerType == 1) {
                        bookingcounts = adults;
                    } else if (v.PassagerType == 2) {
                        bookingcounts = children;
                    }
                });
                originalPrice = k.PriceInfoList[0].OriginalPrice;
                //计算和区分保险数
                var roomNum = '';
                //价格是否显示
                if (k.IsRequire) {
                    k.SalePrice = "---";

                    k.ProductNum = '<div class="selectModel">' +
                        '<span>' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '</div>';
                } else if (k.IsDefault) {
                    //额外判断是否隐藏下拉框
                    if (bookingcounts == 0) {
                        k.ishide = true;
                    }
                    for (var i = 0; i <= bookingcounts; i++) {
                        roomNum += ('<li>' + i + '</li>');
                    }
                    ;
                    k.SalePrice = "￥" + originalPrice;

                    k.ProductNum = '<div class="selectModel"  style="z-index:'+zIndex+'">' +
                        '<span class="select">' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '<ul class="downList">' +
                        roomNum +
                        '</ul></div>';
                } else {
                    //额外判断是否隐藏下拉框
                    if (bookingcounts == 0) {
                        k.ishide = true;
                    }
                    for (var i = 0; i <= bookingcounts; i++) {
                        roomNum += ('<li>' + i + '</li>');
                    }
                    ;
                    k.SalePrice = "￥" + originalPrice;

                    k.ProductNum = '<div class="selectModel" style="z-index:'+zIndex+'">' +
                        '<span class="select">' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '<ul class="downList">' +
                        roomNum +
                        '</ul></div>';
                }
                ;

                if (!k.ishide) {
                    freeInfro.push('<tr class="insurance">' +
                        '<td class="productType" data-segment="' +
                        productSegment.ID +
                        '" data-insuranceid="' +
                        k.ResourceID +
                        '">' + '保险' + '</td>' +
                        '<td class="productName"><a id="ga_pcjselect_fjzy" class="grayColor">' + k.ResourceName + '</a></td>' +
                        '<td class="productDate">' + '</td>' +
                        '<td class="productNum">' +
                        ((k.ProductNum) == null ? '' : k.ProductNum) +
                        '</td>' +
                        '<td class="productPrice"><span data-price="' +
                        k.SalePrice.slice(1) +
                        '" class="price">' + k.SalePrice + '</span></td></tr>');
                }
            });
            //机票红包的信息
            $.each(flightEnvelopeList, function (v, k) {
                zIndex--;
                var originalPrice;
                originalPrice = k.PriceInfoList[0].OriginalPrice;
                //计算和区分红包数
                var roomNum = '';
                //价格是否显示
                if (k.IsRequire) {
                    k.SalePrice = "---";
                    k.ProductNum = '<div class="selectModel">' +
                        '<span>' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '</div>';
                } else if (k.IsDefault) {
                    for (var i = 0; i <= 1; i++) {
                        roomNum += ('<li>' + i + '</li>');
                    }
                    ;
                    k.SalePrice = "￥" + originalPrice;
                    k.ProductNum = '<div class="selectModel"  style="z-index:'+zIndex+'">' +
                        '<span class="select">' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '<ul class="downList">' +
                        roomNum +
                        '</ul></div>';
                } else {
                    for (var i = 0; i <= 1; i++) {
                        roomNum += ('<li>' + i + '</li>');
                    }
                    ;

                    k.SalePrice = "￥" + originalPrice;
                    k.ProductNum = '<div class="selectModel"  style="z-index:'+zIndex+'">' +
                        '<span class="select">' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '<ul class="downList">' +
                        roomNum +
                        '</ul></div>';
                }
                ;

                freeInfro.push('<tr class="envelopeList">' +
                    '<td class="productType" data-segment="' +
                    productSegment.ID +
                    '" data-insuranceid="' +
                    k.ResourceID +
                    '">' + '机票红包' + '</td>' +
                    '<td class="productName"><a id="ga_pcjselect_fjzy" class="grayColor">' + k.ResourceName + '</a></td>' +
                    '<td class="productDate">' + '</td>' +
                    '<td class="productNum">' +
                    ((k.ProductNum) == null ? '' : k.ProductNum) +
                    '</td>' +
                    '<td class="productPrice"><span data-originalPrice="' +
                    originalPrice +
                    '" class="price">' + k.SalePrice + '</span></td>' +
                    '</tr>');
            });
            //附加费用的信息
            $.each(localEntertainmentList, function (v, k) {
                zIndex--;
                var originalPrice, bookingcounts;
                k.PriceInfoList.forEach(function (v, i) {
                    if (v.PassagerType == 1) {
                        bookingcounts = adults;
                    } else if (v.PassagerType == 2) {
                        bookingcounts = children;
                    }
                });

                originalPrice = k.PriceInfoList[0].OriginalPrice;
                //计算和区分房间数
                var roomNum = '';

                //价格是否显示 todo
                if (k.IsRequire) {
                    k.SalePrice = "---";
                    k.ProductNum = '<div class="selectModel">' +
                        '<span>' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '</div>';

                } else {
                    if (!!k.ForHotel) {
                        $(window).on('roomNum', function () {
                            var roomNum = '', roomLi = '.' + productSegment.ID + '_roomLis';
                            for (var i = 0; i <= $.cookie(productSegment.ID + '_roomNum'); i++) {
                                roomNum += ('<li>' + i + '</li>');
                            }
                            $(roomLi).html(roomNum);
                        });

                        for (var i = 0; i <= $.cookie(productSegment.ID + '_roomNum'); i++) {
                            roomNum += ('<li>' + i + '</li>');
                        }
                    } else {
                        for (var i = 0; i <= 30; i++) {
                            roomNum += ('<li>' + i + '</li>');
                        }
                    }

                    k.SalePrice = "￥" + originalPrice + '/' + k.SaleUnit;

                    k.ProductNum = '<div class="selectModel"  style="z-index:'+zIndex+'">' +
                        '<span class="select">' +
                        (!!k.BookingCount ? k.BookingCount : 0) +
                        '</span>' +
                        '<ul class="downList ' +
                        (function (_k) {
                            if (_k) {
                                return productSegment.ID + '_roomLis'
                            } else {
                                return ''
                            }
                        })(k.ForHotel) +
                        '">' +
                        roomNum +
                        '</ul>' +
                        '</div>';
                }

                //根据行程段计算本地玩乐的日期
                var useDateLists = '', ticketDate;

                for (var i = 0; i < productSegment.StayDays; i++) {
                    useDateLists += ('<li>' + dataOption.getYearMonthDay(new Date(new Date(productSegment.DepartureTime.slice(0, -9).replace(/\-/g, "/")).getTime() + i * 24 * 60 * 60 * 1000)) + '</li>');
                }

                if (k.CanSelectDate) {
                    ticketDate = '<div class="selectModel"  style="z-index:1">' +
                        '<span class="select">' +
                        dataOption.getYearMonthDay(new Date(k.ScheduleDate * 1000)) +
                        '</span>' +
                        '<ul class="downList">' +
                        useDateLists +
                        '</ul></div>';
                } else {
                    ticketDate = '<span class="select" style="display: none;">' +
                        dataOption.getYearMonthDay(new Date(k.ScheduleDate * 1000)) +
                        '</span>';
                }

                freeInfro.push('<tr class="localEntertainment">' +
                    '<td class="productType" data-segment="' +
                    productSegment.ID +
                    '" data-ticketid="' +
                    k.ResourceID +
                    '" data-unit="' +
                    k.SaleUnit +
                    '">' + '附加资源' + '</td>' +
                    '<td class="productName">' +
                    (function (_b) {
                        if (!!_b) {
                            return '<span class="tooptip" data-trigger="click" data-class="newStyle" data-place="top" data-bottom="45px"  data-left="-160px" data-width="500px" data-text="' +
                                dataOption.textReplace(k.BookingLimit) +
                                '">' +
                                '<a id="ga_pcjselect_fjzy" class="grayColor" style="cursor: help;">' +
                                k.ResourceName +
                                '</a>' +
                                '</span>'
                        } else {
                            return '<a id="ga_pcjselect_fjzy" class="grayColor">' +
                                k.ResourceName +
                                '</a>'
                        }
                    })(k.BookingLimit) +
                    '</td>' +
                    '<td class="productDate">' +
                    ticketDate +
                    '</td>' +
                    '<td class="productNum">' +
                    ((k.ProductNum) == null ? '' : k.ProductNum) +
                    '</td>' +
                    '<td class="productPrice"><span data-originalPrice="' +
                    originalPrice +
                    '" class="price">' + k.SalePrice + '</span></td>' +
                    '</tr>');
            });
        });
        freeInfro.push('</table></div></div></div>');
        if(freeInfro.length>2){
            $("#otherDefaultBox").html(freeInfro.join(""));
        }
    }
    //bookingAction');
    loadBookingAction(){
        var that=this;
        //下拉菜单
        selectdownList();
        //修改航班跳转
        $("#modyfyTicket").on("click",function () {
            let dataType=$(this).data("type");
            if(dataType!=2){
                dataType=1;
            }
            that.modifyParam("fly",dataType);
        })
        //修改酒店跳转
        $(".modifyHotel").on("click",function () {
            let seadPara={
                entryType:$(this).data("type"),  //调取接口类型（1：静态产品静态酒店；2：静态产品动态酒店；3：动态产品）
                HotelName:$(this).data("name"),  //酒店名称
                HotelCheckInDate:$(this).data("checkindate"), //酒店入住时间（时间戳格式）
                HotelCheckOutDate:$(this).data("checkoutdate"), //酒店离店时间
                ProductKey :that.productKey, //产品key
                SegmentID:$(this).data("segmentid"),  //行程段ID
                sigglePrice:$(this).siblings(".hotelContent").find(".checkCol .active").closest("tr").find(".roomTypeCol").data("siggleprice")
            };
            window.location.href=config._CONFIG_[config.__webState].modifyHotel+"?"+that.parseParam(seadPara);
        })
        //附加产品下拉框更改价格
        this.selectfreePrice();
        //酒店房间的选择和取消
        $(".roomTypeWrap").on("click", ".selected", function () {
            //debugger;
            //如果已经选中不让刷新页面 add 20160601
            if ($(this).hasClass("active")) {
                return false;
            } else {
                var segmentLists = [], segmentList = {};
                $(this).closest("tbody").find(".selected").removeClass("active");
                $(this).addClass("active");

                segmentList.SegmentID = $(this).closest(".hotelDefaultBox").find(".hotel_ico").data("segment");
                segmentList.NeedBookingHotel = 'true';
                segmentList.RoomList = [];
                segmentList.RoomList.push({
                    "RoomResourceID": $(this).closest("tr").find(".roomTypeCol ").data("roomid"),
                    "BookingCount": parseInt($(this).closest("tr").find(".roomNum .select").text())
                });
                segmentLists.push(segmentList);
                that.submitOption(segmentLists);
            }
        });
        //提交预定信息
        $("#stepNext").on("click",function () {
            that.submit();
        })
        layerTips(".bookingAction .tooptip,.bookingAction .tooltip");
        //让下一步按钮可以点
        $("#stepNext").removeClass("disabled").html("下一步<i style='font-family: simsun;margin-left: 5px;'>&gt;</i>");
        //需不需要接送机
        $('#isNeedTransfer').off('click').on('click', 'li', function () {
            $('#isNeedTransfer li').removeClass('active');
            $(this).addClass('active');
            if ($("#isNeedTransfer .noneed").hasClass("active")) {
                $("#isTransfer").addClass("noneedTb");
            }
            else {
                $("#isTransfer").removeClass("noneedTb");
            }
        })
        //酒店选择间数更新价格
        this.downlistChangeprice();
        //tab选项卡联动
        this.carrAction();
    }
    /*layerTips(obj,tips,time){
        let mytips=tips||1;
        let mytime=time||8000;
        $(obj).hover(function () {
            layer.tips(decodeURI($(this).attr("data-text")), this,{tips:mytips,time:mytime}); //在元素的事件回调体中，follow直接赋予this即可
        },function () {
            layer.closeAll();
        })
    }*/
    //修改数据
    submitOption(option) {
        var that=this;
        var paras = {
            "ProductKey": this.productKey,
            "ChangeSegmentList": option
        };
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: config.API.baseUrl + config.API.travel.ticket.SubmitProductResourceChange,
            data: paras,
            beforeSend: function () {
                that.loading.open({"maskClass": "hide"});
            },
            success: function (data) {
                if (data.Code == 200 && data && typeof data.Data === "object") {
                    that.loadBookingInfor(data.Data.ProductKey);
                }
            },
            complete: function () {
                that.loading.remove();
            }
        });
    }
    //提交产品选择
    submit() {
        var that=this,dsnNums;
        var segmentLists = [];
        if (this.productType== 3) {//目的地
            dsnNums = parseInt(this.productKey.split("_")[2]) * 2;
        } else {
            dsnNums = (parseInt(this.productKey.split("_")[2]) + parseInt(this.productKey.split("_")[3])) * 2;
        }

        for (var i = 0; i < that.productSegmentID.length; i++) {
            var segmentList = {}, roomList = [];

            //行程段ID
            segmentList.SegmentID = that.productSegmentID[i];
            if (that.productTicketResourceID[i] != "") {
                segmentList.AirPlaneTicketResourceIDList = that.productTicketResourceID[i];
            }
            var roomResource = $(".hotelDefaultBox");
            var roomResourceIDList = [];
            for (var j = 0; j < roomResource.length; j++) {
                if (roomResource.eq(j).find(".hotel_ico").data("segment") == segmentList.SegmentID) {
                    for (var k = 0; k < roomResource.eq(j).find(".selected ").length; k++) {
                        if (roomResource.eq(j).find('.isNeedHotel li.need')[0] && !roomResource.eq(j).find('.isNeedHotel li.need').hasClass('active')) {
                            if (roomResource.eq(j).find(".selected").eq(k).hasClass("active")) {
                                segmentList.NeedBookingHotel = "false";
                                roomList.push({
                                    "RoomResourceID": roomResource.eq(j).find(".right").eq(k).data("roomid"),
                                    "BookingCount": 0
                                })
                            }
                        } else {
                            if (roomResource.eq(j).find(".selected").eq(k).hasClass("active")) {
                                segmentList.NeedBookingHotel = "true";
                                roomList.push({
                                    "RoomResourceID": roomResource.eq(j).find(".roomTypeCol").eq(k).data("roomid"),
                                    "BookingCount": parseInt(roomResource.eq(j).find(".roomNum").eq(k).closest("tr").find(".roomNum .select").text())
                                })
                            }
                        }
                    }
                }
            }

            //门票保险和机票红包
            var adTicket = $(".freeResource").find("tbody tr.adTicket");
            var insurance = $(".freeResource").find("tbody tr.insurance");
            var envelope = $(".freeResource").find("tbody tr.envelopeList");

            var localEntertainment = $(".freeResource").find("tbody tr.localEntertainment");

            var scenicSpotList = [], insuranceList = [], envelopeList = [], localEntertainmentList = [];
            var t = 0;
            //景区门票资源ID
            for (var j = 0; j < adTicket.length; j++) {
                var quantity;
                if (adTicket.eq(j).find(".productType").data("segment") == segmentList.SegmentID) {
                    if (parseInt(adTicket.eq(j).find(".productNum .select").text()) > -1) {
                        quantity = parseInt(adTicket.eq(j).find(".productNum .select").text());
                    } else {
                        quantity = parseInt(adTicket.eq(j).find(".productNum span").text());
                    }
                    if (!!adTicket.eq(j).find(".productType").data("ticketid")) {
                        scenicSpotList[t] = {
                            ScenicSpotResourceID: adTicket.eq(j).find(".productType").data("ticketid"),
                            UseDate: dataOption.timestamp(adTicket.eq(j).find(".productDate .select").text()),
                            Count: quantity
                        };
                        t++;
                    }
                }
            }
            t = 0;
            //保险资源ID
            for (var j = 0; j < insurance.length; j++) {
                var quantity;
                if (insurance.eq(j).find(".productType").data("segment") == segmentList.SegmentID) {
                    if (parseInt(insurance.eq(j).find(".productNum .select").text()) > -1) {
                        quantity = parseInt(insurance.eq(j).find(".productNum .select").text());
                    } else {
                        quantity = parseInt(insurance.eq(j).find(".productNum span").text());
                    }
                    if (!!insurance.eq(j).find(".productType").data("insuranceid")) {
                        insuranceList[t] = {
                            InsuranceResourceID: insurance.eq(j).find(".productType").data("insuranceid"),
                            BookingCount: quantity
                        };
                        t++;
                    }
                }
            }
            t = 0;
            //机票红包资源ID
            for (var j = 0; j < envelope.length; j++) {
                var quantity;
                if (envelope.eq(j).find(".productType").data("segment") == segmentList.SegmentID) {
                    if (parseInt(envelope.eq(j).find(".productNum .select").text()) > -1) {
                        quantity = parseInt(envelope.eq(j).find(".productNum .select").text());
                    } else {
                        quantity = parseInt(envelope.eq(j).find(".productNum span").text());
                    }
                    if (!!envelope.eq(j).find(".productType").data("insuranceid")) {
                        envelopeList[t] = {
                            EnvelopeResourceID: envelope.eq(j).find(".productType").data("insuranceid"),
                            BookingCount: quantity
                        };
                        t++;
                    }
                }
            }
            t = 0;

            //附加资源ID
            for (var j = 0; j < localEntertainment.length; j++) {
                var quantity;
                if (localEntertainment.eq(j).find(".productType").data("segment") == segmentList.SegmentID) {
                    if (parseInt(localEntertainment.eq(j).find(".productNum .select").text()) > -1) {
                        quantity = parseInt(localEntertainment.eq(j).find(".productNum .select").text());
                    } else {
                        quantity = parseInt(localEntertainment.eq(j).find(".productNum span").text());
                    }

                    if (!!localEntertainment.eq(j).find(".productType").data("ticketid")) {
                        localEntertainmentList[t] = {
                            ResourceID: localEntertainment.eq(j).find(".productType").data("ticketid"),
                            BookingCount: quantity,
                            UseDate:dataOption.timestamp(localEntertainment.eq(j).find(".productDate .select").text())
                        };
                        t++;
                    }
                }
            }
            t = 0;

            segmentList.RoomResourceIDList = roomResourceIDList;
            segmentList.ScenicSpotList = scenicSpotList;
            segmentList.InsuranceList = insuranceList;
            segmentList.FlightTicketEnvelopeList = envelopeList;
            segmentList.LocalEntertainmentList = localEntertainmentList;

            segmentList.RoomList = roomList;
            segmentLists.push(segmentList);
        }

        //判断迪士尼门票的限制规则

        var dsnadTicket = $(".freeResource tbody .adTicket"), dsnTickets = {};


        for (var i = 0; i < dsnadTicket.length; i++) {
            var dsnTicket = dsnadTicket.eq(i).find(".productName a").text(), quantity;

            if (parseInt(dsnadTicket.eq(i).find(".productNum .select").text()) > -1) {
                quantity = parseInt(dsnadTicket.eq(i).find(".productNum .select").text());
            } else {
                quantity = parseInt(dsnadTicket.eq(i).find(".productNum span").text());
            }

            if (dsnadTicket.eq(i).find(".productType").data("tickettype") == 1) {

                var date = adTicket.eq(i).find(".productDate .select").text();

                if (!!~dsnTicket.indexOf("成人票") || !!~dsnTicket.indexOf("老人票")) {
                    if (!!quantity) {
                        if (dsnTickets[date]) {
                            dsnTickets[date].dsnAdult += quantity;
                        } else {
                            dsnTickets[date] = {"dsnAdult": quantity, "dsnChild": 0};
                        }
                    }

                } else if (!!~dsnTicket.indexOf("儿童票")) {
                    if (!!quantity) {
                        if (dsnTickets[date]) {
                            dsnTickets[date].dsnChild += quantity;
                        } else {
                            dsnTickets[date] = {"dsnChild": quantity, "dsnAdult": 0};
                        }
                    }
                }
            }
        }

        var dsnAdults = 0, dsnChilds = 0;
        for (var item in dsnTickets) {
            var dsnAdult = dsnTickets[item].dsnAdult, dsnChild = dsnTickets[item].dsnChild;

            dsnAdults += dsnAdult;
            dsnChilds += dsnChild;

            if (!dsnAdult && dsnChild) {
                that.openPop("迪士尼门票不能单独购买儿童票！");
                return;
            }

            if (dsnAdult * 4 < dsnChild) {
                that.openPop("一个成人最多只能带4个儿童！");
                return;
            }
        }

        if ((+dsnAdults + dsnChilds) > dsnNums) {
            that.openPop("迪士尼门票不能超过出行人数的两倍！");
            return;
        }

        var paras = {
            "ProductKey": that.productKey,
            "ChangeSegmentList": segmentLists,
            "IsFinishChanged": "true",
            "IsRequireTransfer": ($('#isNeedTransfer li.need').hasClass('active')) ? true : false
        };
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: config.API.baseUrl + config.API.travel.ticket.SubmitProductResourceChange,
            data: paras,
            beforeSend: function () {
                that.loading.open({"maskClass": "hide"});
            },
            success: function (data) {
                if (data.Code == 200 && data && typeof data.Data === "object") {
                    var jumpURL, p_key = data.Data.ProductKey;
                    if (paras.IsRequireTransfer) {
                        jumpURL = config._CONFIG_[config.__webState].transfer_URL + "?productKey=" + p_key;
                    }
                    else {
                        jumpURL = config._CONFIG_[config.__webState].ProductFill_URL + "?productKey=" + p_key;
                    }
                    window.location.href = jumpURL;
                } else {
                    if (!!data.Msg) {
                        that.openPop(data.Msg);
                    }
                }
            },
            complete: function () {
                that.loading.remove();
            }
        });
    }
    //附加产品下拉框更改价格
    selectfreePrice(){
        let that=this;
        var originPrice, freeNum;
        $('.productNum .selectModel').delegate('.select','click', function () {
            originPrice = parseInt($(this).closest("tr").find(".productPrice .price").text().slice(1));
            freeNum = $(this).closest(".productNum").find(".selectModel .select").text();
        });
        $('.productNum .downList').on('click', 'li', function () {
            var liParent = $(this).parent();
            var valueShow = liParent.siblings('.select');
            valueShow.text($(this).text());
            var freePrice = ($(this).text() - freeNum) * parseInt(originPrice);
            var totalPrice = parseInt($("#totalPriceStr .price").attr("data-price")) + freePrice;
            that.upDatePriceHtml(totalPrice);
            liParent.hide();
        });
    }
    //修改航班修改酒店传递参数
    modifyParam(name,type){
        if(name=='fly'){
            let paramInfo={
                entryType:type,  //入口1,2,3
                ProductKey :this.productKey, //产品key
                //行程段列表
                segmentList:this.segmentList,
                productID:this.produceId
            }
            cookieFun.delCookie("modifyFly");
            cookieFun.setCookie("modifyFly",JSON.stringify(paramInfo));
            window.location.href=config._CONFIG_[config.__webState].modifyTicket;
        }
    }
    //序列化json数据为URL参数
    parseParam(jsonObj) {
        var varparamStr = "";
        $.each(jsonObj, function (v, k) {
            var vark = "&" + v + "=" + k;
            varparamStr += encodeURI(vark);
        })
        return varparamStr.substring(1);
   }
    //计算产品初始化总价
    countTotalPriceInt(data){
        let totalPrice, flightHotel, optionPrice, packagePrice;
        if (data && data.length > 0) {
            data.forEach(function (value, item) {
                if (value.PriceType == 0) {
                    flightHotel = value.TotalAmount;
                } else if (value.PriceType == 1) {
                    optionPrice = value.TotalAmount;
                } else if (value.PriceType == 2) {
                    packagePrice = value.TotalAmount;
                }
            });
        }
        //总价格数
        totalPrice = flightHotel + optionPrice + packagePrice;
        totalPrice = totalPrice ? totalPrice : 0;
        this.productPrice=totalPrice;
        this.upDatePriceHtml(this.productPrice);
    }
    //更新价格和首付游html部分，因为此段会根据价格是动态变化的
    upDatePriceHtml(price){
        $("#totalPriceStr .price").attr("data-price",price);
        $("#totalPriceStr .price").html("<i>￥</i>"+price);
        $(".isStagesMod").show().html(stagesData.stagesHTML(price));
        layerTips(".isStagesMod .tooptip");
    }
    //酒店房间数下拉实时改变价格
    downlistChangeprice() {
        let that=this;
        var roomSinglePrice, roomOriginPrice, roomNum, segmentID;
        $('.hotelDefaultBox .selectModel .select').on('click', function () {
            roomSinglePrice = $(this).closest('tr').find('.roomTypeCol').data('siggleprice');
            roomNum =$(this).closest('tr').find('.roomTypeCol').data('minnum');
            segmentID = $(this).closest(".hotelDefaultBox").find(".hotel_ico").data("segment");
            roomOriginPrice = $(this).closest("tr").find(".roomPrice").attr("diffprice");
        });
        $('.hotelDefaultBox .roomNum .downList li').off('click').on('click', function () {
            var liParent = $(this).parent();
            var valueShow = liParent.siblings('.select');
            valueShow.text($(this).text());
            var roomPrice = ($(this).text() - roomNum) * roomSinglePrice + parseInt(roomOriginPrice);
            //正确显示差价的符号
            if (roomPrice >= 0) {
                $(this).closest('tr').find('.roomPrice').html("<span class='diff more'>" + roomPrice+"</span>");
            } else {
                $(this).closest('tr').find('.roomPrice').html("<span class='diff less'>" + (-roomPrice)+"</span>");
            }
            if ($(this).closest('tr').find(".selected").hasClass("active")) {
                //$.cookie(segmentID + "_roomNum", $(this).text()); //0810
                //$(window).trigger('roomNum'); //0810
                //总价
                var totalPrice = that.productPrice - parseInt(roomOriginPrice) + parseInt(roomPrice);
                that.upDatePriceHtml(totalPrice);
            }

            liParent.hide();
        });
    }
    //加载产品关联
    loadProductRelation(){
        let that=this;
        $.ajax({
            type: 'post',
            async: true,
            dataType: "json",
            data: {"ProductID":this.produceId},
            url:config.API.baseUrl + config.API.product.GetProductRelation,
            success: function (data) {
                //测试结束
                if (data.Code == 200 && data && typeof data.Data === "object") {
                    //加载更多路线
                    let moreLine=[];
                    if(data.Data.RouteRelationList&&data.Data.RouteRelationList.length>0){
                        moreLine.push('<span>更多路线('+data.Data.RouteRelationList.length+')</span>');
                        moreLine.push('<ul class="downList">');
                        data.Data.RouteRelationList.forEach(function (item,value) {
                            let priceMod='￥'+item.MinPrice;
                            if(item.MinPrice=="实时特价"){
                                priceMod=item.MinPrice;
                            }
                            moreLine.push('<li><a href="'+DetailJump(item.RelationProductID)+'" title="'+item.RelationTitle+'">'+item.RelationTitle+'</a><em>'+priceMod+'</em></li>');
                        });
                        moreLine.push('</ul>');
                        $(".lineInfo .moreLine").html(moreLine.join(""));
                    }
                    //加载更多出发地
                    let origin=[];
                    if(data.Data.DepRelationList&&data.Data.DepRelationList.length>0){
                        origin.push('<span>出发地:('+productDetail.depCity+')</span>');
                        origin.push('<ul class="downList">');
                        data.Data.DepRelationList.forEach(function (item,value) {
                            let priceMod='￥'+item.MinPrice;
                            if(item.MinPrice=="实时特价"){
                                priceMod=item.MinPrice;
                            }
                            origin.push('<li><a href="'+DetailJump(item.RelationProductID)+'" title="'+item.RelationTitle+'">'+item.RelationTitle+'</a><em>'+priceMod+'</em></li>');
                        });
                        origin.push('</ul>');
                        $(".lineInfo .origin").html(origin.join(""));
                    }
                }
                else if(data.Code!=4){
                    that.openPop(data.Msg);
                }
            },
            error:function (e) {
                that.openPop(e);
            },
            complete:function () {
                //that.loading.remove();
            }
        })
    }
}
let pageInt=new Render();
pageInt.init();
window.CalendarPrice01=pageInt.CalendarPrice01();


