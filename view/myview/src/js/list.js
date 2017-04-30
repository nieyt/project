/**
 * Created by sunyi on 2017/3/17.
 */
import  {ga} from 'ga';
import './mod/mod-public-head';
import {stagesData} from './mod/mod-public-method';
import {List, productType} from './mod/mod-public-template';
import * as config from './mod/mod-public-config';
import basePC from 'basePC';
import 'sliderPc';
import 'datePicker';
import './control/pagerControl';
import './control/hotelCity';
import './control/searchCity';
import 'layerPc301';
import 'es5';
ga();
class Port extends basePC {
    constructor(...age) {
        super(...age);
        //存储基础变量
        this.searchModel = $('.searchModel');
        //获取接口地址
        this.config = config;
        //loading
        this.loading = new AjaxLoading();
        this.noData = new noDataShow();
        //判断产品类型
        this.productType = '';
        //所有筛选条件需要传的值
        this.selectObj = {
            DepartCityID: '',
            tripDays: '',
            leaveMonth: '',
            leaveCity: '',
            proType: '',
            leaveCountry: '',
            PageIndex: 1,
            PageSize: 10,
            StartPrice: '', //价格区间（低价格）
            EndPrice: '',   //价格区间（高价格）
            DisplayDiscount: false, //只看优惠产品
            OrderFlag: 'asc',//排序
            OrderBy: 'minprice',
            Keyword: ''
        };
        //获取匹配列表总页数
        this.TotalCount = '';
        this.TotalPage = '';
        //页面地址（拼接选中参数）
        this.locationUrl = location.href;
        //存储选中所匹配的类型
        this.ListArray = [];
        //接收cookie的出发城市值
        this.fingername = decodeURIComponent(this.getCookie('fingername'));
        this.fingerid = decodeURIComponent(this.getCookie('fingerid'));
        if(this.fingername){
            $('.location').html(this.fingername).attr('data-id', this.fingerid);
        }else{
            $('.location').html('上海');
        }
        this.selectObj.DepartCityID = this.fingerid;
        //页面进来匹配参数进行渲染
        if (GetQueryString('proType')) {
            this.selectObj.proType = GetQueryString('proType');
            $('.hotMeal').html('自由行');
            $('.fontArea span').text('自由行');
            if (GetQueryString('proType') == 1) {
                $('.hotMeal').html('自由行');
                // $('.fontArea span').text('自由行');
            } else if (GetQueryString('proType') == 2) {
                $('.hotMeal').html('跟团游');
                // $('.fontArea span').text('自由行');
            } else if (GetQueryString('proType') == 3) {
                $('.hotMeal').html('酒店套餐');
                // $('.fontArea span').text('自由行');
            }
            this.ListArray.push({TypeID: 1});
        }
        else {
            $('.hotMeal').html('全部');
        }
        if (GetQueryString('tripDays')) {
            this.selectObj.tripDays = GetQueryString('tripDays');
            this.ListArray.push({TypeID: 2});
        }
        if (GetQueryString('month')) {
            this.selectObj.leaveMonth = GetQueryString('month');
            this.ListArray.push({TypeID: 3});
        }
        if (GetQueryString('country')) {
            this.selectObj.leaveCountry = GetQueryString('country');
            this.ListArray.push({TypeID: 4});
        }
        if (GetQueryString('city')) {
            this.selectObj.leaveCity = GetQueryString('city');
            this.ListArray.push({TypeID: 5});
        }
        //接收url传过来的关键字
        let searchValue = decodeURIComponent(GetQueryString('search'));
        if (searchValue) {
            $('.keyWord').val(searchValue);
            this.selectObj.Keyword = searchValue;
        }
        if (GetQueryString('page')) {
            this.selectObj.PageIndex = GetQueryString('page');
        }
        $('.city_body ul').on('click','li',function () {
            console.log('aaaaa')
        })
        //页面初始化
        this.init();
    }

    //渲染数据
    //初始化
    init() {
        this.filterRequest();
        this.listRequest();
        this.staticBind();
        this.ticketAddHotel();
        this.ticketAddCenter();
    }

    //封装接口方法
    ajax(option, callback) {
        let _this = this;
        $.ajax(
            $.extend({
                type: 'post',
                dataType: 'json',
                data: {
                    "DepartCityID": _this.selectObj.DepartCityID,
                    "OrderBy": _this.selectObj.OrderBy,
                    "DisplayDiscount ": _this.selectObj.DisplayDiscount,
                    "OrderFlag": _this.selectObj.OrderFlag,
                    "StartPrice": _this.selectObj.StartPrice,
                    "EndPrice": _this.selectObj.EndPrice,
                    "PageIndex": _this.selectObj.PageIndex,
                    "PageSize": _this.selectObj.PageSize,
                    "ScheduleMonth": _this.selectObj.leaveMonth,
                    "DestinationCountryID": _this.selectObj.leaveCountry,
                    "SegmentDayCount": _this.selectObj.tripDays,
                    "DestinationCityID": _this.selectObj.leaveCity,
                    "ProductType": _this.selectObj.proType,
                    "Keyword": _this.selectObj.Keyword
                },
                beforeSend: ()=> {
                    _this.loading.open({"maskClass": "hide"});
                },
                error(err){
                    layer.msg('服务器出了点小问题，请稍后再试');
                },
                success(data){
                    callback && callback(data);
                },
                complete: () => {
                    _this.loading.remove();
                }
            }, option)
        );
    }

    //筛选条件调用接口
    filterRequest() {
        //使用pjax进行无页面刷新，动态改变页面地址
        // 判断浏览器是否支持pjax
        if ('pushState' in history) {
            history.pushState({url: this.locationUrl, title: document.title}, document.title, this.locationUrl);
            //调用筛选条件接口
            this.ajax({url: this.config.API.baseUrl + this.config.API.travel.list.GetSearchProductFilter},
                data => {
                    if (data.Code == 200) {
                        console.log(data)
                        let FilterArray = [];
                        //过滤筛选条件
                        if (!this.ListArray) {
                            $('.productContain').empty().append(productType({FilterArray: data.Data.FilterList}));
                        } else {
                            for (let i = 0; i < data.Data.FilterList.length; i++) {
                                //页面接收参数处理
                                if (data.Data.FilterList[i].TypeID == 1) {
                                    for (let k = 0; k < data.Data.FilterList[i].List.length; k++) {
                                        if (GetQueryString('proType')) {
                                            if (data.Data.FilterList[i].List[k].Value == GetQueryString('proType')) {
                                                $('.productNote[data-id=1]').remove();
                                                $('.clearAll').show().before(`
                                                  <div class="productNote" data-id="1" item= ${data.Data.FilterList[i].List[k].Value} >
                                                     <i>${data.Data.FilterList[i].List[k].Name}</i><span></span>
                                                    </div>
                                                `);
                                            }
                                        }
                                    }
                                }
                                if (data.Data.FilterList[i].TypeID == 2) {
                                    for (let z = 0; z < data.Data.FilterList[i].List.length; z++) {
                                        if (GetQueryString('tripDays')) {
                                            if (data.Data.FilterList[i].List[z].Value == GetQueryString('tripDays')) {
                                                $('.productNote[data-id = 2]').remove();
                                                $('.clearAll').show().before(`
                                                  <div class="productNote" data-id="2" item= ${data.Data.FilterList[i].List[z].Value} >
                                                     <i>${data.Data.FilterList[i].List[z].Name}</i><span></span>
                                                    </div>
                                                `);
                                            }
                                        }
                                    }
                                }
                                if (data.Data.FilterList[i].TypeID == 3) {
                                    for (let z = 0; z < data.Data.FilterList[i].List.length; z++) {
                                        if (GetQueryString('month')) {
                                            if (data.Data.FilterList[i].List[z].Value == GetQueryString('month')) {
                                                $('.productNote[data-id = 3]').remove();
                                                $('.clearAll').show().before(`
                                                  <div class="productNote" data-id="3" item= ${data.Data.FilterList[i].List[z].Value} >
                                                     <i>${data.Data.FilterList[i].List[z].Name}</i><span></span>
                                                    </div>
                                                `);
                                            }
                                        }
                                    }
                                }
                                if (data.Data.FilterList[i].TypeID == 4) {
                                    for (let z = 0; z < data.Data.FilterList[i].List.length; z++) {
                                        if (GetQueryString('country')) {
                                            if (data.Data.FilterList[i].List[z].Value == GetQueryString('country')) {
                                                $('.productNote[data-id = 4]').remove();
                                                $('.clearAll').show().before(`
                                                  <div class="productNote" data-id="4" item= ${data.Data.FilterList[i].List[z].Value} >
                                                     <i>${data.Data.FilterList[i].List[z].Name}</i><span></span>
                                                    </div>
                                                `);
                                            }
                                        }
                                    }
                                }
                                if (data.Data.FilterList[i].TypeID == 5) {
                                    for (let z = 0; z < data.Data.FilterList[i].List.length; z++) {
                                        if (GetQueryString('city')) {
                                            if (data.Data.FilterList[i].List[z].Value == GetQueryString('city')) {
                                                $('.productNote[data-id = 5]').remove();
                                                $('.clearAll').show().before(`
                                                  <div class="productNote" data-id="5" item= ${data.Data.FilterList[i].List[z].Value} >
                                                     <i>${data.Data.FilterList[i].List[z].Name}</i><span></span>
                                                    </div>
                                                `);
                                            }
                                        }
                                    }
                                }
                                //过滤掉点击过的类型
                                if (data.Data.FilterList[i].List.length > 0) {
                                    let exits = false;
                                    for (let j = 0; j < this.ListArray.length; j++) {
                                        if (this.ListArray[j].TypeID == data.Data.FilterList[i].TypeID) {
                                            exits = true;
                                            break;
                                        }
                                    }
                                    !exits && FilterArray.push(data.Data.FilterList[i]);
                                }
                            }
                            $('.productContain').empty().append(productType({FilterArray: FilterArray}));
                            if (FilterArray == '') {
                                $('.productContain').css('border', 'none');
                            }
                        }
                        //  点击更多rightBtn
                        $('.moreBtn').on('click', function () {
                            $(this).parent().prev().toggleClass('hideLi');
                            if ($(this).parent().prev().attr('class') == '') {
                                $(this).find('.moreDay').text('收起');
                                $('.rrow').hide();
                                $('.rrowHide').show();
                            } else {
                                $(this).find('.moreDay').text('更多');
                                $('.rrow').show();
                                $('.rrowHide').hide();
                            }
                        });
                        this.dynamicBind();
                        this.productMatch();
                    }else{
                        layer.msg(data.Msg);
                    }
                });
        }
    }

    //筛选结果调用接口
    listRequest() {
        //支持分期弹框内容
        window.stagesData = stagesData;
        //判断是否支持
        if ('pushState' in history) {
            this.loading.remove();
            this.ajax({url: this.config.API.baseUrl + this.config.API.travel.list.GetSearchProductList},
                data => {
                    let listContain = $('.listContain');
                    let pageNum = $('.pageNum span');
                    listContain.find('.listItem').empty();
                    listContain.find('#pagerControls').empty();
                    if (data.Code == 200) {
                        // console.log(data);
                        if (data.Data.ProductList != null) {
                            $('.noProduct').hide();
                            listContain.find('#pagerControls').show();
                            $('.pagination').show();
                            $('#pagerControls ').before(List(data.Data));
                            this.TotalCount = data.Data.PageInfo.TotalCount;
                            this.TotalPage = data.Data.PageInfo.TotalPage;
                            pageNum.eq(0).text(this.selectObj.PageIndex);
                            pageNum.eq(1).text(this.TotalPage);
                            this.pageControl();
                        } else if (data.Data.ProductList == null) {
                            $('.pagination').hide();
                            listContain.find('#pagerControls').hide();
                            listContain.css('border', 'none');
                            $('.noProduct').show();
                            let _this = this;
                            _this.noData.commonShow({
                                noDataTitle: "很抱歉！",
                                noDataTip: "暂时没有符合条件的结果！",
                                btnShow: true, //是否显示按钮
                                btnText: "返回首页", //按钮文本
                                btnUrl: config._CONFIG_[config.__webState].travelIndex
                            }, '.noProduct');
                        }
                    } else {
                        layer.msg(data.Msg);
                        $('.pagination').hide();
                        listContain.find('#pagerControls').hide();
                        listContain.css('border', 'none');
                        $('.noProduct').show();
                        let _this = this;
                        _this.noData.commonShow({
                            noDataTitle: "很抱歉！",
                            noDataTip: "暂时没有符合条件的结果！",
                            btnShow: false //是否显示按钮
                        }, '.noProduct');
                    }
                    this.dynamicBind();
                });
        }
    }

    //机加酒点击触发（头部）
    ticketAddHotel() {
        //首页搜索按钮点击事件
        var $airContented = $("#indexSearchModel");
        $airContented.off("click").on("click", "#ga_pcdindex_s", function () {
            event.stopPropagation();
            var hotelCityName = $("input[name=gw_city]", $airContented).attr("data-id");
            var hotelCityChName = $("input[name=gw_city]", $airContented).val();
            var hotelStartTime = $("#inputDate", $airContented).val();
            var hotelEndTime = $("#inputDate2", $airContented).val();
            if (hotelCityChName == "城市名" || hotelCityChName == "") {
                hotelCityChName = null;
                hotelCityName = null;
            }
            if (hotelStartTime == "入店时间" || hotelStartTime == "") {
                hotelStartTime = null;
            }
            if (hotelEndTime == "离店时间" || hotelStartTime == "") {
                hotelEndTime = null;
            }
            var AirStarCitySZM = $("input[name=AirStarCity]", $airContented).attr("data-szm");
            var AirStarCityName = $("input[name=AirStarCity]", $airContented).val();
            var searchModOption = {
                AirStartCity: AirStarCitySZM ? AirStarCitySZM : "",//飞机出发城市编码
                AirEndCity: $("input[name=AirEndCity]", $airContented).val(),//飞机到达城市
                AirStartChCity: AirStarCityName,//飞机出发城市中文名
                AirEndChCity: $("input[name=AirEndCity]", $airContented).val(),//飞机到达城市中文名
                AirStartTime: $("#inputDate3", $airContented).val(),//飞机起飞时间
                AirEndTime: $("#inputDate4", $airContented).val(),//飞机落地时间
                adtCount: parseInt($(".adtSelect .select", $airContented).text()),//成人数量
                chdCount: parseInt($(".childSelcet .select", $airContented).text()),//儿童数量
                IsRequireHotel: true,//是否需要酒店
                IsReturn: $("input[name=returnVal]", $airContented).val()//是否往返
            }
            if (!hotelCityChName || !hotelStartTime || !hotelEndTime) {
                searchModOption.IsRequireHotel = false
            }
            if (searchModOption.IsRequireHotel) {
                searchModOption.hotelCityChName = hotelCityChName;
                searchModOption.hotelCityName = hotelCityName;
                searchModOption.hotelStartTime = hotelStartTime;
                searchModOption.hotelEndTime = hotelEndTime;
            }

            var chufatime = searchModOption.AirStartTime,         //出发时间
                chufas = chufatime.split("-"),
                chufas_zfc = chufas.join('');
            var fancetime = searchModOption.AirEndTime; //返程时间
            var fance, fances_zfc;
            if (fancetime != "返回时间") {
                fance = fancetime.split("-");
                fances_zfc = fance.join('');
            }
            if (!$(".select_city").val() || $(".select_city").val() == "城市名") {
                layer.alert("请输入酒店所在城市");
            }
            else if (!searchModOption.hotelStartTime || searchModOption.hotelStartTime == "入店时间") {
                layer.alert("请输入酒店入店时间");
            }
            else if (!searchModOption.hotelEndTime || searchModOption.hotelEndTime == "离店时间") {
                layer.alert("请输入酒店离店时间");
            } else if (!$(".goCity").val() || $(".goCity").val() == "出发城市") {
                layer.alert("请输入飞机出发城市");
            }
            else if (!$(".leaveCity").val() || $(".leaveCity").val() == "到达城市") {
                layer.alert("请输入飞机到达城市");
            }
            else if (!searchModOption.AirStartTime || searchModOption.AirStartTime == "出发时间") {
                layer.alert("请输入飞机出发时间");
            }
            else if ((!searchModOption.AirEndTime || searchModOption.AirEndTime == "返回时间") && searchModOption.IsReturn == "true") {
                layer.alert("请输入飞机返回时间");
            }
            else if (parseInt(chufas_zfc) > parseInt(fances_zfc)) {
                layer.alert("飞机返程时间不能小于出发时间,请重新选择时间");
                $('#inputDate4').val("");
            }
            else if (searchModOption.AirStartChCity == searchModOption.AirEndCity) {
                layer.alert("出发地目的地不能为同一个城市");
            }
            else if (searchModOption.chdCount / searchModOption.adtCount > 2) {
                layer.alert("儿童数不能是成人数的两倍以上");
            }
            else if ((searchModOption.chdCount + searchModOption.adtCount) > 9) {
                layer.alert("根据航空公司规定，出行人数不能超过9人<br/>10人以上独立成团，请尽快联系<span class='orange'>4009695530</span>获取最低出行价！");
            }
            else {
                if ($airContented.hasClass('selectProductSM')) {
                    // console.log('跳转')
                    window.location.href = '?' + parseParam(searchModOption);
                } else {
                    // console.log('跳转页面')
                    window.location.href = config._CONFIG_[config.__webState].SelectProduct_URL + '?' + parseParam(searchModOption);
                }
            }
        });

//日期控件
        var options = {
            nowDate: new Date(),//当前日期
            dateConversion: function (e) { //时间转换
                var month = new Date(e).getMonth() + 1, date = new Date(e).getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                ;
                if (date < 10) {
                    date = "0" + date;
                }
                ;
                return new Date(e).getFullYear() + '-' + month + '-' + date;
            },
            dateAdd: function (date, days) {
                var e = date.toString();
                var dateStart = new Date(e.replace("-", "/").replace("-", "/"));
                dateStart.setDate(dateStart.getDate() + days);
                var month = dateStart.getMonth() + 1, date = dateStart.getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                ;
                if (date < 10) {
                    date = "0" + date;
                }
                return dateStart.getFullYear() + '-' + month + '-' + date;
            }
        }
//酒店入住日期
        $('#inputDate').DatePicker({
            format: 'Y-m-d',
            date: $('#inputDate').val(),
            current: $('#inputDate').val(),
            prev: '',
            next: '',
            calendars: 2,
            starts: 1,
            position: 'bottom',
            wrapClass: "priceDate pcDate",
            showBtn: true,
            onRender: function (date) {
                return {
                    disabled: (date.valueOf() < options.nowDate.valueOf())
                }
            },
            onBeforeShow: function () {
                $('#inputDate').DatePickerSetDate($('#inputDate').attr('startDate'), true);
                $('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                $('#inputDate').val(formated).DatePickerHide();
                $('#inputDate').attr('startDate', formated);
                var $inputDate2 = $('#inputDate2');
                var inputDate = $('#inputDate');
                var leaveDateStart = dataOption.timestamp($inputDate2.attr('startDate'));//离店时间的初始值
                var nowDate = dataOption.timestamp(inputDate.attr('startDate'));//入住时间
                if ($inputDate2.val()) {
                    if (leaveDateStart <= nowDate) {
                        $inputDate2.attr('startDate', options.dateAdd(formated, 1));
                        $inputDate2.val(options.dateAdd(formated, 1)).DatePickerShow().focus();
                    }
                }
                else {
                    $inputDate2.attr('startDate', options.dateAdd(formated, 1));
                    $inputDate2.DatePickerShow().focus();
                }
            }
        });
        //酒店离开日期
        $('#inputDate2').DatePicker({
            format: 'Y-m-d',
            prev: '',
            next: '',
            date: $('#inputDate2').val(),
            current: $('#inputDate2').val(),
            calendars: 2,
            starts: 1,
            position: 'bottom',
            wrapClass: "priceDate pcDate",
            showBtn: true,
            onRender: function (date) {
                var disableDate = dataOption.timestamp($('#inputDate').val());
                if (!disableDate) {
                    disableDate = dataOption.timestamp(options.dateAdd(options.nowDate, 1));
                }
                return {
                    disabled: (date.valueOf() < disableDate * 1000)
                }
            },
            onBeforeShow: function () {
                $('#inputDate2').DatePickerSetDate($('#inputDate2').attr('startDate'), true);
                $('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                var nowDate = dataOption.timestamp(options.dateAdd(options.nowDate, 1));
                var leaveDate = dataOption.timestamp(formated);
                if (leaveDate <= nowDate) {
                    layer.alert("离店时间不能为明天,请重新选择离店时间！");
                    return;
                }
                $('#inputDate2').val(formated).DatePickerHide();
                $('#inputDate2').attr('startDate', formated);
                var goDate = dataOption.timestamp($('#inputDate').attr('startDate'));
                if (leaveDate <= goDate && leaveDate > nowDate) {
                    $('#inputDate').val(options.dateAdd(formated, -1));
                    $('#inputDate').attr('startDate', options.dateAdd(formated, -1));
                }
                var inputDateVal = $(".goCity ").val();
                if (inputDateVal == "" || inputDateVal == "出发城市") {
                    $(".goCity ").click().focus();
                }
            }
        });
        //飞机出发日期
        $('#inputDate3').DatePicker({
            format: 'Y-m-d',
            prev: '',
            next: '',
            date: $('#inputDate3').val(),
            current: $('#inputDate3').val(),
            calendars: 2,
            starts: 1,
            position: 'myPositinRight',
            wrapClass: "priceDate pcDate",
            showBtn: true,
            onRender: function (date) {
                return {
                    disabled: (date.valueOf() < options.nowDate.valueOf())
                }
            },
            onBeforeShow: function () {
                $('#inputDate3').DatePickerSetDate($('#inputDate3').attr('startDate'), true);
                $('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                var $inputDate3 = $('#inputDate3');
                var $inputDate4 = $('#inputDate4');
                $inputDate3.val(formated).DatePickerHide();
                $inputDate3.attr('startDate', formated);
                var leaveDateStart = dataOption.timestamp($inputDate4.attr('startDate'));//离店时间的初始值
                var nowDate = dataOption.timestamp($inputDate3.attr('startDate'));//入住时间
                if ($('#inputDate4').val()) {
                    if (leaveDateStart <= nowDate) {
                        $('#inputDate2').val(options.dateAdd(formated, 1));  //顺便给离店时间赋值
                        $inputDate4.attr('startDate', options.dateAdd(formated, 1));
                        $inputDate4.val(options.dateAdd(formated, 1)).DatePickerShow().focus();
                    }
                }
                else {
                    $inputDate4.attr('startDate', options.dateAdd(formated, 1));
                    //$inputDate4.DatePickerShow().focus();
                }
                $('#inputDate').val(formated);
                if ($('#inputDate4').val() == '' || $('#inputDate4').val() == '返回时间') {
                    $('#inputDate2').val(options.dateAdd(formated, 1));
                }
            }
        });
        //飞机返回日期
        $('#inputDate4').DatePicker({
            format: 'Y-m-d',
            prev: '',
            next: '',
            date: $('#inputDate4').val(),
            current: $('#inputDate4').val(),
            calendars: 2,
            starts: 1,
            position: 'myPositinRight',
            wrapClass: "priceDate pcDate",
            showBtn: true,
            onRender: function (date) {
                var disableDate = dataOption.timestamp($('#inputDate3').val());
                if (!disableDate) {
                    disableDate = dataOption.timestamp(options.dateAdd(options.nowDate, 1));
                }
                return {
                    disabled: (date.valueOf() < disableDate * 1000)
                }
            },
            onBeforeShow: function () {
                $('#inputDate4').DatePickerSetDate($('#inputDate4').attr('startDate'), true);
                $('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                var nowDate = dataOption.timestamp(options.dateAdd(options.nowDate, 1));
                var leaveDate = dataOption.timestamp(formated);
                if (leaveDate <= nowDate) {
                    layer.alert("返回时间不能为明天,请重新选择离店时间！");
                    return;
                }
                $('#inputDate4').val(formated).DatePickerHide();
                $('#inputDate4').attr('startDate', formated);
                var goDate = dataOption.timestamp($('#inputDate3').attr('startDate'));
                if (leaveDate <= goDate && leaveDate > nowDate) {
                    $('#inputDate3').val(options.dateAdd(formated, -1));
                    $('#inputDate3').attr('startDate', options.dateAdd(formated, -1));
                }
                $('#inputDate2').val(formated);
            },
            clearBtn: function () {
                if ($('#inputDate3').val()) {
                    $('#inputDate2').val(options.dateAdd($('#inputDate3').val(), 1));
                }
            }
        });
        //日期初始化
        var nowDate = options.nowDate;
        var tomarDateShow = options.dateAdd(nowDate, 1);
        var tomarDateShow02 = options.dateAdd(nowDate, 2);

        if (!$("#indexSearchModel").hasClass("selectProductSM")) {
            $('#inputDate3').val(options.dateAdd(options.nowDate, 7));
            $('#inputDate3').attr('startdate', options.dateAdd(options.nowDate, 7));
            $('#inputDate4').val(options.dateAdd(options.nowDate, 10));
            $('#inputDate4').attr('startdate', options.dateAdd(options.nowDate, 10));
            $('#inputDate').val(options.dateAdd(options.nowDate, 7));
            $('#inputDate').attr('startdate', options.dateAdd(options.nowDate, 7));
            $('#inputDate2').val(options.dateAdd(options.nowDate, 10));
            $('#inputDate2').attr('startdate', options.dateAdd(options.nowDate, 10));
        }

    }

    //机加酒点击触发（中间）
    ticketAddCenter() {
        //首页搜索按钮点击事件
        var $airContented = $(".searchModel");
        $airContented.off("click").on("click", "#flotRight", function () {
            // console.log('7777')
            var hotelCityName = $("input[name=gw_city1]", $airContented).attr("data-id");
            var hotelCityChName = $("input[name=gw_city1]", $airContented).val();
            var hotelStartTime = $("#margIn", $airContented).val();
            var hotelEndTime = $("#margOut", $airContented).val();
            if (hotelCityChName == "城市名" || hotelCityChName == "") {
                hotelCityChName = null;
                hotelCityName = null;
            }
            if (hotelStartTime == "入店时间" || hotelStartTime == "") {
                hotelStartTime = null;
            }
            if (hotelEndTime == "离店时间" || hotelStartTime == "") {
                hotelEndTime = null;
            }
            var AirStarCitySZM = $("input[name=AirStarCity1]", $airContented).attr("data-szm");
            var AirStarCityName = $("input[name=AirStarCity1]", $airContented).val();
            var searchModOption = {
                AirStartCity: AirStarCitySZM ? AirStarCitySZM : "",//飞机出发城市编码
                AirEndCity: $("input[name=AirEndCity1]", $airContented).val(),//飞机到达城市
                AirStartChCity: AirStarCityName,//飞机出发城市中文名
                AirEndChCity: $("input[name=AirEndCity1]", $airContented).val(),//飞机到达城市中文名
                AirStartTime: $("#margGo", $airContented).val(),//飞机起飞时间
                AirEndTime: $("#margBack", $airContented).val(),//飞机落地时间
                adtCount: parseInt($(".slecMargAdt .select", $airContented).text()),//成人数量
                chdCount: parseInt($(".slecMargChd .select", $airContented).text()),//儿童数量
                IsRequireHotel: true,//是否需要酒店
                IsReturn: $("input[name=returnVal]", $airContented).val()//是否往返
            }
            if (!hotelCityChName || !hotelStartTime || !hotelEndTime) {
                searchModOption.IsRequireHotel = false
            }
            if (searchModOption.IsRequireHotel) {
                searchModOption.hotelCityChName = hotelCityChName;
                searchModOption.hotelCityName = hotelCityName;
                searchModOption.hotelStartTime = hotelStartTime;
                searchModOption.hotelEndTime = hotelEndTime;
            }

            var chufatime = searchModOption.AirStartTime,         //出发时间
                chufas = chufatime.split("-"),
                chufas_zfc = chufas.join('');
            var fancetime = searchModOption.AirEndTime; //返程时间
            var fance, fances_zfc;
            if (fancetime != "返回时间") {
                fance = fancetime.split("-");
                fances_zfc = fance.join('');
            }
            if (!$(".select_city1").val() || $(".select_city1").val() == "城市名") {
                layer.alert("请输入酒店所在城市");
            }
            else if (!searchModOption.hotelStartTime || searchModOption.hotelStartTime == "入店时间") {
                layer.alert("请输入酒店入店时间");
            }
            else if (!searchModOption.hotelEndTime || searchModOption.hotelEndTime == "离店时间") {
                layer.alert("请输入酒店离店时间");
            } else if (!$(".goCity1").val() || $(".goCity1").val() == "出发城市") {
                layer.alert("请输入飞机出发城市");
            }
            else if (!$(".leaveCity1").val() || $(".leaveCity1").val() == "到达城市") {
                layer.alert("请输入飞机到达城市");
            }
            else if (!searchModOption.AirStartTime || searchModOption.AirStartTime == "出发时间") {
                layer.alert("请输入飞机出发时间");
            }
            else if ((!searchModOption.AirEndTime || searchModOption.AirEndTime == "返回时间") && searchModOption.IsReturn == "true") {
                layer.alert("请输入飞机返回时间");
            }
            else if (parseInt(chufas_zfc) > parseInt(fances_zfc)) {
                layer.alert("飞机返程时间不能小于出发时间,请重新选择时间");
                $('#margBack ').val("");
            }
            else if (searchModOption.AirStartChCity == searchModOption.AirEndCity) {
                layer.alert("出发地目的地不能为同一个城市");
            }
            else if (searchModOption.chdCount / searchModOption.adtCount > 2) {
                layer.alert("儿童数不能是成人数的两倍以上");
            }
            else if ((searchModOption.chdCount + searchModOption.adtCount) > 9) {
                layer.alert("根据航空公司规定，出行人数不能超过9人<br/>10人以上独立成团，请尽快联系<span class='orange'>4009695530</span>获取最低出行价！");
            }
            else {
                if ($airContented.hasClass('selectProductSM')) {
                    // console.log('跳转')
                    window.location.href = '?' + parseParam(searchModOption);
                } else {
                    // console.log('跳转页面')
                    window.location.href = config._CONFIG_[config.__webState].SelectProduct_URL + '?' + parseParam(searchModOption);
                }
            }
        });

//日期控件
        var options = {
            nowDate: new Date(),//当前日期
            dateConversion: function (e) { //时间转换
                var month = new Date(e).getMonth() + 1, date = new Date(e).getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                ;
                if (date < 10) {
                    date = "0" + date;
                }
                ;
                return new Date(e).getFullYear() + '-' + month + '-' + date;
            },
            dateAdd: function (date, days) {
                var e = date.toString();
                var dateStart = new Date(e.replace("-", "/").replace("-", "/"));
                dateStart.setDate(dateStart.getDate() + days);
                var month = dateStart.getMonth() + 1, date = dateStart.getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                ;
                if (date < 10) {
                    date = "0" + date;
                }
                return dateStart.getFullYear() + '-' + month + '-' + date;
            }
        }
//酒店入住日期
        $('#margIn').DatePicker({
            format: 'Y-m-d',
            date: $('#margIn').val(),
            current: $('#margIn').val(),
            prev: '',
            next: '',
            calendars: 2,
            starts: 1,
            position: 'bottom',
            wrapClass: "priceDate pcDate",
            showBtn: true,
            onRender: function (date) {
                return {
                    disabled: (date.valueOf() < options.nowDate.valueOf())
                }
            },
            onBeforeShow: function () {
                $('#margIn').DatePickerSetDate($('#margIn').attr('startDate'), true);
                $('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                $('#margIn').val(formated).DatePickerHide();
                $('#margIn').attr('startDate', formated);
                var $inputDate2 = $('#margOut');
                var inputDate = $('#margIn');
                var leaveDateStart = dataOption.timestamp($inputDate2.attr('startDate'));//离店时间的初始值
                var nowDate = dataOption.timestamp(inputDate.attr('startDate'));//入住时间
                if ($inputDate2.val()) {
                    if (leaveDateStart <= nowDate) {
                        $inputDate2.attr('startDate', options.dateAdd(formated, 1));
                        $inputDate2.val(options.dateAdd(formated, 1)).DatePickerShow().focus();
                    }
                }
                else {
                    $inputDate2.attr('startDate', options.dateAdd(formated, 1));
                    $inputDate2.DatePickerShow().focus();
                }
            }
        });
        //酒店离开日期
        $('#margOut').DatePicker({
            format: 'Y-m-d',
            prev: '',
            next: '',
            date: $('#margOut').val(),
            current: $('#margOut').val(),
            calendars: 2,
            starts: 1,
            position: 'bottom',
            wrapClass: "priceDate pcDate",
            showBtn: true,
            onRender: function (date) {
                var disableDate = dataOption.timestamp($('#margIn').val());
                if (!disableDate) {
                    disableDate = dataOption.timestamp(options.dateAdd(options.nowDate, 1));
                }
                return {
                    disabled: (date.valueOf() < disableDate * 1000)
                }
            },
            onBeforeShow: function () {
                $('#margOut').DatePickerSetDate($('#margOut').attr('startDate'), true);
                $('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                var nowDate = dataOption.timestamp(options.dateAdd(options.nowDate, 1));
                var leaveDate = dataOption.timestamp(formated);
                if (leaveDate <= nowDate) {
                    layer.alert("离店时间不能为明天,请重新选择离店时间！");
                    return;
                }
                $('#margOut').val(formated).DatePickerHide();
                $('#margOut').attr('startDate', formated);
                var goDate = dataOption.timestamp($('#margIn').attr('startDate'));
                if (leaveDate <= goDate && leaveDate > nowDate) {
                    $('#margIn').val(options.dateAdd(formated, -1));
                    $('#margIn').attr('startDate', options.dateAdd(formated, -1));
                }
                var inputDateVal = $(".goCity1 ").val();
                if (inputDateVal == "" || inputDateVal == "出发城市") {
                    $(".goCity1 ").click().focus();
                }
            }
        });
        //飞机出发日期
        $('#margGo').DatePicker({
            format: 'Y-m-d',
            prev: '',
            next: '',
            date: $('#margGo').val(),
            current: $('#margGo').val(),
            calendars: 2,
            starts: 1,
            position: 'myPositinRight',
            wrapClass: "priceDate pcDate",
            showBtn: true,
            onRender: function (date) {
                return {
                    disabled: (date.valueOf() < options.nowDate.valueOf())
                }
            },
            onBeforeShow: function () {
                $('#margGo').DatePickerSetDate($('#margGo').attr('startDate'), true);
                $('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                var $inputDate3 = $('#margGo');
                var $inputDate4 = $('#margBack ');
                $inputDate3.val(formated).DatePickerHide();
                $inputDate3.attr('startDate', formated);
                var leaveDateStart = dataOption.timestamp($inputDate4.attr('startDate'));//离店时间的初始值
                var nowDate = dataOption.timestamp($inputDate3.attr('startDate'));//入住时间
                if ($('#margBack ').val()) {
                    if (leaveDateStart <= nowDate) {
                        $('#margOut').val(options.dateAdd(formated, 1));  //顺便给离店时间赋值
                        $inputDate4.attr('startDate', options.dateAdd(formated, 1));
                        $inputDate4.val(options.dateAdd(formated, 1)).DatePickerShow().focus();
                    }
                }
                else {
                    $inputDate4.attr('startDate', options.dateAdd(formated, 1));
                    //$inputDate4.DatePickerShow().focus();
                }
                $('#margIn').val(formated);
                if ($('#margBack ').val() == '' || $('#margBack ').val() == '返回时间') {
                    $('#margOut').val(options.dateAdd(formated, 1));
                }
            }
        });
        //飞机返回日期
        $('#margBack').DatePicker({
            format: 'Y-m-d',
            prev: '',
            next: '',
            date: $('#margBack').val(),
            current: $('#margBack').val(),
            calendars: 2,
            starts: 1,
            position: 'myPositinRight',
            wrapClass: "priceDate pcDate",
            showBtn: true,
            onRender: function (date) {
                var disableDate = dataOption.timestamp($('#inputDate3').val());
                if (!disableDate) {
                    disableDate = dataOption.timestamp(options.dateAdd(options.nowDate, 1));
                }
                return {
                    disabled: (date.valueOf() < disableDate * 1000)
                }
            },
            onBeforeShow: function () {
                $('#margBack').DatePickerSetDate($('#margBack').attr('startDate'), true);
                $('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                var nowDate = dataOption.timestamp(options.dateAdd(options.nowDate, 1));
                var leaveDate = dataOption.timestamp(formated);
                if (leaveDate <= nowDate) {
                    layer.alert("返回时间不能为明天,请重新选择离店时间！");
                    return;
                }
                $('#margBack').val(formated).DatePickerHide();
                $('#margBack').attr('startDate', formated);
                var goDate = dataOption.timestamp($('#margGo').attr('startDate'));
                if (leaveDate <= goDate && leaveDate > nowDate) {
                    $('#margGo').val(options.dateAdd(formated, -1));
                    $('#margGo').attr('startDate', options.dateAdd(formated, -1));
                }
                $('#margOut').val(formated);
            },
            clearBtn: function () {
                if ($('#margGo').val()) {
                    $('#margOut').val(options.dateAdd($('#margGo').val(), 1));
                }
            }
        });
        //日期初始化
        var nowDate = options.nowDate;
        var tomarDateShow = options.dateAdd(nowDate, 1);
        var tomarDateShow02 = options.dateAdd(nowDate, 2);

        if (!$("#indexSearchModel").hasClass("selectProductSM")) {
            $('#margGo').val(options.dateAdd(options.nowDate, 7));
            $('#margGo').attr('startdate', options.dateAdd(options.nowDate, 7));
            $('#margBack').val(options.dateAdd(options.nowDate, 10));
            $('#margBack').attr('startdate', options.dateAdd(options.nowDate, 10));
            $('#margIn').val(options.dateAdd(options.nowDate, 7));
            $('#margIn').attr('startdate', options.dateAdd(options.nowDate, 7));
            $('#margOut').val(options.dateAdd(options.nowDate, 10));
            $('#margOut').attr('startdate', options.dateAdd(options.nowDate, 10));
        }

    }

    //点击筛选类型做匹配
    productMatch() {
        let _this = this;
        //选择产品类型
        $('#proType').on('click', 'li', function () {
            _this.selectObj.proType = $(this).attr('item');
            _this.ListArray.push({TypeID: 1});
            // _this.selectObj.PageIndex = 1;
            if (GetQueryString('page')) {
                _this.selectObj.PageIndex = GetQueryString('page');
            }
            if (_this.selectObj.proType == 1) {
                $('.hotMeal').html('自由行');
                $('.fontArea span').text('自由行');
            } else if (_this.selectObj.proType == 2) {
                $('.hotMeal').html('跟团游');
                $('.fontArea span').text('跟团游');
            } else if (_this.selectObj.proType == 3) {
                $('.hotMeal').html('酒店套餐');
                $('.fontArea span').text('酒店套餐');
            }
            _this.filterRequest();
            _this.listRequest();
            let paramString = '';
            if(_this.locationUrl.indexOf('proType') != -1){
                if(GetQueryString('proType') == ''){
                    _this.locationUrl =  changeURLArg( _this.locationUrl,'proType', _this.selectObj.proType)
                }
            }else{
                if (_this.locationUrl.indexOf("?") !=  -1) {
                    paramString = '&proType=';
                } else {
                    paramString = '?proType=';
                }
                _this.locationUrl = _this.locationUrl + paramString + _this.selectObj.proType ;
            }
            history.replaceState(null, document.title, _this.locationUrl) ;

        });
        //选择行程天数
        $('#tripDays').on('click', 'li', function () {
            _this.selectObj.tripDays = $(this).attr('item');
            _this.ListArray.push({TypeID: 2});
            // _this.selectObj.PageIndex = 1;
            if (GetQueryString('page')) {
                _this.selectObj.PageIndex = GetQueryString('page');
            }
            _this.filterRequest();
            _this.listRequest();
            let paramString = '';
            if (_this.locationUrl.indexOf("?") != -1) {
                paramString = '&tripDays=';
            }
            else {
                paramString = '?tripDays=';
            }
            _this.locationUrl = _this.locationUrl + paramString + _this.selectObj.tripDays;
            history.replaceState(null, document.title, _this.locationUrl);
        });
        //选择出发班期
        $('#leaveMonth').on('click', 'li', function () {
            _this.selectObj.leaveMonth = $(this).attr('item');
            _this.ListArray.push({TypeID: 3});
            // _this.selectObj.PageIndex = 1;
            _this.filterRequest();
            _this.listRequest();
            let paramString = '';
            if (_this.locationUrl.indexOf("?") != -1) {
                paramString = '&month=';
            }
            else {
                paramString = '?month=';
            }
            _this.locationUrl = _this.locationUrl + paramString + _this.selectObj.leaveMonth;
            history.replaceState(null, document.title, _this.locationUrl);
        });
        //选择出发国家
        $('#leaveCountry').on('click', 'li', function () {
            _this.selectObj.leaveCountry = $(this).attr('item');
            _this.ListArray.push({TypeID: 4});
            _this.selectObj.PageIndex = 1;
            _this.filterRequest();
            _this.listRequest();
            let paramString = '';
            if (_this.locationUrl.indexOf("?") != -1) {
                paramString = '&country=';
            }
            else {
                paramString = '?country=';
            }
            _this.locationUrl = _this.locationUrl + paramString + _this.selectObj.leaveCountry;
            history.replaceState(null, document.title, _this.locationUrl);
        })
        //选择出发城市
        $('#leaveCity').on('click', 'li', function () {
            _this.selectObj.leaveCity = $(this).attr('item');
            _this.ListArray.push({TypeID: 5});
            _this.selectObj.PageIndex = 1;
            _this.filterRequest();
            _this.listRequest();
            let paramString = '';
            if (_this.locationUrl.indexOf("?") != -1) {
                paramString = '&city=';
            }
            else {
                paramString = '?city=';
            }
            _this.locationUrl = _this.locationUrl + paramString + _this.selectObj.leaveCity;
            history.replaceState(null, document.title, _this.locationUrl);
        });

    }

    //静态点击传参处理
    staticBind() {
        let _this = this;
        //从hotCity接过来的方法
        window.cityCallback = function (id) {
            _this.selectObj.DepartCityID = id;
            _this.filterRequest();
            _this.listRequest();
        };
        /*function stopPropagation(e) {
         if (e.stopPropagation)
         e.stopPropagation();//停止冒泡  非ie
         else
         e.cancelBubble = true;//停止冒泡 ie
         }*/
        //阻止弹出框被点击
        $('.planPanner').click(function () {
            event.stopPropagation();
        });
        //选择产品类型
        $('#hotelMess').click(function () {
            // 阻止冒泡
            event.stopPropagation();
            $('.hideBox').slideUp("fast");
            if ($(this).next().is(":visible")) {
                $(this).next().slideUp("fast");
            } else {
                $(this).next().slideDown("fast");
            }
        });
        $('.small ul li').click(function () {
            $(this).parent().slideUp();
            _this.ListArray.push({TypeID: 1});
            $('.hotMeal').html($(this).html());
            if ($(this).html() == '全部') {
                /* _this.selectObj.proType = '';
                 _this.ListArray.*/
                let c = _this.locationUrl.indexOf('?proType=' + _this.selectObj.proType);
                let deleteProType = '';
                if (c > -1) {
                    deleteProType = _this.locationUrl.replace('?proType=' + _this.selectObj.proType, '');
                    _this.locationUrl = deleteProType;
                    // console.log(_this.locationUrl)
                } else {
                    deleteProType = _this.locationUrl.replace('&proType=' + _this.selectObj.proType, '');
                    _this.locationUrl = deleteProType;
                    // console.log(_this.locationUrl)
                }
                history.replaceState(null, document.title, _this.locationUrl);
                $('.productNote').remove();
                $('.clearAll').hide();
            } else if ($(this).html() == '自由行') {
                _this.selectObj.proType = 1;
                history.replaceState(null, document.title, _this.locationUrl);
            } else if ($(this).html() == '跟团游') {
                _this.selectObj.proType = 2;
                history.replaceState(null, document.title, _this.locationUrl);
            } else if ($(this).html() == '酒店套餐') {
                _this.selectObj.proType = 3;
                history.replaceState(null, document.title, _this.locationUrl);
            }
            _this.locationUrl = changeURLArg(_this.locationUrl, 'proType', _this.selectObj.proType);
            _this.filterRequest();
            _this.listRequest();
        });
        //点击出发
        $('.changeCity').click(function () {
            $('#indexSearchModel').hide();
        })
        //头部机加酒弹框
        $('.chioseType').click(function () {
            event.stopPropagation();
            $('.cityPanel').hide();
            $('.hideBox').slideUp("fast");
            if ($('#indexSearchModel').is(":visible")) {
                $('#indexSearchModel').slideUp("fast");
            } else {
                $('#indexSearchModel').slideDown("fast");
            }
        });
        //选择成人数量（头部弹层）
        $('.adtSelect').on('click', 'span', function () {
            event.stopPropagation();
            if ($(this).next().is(":visible")) {
                $(this).next().slideUp("fast");
            } else {
                $(this).next().slideDown("fast");
            }
            $('.childSelcet ul').slideUp("fast");
            $('.cityfrom').hide();
        });
        $('.adtSelect').on('click', 'li', function () {
            event.stopPropagation();
            $(this).parent().slideUp("fast").prev('span').html($(this).html());
        });
        //选择儿童数量（头部弹层）
        $('.childSelcet').on('click', 'span', function () {
            event.stopPropagation();
            if ($(this).next().is(":visible")) {
                $(this).next().slideUp("fast");
            } else {
                $(this).next().slideDown("fast");
            }
            $('.adtSelect ul').slideUp("fast");
        });
        $('.childSelcet').on('click', 'li', function () {
            event.stopPropagation();
            $(this).parent().slideUp("fast").prev('span').html($(this).html());
        });

        //搜索关键字
        $('.floatBtn').on('click', function () {
            _this.selectObj.Keyword = $('.keyWord').val();
            if (_this.selectObj.Keyword == '') {
                return
            }
            _this.filterRequest();
            _this.listRequest();
        });
        //通过价格区间筛选价格
        $('.blueSmallBtn').on('click', function () {
            let minPrice = $('.minPrice').val();
            let maxPrice = $('.maxPrice').val();
            _this.selectObj.StartPrice = minPrice;
            _this.selectObj.EndPrice = maxPrice;
            _this.filterRequest();
            _this.listRequest();
        });
        //点击价格排列大小
        $('.price').on('click', function () {
            if (_this.selectObj.OrderFlag == 'asc') {
                $(this).find('.priRan').css({
                    "transform": "rotate(180deg)",
                    "-ms-transform": "rotate(180deg)",
                    "-moz-transform": "rotate(180deg)",
                    "-webkit-transform": "rotate(180deg)",
                    "right": "-7px"
                });
                _this.selectObj.OrderFlag = 'desc';
            } else {
                $(this).find('.priRan').css({
                    "transform": "",
                    "-ms-transform": "",
                    "-moz-transform": "",
                    "-webkit-transform": "",
                    "right": ""
                });
                _this.selectObj.OrderFlag = 'asc';
            }
            _this.filterRequest();
            _this.listRequest();
        })
        //点击促销优惠
        $('.checkCont').on('click', function () {
            $(this).find('.checkB').toggleClass('checked');
            if ($(this).find('.checkB').hasClass("checked")) {
                _this.selectObj.DisplayDiscount = true;
            } else {
                _this.selectObj.DisplayDiscount = false;
            }
            _this.filterRequest();
            _this.listRequest();

        })
        //点击最受欢迎
        $('.welcome').on('click', function () {
            $(this).find('span').toggleClass('welSelect');
            if ($(this).find('span').hasClass('welSelect')) {
                _this.selectObj.OrderBy = 'ViewIndex';
                _this.selectObj.OrderFlag = 'desc';
            } else {
                _this.selectObj.OrderBy = 'minprice';
                _this.selectObj.OrderFlag = 'asc';
            }
            _this.filterRequest();
            _this.listRequest();
        })
        //选择上一页
        $('#prev ').on('click', 'span', function () {
            if (_this.selectObj.PageIndex <= 1) {
                _this.selectObj.PageIndex = 1
            } else {
                _this.selectObj.PageIndex--;
                _this.listRequest();
                let paramString = '';
                if (_this.locationUrl.indexOf("?") != -1) {
                    paramString = '&page=';
                } else {
                    paramString = '?page=';
                }
                if (!_this.locationUrl.indexOf('page=')) {
                    _this.locationUrl = _this.locationUrl + paramString + _this.selectObj.PageIndex;
                } else {
                    _this.locationUrl = changeURLArg(_this.locationUrl, 'page', _this.selectObj.PageIndex)
                }
                history.replaceState(null, document.title, _this.locationUrl);
            }
        });
        //选择下一页
        $('#next ').on('click', 'span', function () {
            if (_this.selectObj.PageIndex >= _this.TotalPage) {
                _this.selectObj.PageIndex = _this.TotalPage
            } else {
                _this.selectObj.PageIndex++;
                _this.listRequest();
                let paramString = '';
                if (_this.locationUrl.indexOf("?") != -1) {
                    paramString = '&page=';
                } else {
                    paramString = '?page=';
                }
                if (!_this.locationUrl.indexOf('page=')) {
                    _this.locationUrl = _this.locationUrl + paramString + _this.selectObj.PageIndex;
                } else {
                    _this.locationUrl = changeURLArg(_this.locationUrl, 'page', _this.selectObj.PageIndex)
                }
                history.replaceState(null, document.title, _this.locationUrl);
            }
        });
        //选择成人数量
        $('.slecMargAdt').on('click', 'span', function () {
            event.stopPropagation();
            $('.hideBox').slideUp("fast");
            if ($(this).next().is(":visible")) {
                $(this).next().slideUp("fast");
            } else {
                $(this).next().slideDown("fast");
            }

        });
        $('.slecMargAdt').on('click', 'li', function () {
            $(this).parent().slideUp("fast").prev('span').html($(this).html());
        })
        //选择儿童数量
        $('.slecMargChd').on('click', 'span', function () {
            event.stopPropagation();
            $('.hideBox').slideUp("fast");
            if ($(this).next().is(":visible")) {
                $(this).next().slideUp("fast");
            } else {
                $(this).next().slideDown("fast");
            }
        });
        $('.slecMargChd').on('click', 'li', function () {
            $(this).parent().slideUp("fast").prev('span').html($(this).html());
        });

        //点击body，所有打开都关闭
        $('body').click(function () {
            $('#productType').slideUp('fast');
            $('.slecMargAdt ul').slideUp('fast');
            $('.slecMargChd ul').slideUp('fast');
            $('.adtSelect ul').slideUp('fast');
            $('.childSelcet ul').slideUp('fast');
            $('#indexSearchModel').slideUp('fast');
        });
    }

    //选中筛选条件添加删除（动态）
    dynamicBind() {
        let _this = this;
        //为筛选项绑定id
        $(".proBox[data-id = '1']").find('ul').attr('id', 'proType');
        $(".proBox[data-id = '2']").find('ul').attr('id', 'tripDays');
        $(".proBox[data-id = '3']").find('ul').attr('id', 'leaveMonth');
        $(".proBox[data-id = '4']").find('ul').attr('id', 'leaveCountry');
        $(".proBox[data-id = '5']").find('ul').attr('id', 'leaveCity');
        //点击清除全部
        $('.clearAll').off('click'); //多次触发，点击前接触绑定
        $('.clearAll').on('click', function () {
            $('.clearAll').hide();
            $(".productNote").remove();
            $('.hotMeal').html('全部');
            _this.selectObj.PageIndex = 1;
            _this.ListArray = [];
            _this.selectObj.tripDays = '';
            _this.selectObj.proType = '';
            _this.selectObj.leaveMonth = '';
            _this.selectObj.leaveCountry = '';
            _this.selectObj.leaveCity = '';
            _this.filterRequest();
            _this.listRequest();
            let currentUrl = _this.locationUrl.split('?')[0];
            _this.locationUrl = currentUrl;
            history.replaceState(null, document.title, _this.locationUrl);
        });
        //动态生成元素
        $('.productNote').off('click');
        $(".productNote").on("click", function () {
            $(this).remove();
            let dataId = $(this).attr('data-id');
            for (let i = 0; i < _this.ListArray.length; i++) {
                if (dataId == _this.ListArray[i].TypeID) {
                    _this.ListArray.splice(i, 1);
                    if (_this.ListArray.length == '') {
                        $('.clearAll').hide();
                        $('.hotMeal').html('全部');
                    }
                }
            }
            let productId = $('.productContain div[data-id = ' + dataId + ']');
            productId.find('li').attr('item', '');
            if (dataId == 1) {
                $('.hotMeal').html('全部');
                let c = _this.locationUrl.indexOf('?proType=' + _this.selectObj.proType);
                let deleteProType = '';
                if (c > -1) {
                    deleteProType = _this.locationUrl.replace('?proType=' + _this.selectObj.proType, '');
                    _this.locationUrl = deleteProType;
                } else {
                    deleteProType = _this.locationUrl.replace('&proType=' + _this.selectObj.proType, '');
                    _this.locationUrl = deleteProType;
                }
                history.replaceState(null, document.title, _this.locationUrl);
                _this.selectObj.proType = productId.attr('item');
            } else if (dataId == 2) {
                // console.log(_this.locationUrl)
                let s = _this.locationUrl.indexOf('?tripDays=' + _this.selectObj.tripDays);
                let deleteTripDays = '';
                if (s > -1) {
                    deleteTripDays = _this.locationUrl.replace('?tripDays=' + _this.selectObj.tripDays, '');
                    _this.locationUrl = deleteTripDays;
                } else {
                    deleteTripDays = _this.locationUrl.replace('&tripDays=' + _this.selectObj.tripDays, '');

                    _this.locationUrl = deleteTripDays;
                }
                history.replaceState(null, document.title, _this.locationUrl);
                _this.selectObj.tripDays = productId.attr('item');
            } else if (dataId == 3) {
                let c = _this.locationUrl.indexOf('?month=' + _this.selectObj.leaveMonth);
                let deleteLeaveMonth = '';
                if (c > -1) {
                    deleteLeaveMonth = _this.locationUrl.replace('?month=' + _this.selectObj.leaveMonth, '');
                    _this.locationUrl = deleteLeaveMonth;
                } else {
                    deleteLeaveMonth = _this.locationUrl.replace('&month=' + _this.selectObj.leaveMonth, '');
                    _this.locationUrl = deleteLeaveMonth;
                }
                history.replaceState(null, document.title, _this.locationUrl);
                _this.selectObj.leaveMonth = productId.attr('item');
            } else if (dataId == 4) {
                let c = _this.locationUrl.indexOf('?country=' + _this.selectObj.leaveCountry);
                let deleteCountry = '';
                if (c > -1) {
                    deleteCountry = _this.locationUrl.replace('?country=' + _this.selectObj.leaveCountry, '');
                    _this.locationUrl = deleteCountry;
                } else {
                    deleteCountry = _this.locationUrl.replace('&country=' + _this.selectObj.leaveCountry, '');
                    _this.locationUrl = deleteCountry;
                }
                history.replaceState(null, document.title, _this.locationUrl);
                _this.selectObj.leaveCountry = productId.attr('item');
            } else if (dataId == 5) {
                let c = _this.locationUrl.indexOf('?city=' + _this.selectObj.leaveCity);
                let deleteCity = '';
                if (c > -1) {
                    deleteCity = _this.locationUrl.replace('?city=' + _this.selectObj.leaveCity, '');
                    _this.locationUrl = deleteCity;
                } else {
                    deleteCity = _this.locationUrl.replace('&city=' + _this.selectObj.leaveCity, '');
                    _this.locationUrl = deleteCity;
                }
                history.replaceState(null, document.title, _this.locationUrl);
                _this.selectObj.leaveCity = productId.attr('item');
            }
            //如果只有一个参数，改变地址
            if(_this.locationUrl.indexOf('?') != -1){
            }else{
                _this.locationUrl = _this.locationUrl.replace("&","?");
                history.replaceState(null, document.title, _this.locationUrl) ;
            }
            if (GetQueryString('page')) {
                _this.selectObj.PageIndex = GetQueryString('page');
            }
            _this.filterRequest();
            _this.listRequest();
        });
        //支持分期弹框
        $('.fenqiBg').off('mouseover').on('mouseover', function () {
            let _this = this;
            layer.tips($(this).attr("data-text"), _this,{tips: 1, time: 5000}); //在元素的事件回调体中，follow直接赋予this即可
        })
    }

    //分页渲染
    pageControl() {
        let _this = this;
        $('#pagerControls').Paging({
            pagesize: _this.selectObj.PageSize, //每页条数
            current: _this.selectObj.PageIndex,//当前页
            count: _this.TotalCount, //总数据条数
            firstTpl: false, //是否显示首页标签
            lastTpl: false, //是否显示尾页标签
            toolbar: 1, //快速跳转,0不显示,1显示跳转,2全部显示
            hash: false,
            callback: function (current, pagesize, pagecount) {
                _this.selectObj.PageIndex = current;
                _this.listRequest();
                var speed = 200;//滑动的速度
                $('body,html').animate({scrollTop: 0}, speed);
                let paramString = '';
                if (_this.locationUrl.indexOf("?") != -1) {
                    paramString = '&page=';
                } else {
                    paramString = '?page=';
                }
                if (!_this.locationUrl.indexOf('page=')) {
                    _this.locationUrl = _this.locationUrl + paramString + _this.selectObj.PageIndex;
                } else {
                    _this.locationUrl = changeURLArg(_this.locationUrl, 'page', _this.selectObj.PageIndex)
                }
                history.replaceState(null, document.title, _this.locationUrl);
            }
        });
    }

    //读取cookie用于区分出发城市
    getCookie(name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name) {
                return arr[1];
            }
        }
        return "";
    }
}
//向另一页面传参封装
function parseParam(jsonObj) {
    var varparamStr = "";
    4
    $.each(jsonObj, function (v, k) {
        var vark = "&" + v + "=" + k;
        varparamStr += encodeURI(vark);
    })
    return varparamStr.substring(1);
}
//从页面获取参数值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}
//替换页面指定参数值
/*
 * url 目标url
 * arg 需要替换的参数名称
 * arg_val 替换后的参数的值
 * return url 参数替换后的url
 */
function changeURLArg(url, arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
    return url + '\n' + arg + '\n' + arg_val;
}
new Port();
