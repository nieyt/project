import  {ga} from 'ga';
import './mod/mod-public-head';
import {cookieFun} from './mod/mod-public-method';
import * as config from './mod/mod-public-config';
import basePC from 'basePC';
import 'layerPc301';
import {staticProductTicketList,dynamicProductTicketList,staticProductMessage,dynamicProductMessage} from "./mod/mod-public-template";
ga();
class ticketListPage extends basePC{
    constructor(...age) {
        super(...age);
        //页面URL
        this.config=config;
        //loading
        this.loading=new AjaxLoading();
        //请求失败提示
        this.noData=new noDataShow();
        //cookie中取值
        this.modifyFly =null;
        this.ProductInfor=null;
        //页面初始化参数
        this.paramInfo=null;
        //当前请求参数信息
        this.currentParamInfo=null;
        //行程段列表信息（做渲染模板使用）
        this.segmentList=null;
        //已选择行程段信息（做提交使用）
        this.changeSegmentList=null;
        //默认排序
        this.defaultOrderType="desc";
        //初始化
        this.init();
        //加载事件绑定
        this.loadEventBinding();
    }
    //初始化
    init() {
            //加载loading图标
            this.loading.open();
            //cookie中取值
            this.modifyFly =JSON.parse(cookieFun.getCookie("modifyFly"));
            this.ProductInfor =JSON.parse(cookieFun.getCookie("ProductInfor"));
            //初始化参数
            this.paramInfo = this.initParameter();
            this.currentParamInfo={ProductKey:this.paramInfo.ProductKey};
            this.segmentList=[];
            //已选择行程段信息（做提交使用）
            this.changeSegmentList=[];
            //调静态产品静态机票请求
            if (this.paramInfo.entryType == 1)
            {
                this.currentParamInfo.ProductKey=this.paramInfo.ProductKey;
                this.staticProductFlightRequest(this.currentParamInfo);
            }
            //调静态产品动态去程接口
            else if(this.paramInfo.entryType == 2)
            {
                //删除并取出第一个行程段，整合静态产品动态去程接口的参数
                this.currentParamInfo=$.extend(this.currentParamInfo, this.paramInfo.segmentList.shift());
                this.staticProductGoRequest(this.currentParamInfo);
            }
            //调动态产品动态请求
            else if(this.paramInfo.entryType == 3)
            {
                this.currentParamInfo=this.paramInfo; //拿到初始化接口参数
                this.currentParamInfo.Direction=1; //排序和渲染使用
                this.dynamicProductGoRequest(this.currentParamInfo);
            }
    }
    //加载事件绑定
    loadEventBinding(){
            //展开或者闭合航班详情
            this.bindEventFlightDetails();
            //展开闭合选择仓位
            this.bindEventPositions();
            //点击排序
            this.bindEventOrder();
            //点击去程立即预订按钮
            this.bindEventBookNow();
            //点击重新选择
            this.bindEvenReselect();
            //切换已选择航班退改签规则
            this.bindEventRule();
            //切换舱位列表中退改签规则
            this.bindEventRuleDetail();
            //返回修改
            this.bindEventBack();
    }
    //返回页面初始化参数
    initParameter(){
            let paramInfo={};
            //静态产品静态入口
            if(this.modifyFly.entryType==1)
            {
                paramInfo.entryType=1;
                paramInfo.ProductKey=this.modifyFly.ProductKey;
            }
            //静态产品动态入口
            else if(this.modifyFly.entryType==2)
            {
                paramInfo.entryType=2;
                paramInfo.ProductKey=this.modifyFly.ProductKey;
                paramInfo.segmentList=this.modifyFly.segmentList;
            }
            //动态产品入口
            else if(this.modifyFly.entryType==3)
            {
                paramInfo.entryType=3;
                paramInfo=$.extend(paramInfo,this.modifyFly.getInfo);
            }
            return paramInfo;
            // let paramInfo={
            //     entryType:1,
            //     ProductKey :"static_0fd3e37404c7effb6601fe8069f0906f_1_0"
            // };
            // //静态产品静态入口
            // if(paramInfo.entryType==1)
            // {
            //     return paramInfo;
            // }
            // //静态产品动态入口
            // else if(paramInfo.entryType==2)
            // {
            //     paramInfo.segmentList=[
            //         {
            //             SegmentID:12342,
            //             Direction:1,
            //             RelationID:12345
            //         },
            //         {
            //             SegmentID:12342,
            //             Direction:null,
            //             RelationID:null
            //         },
            //         {
            //             SegmentID:12345,
            //             Direction:2,
            //             RelationID:12342
            //         }
            //     ];
            // }
            // //动态产品入口
            // else if(paramInfo.entryType==3)
            // {
            //     paramInfo=$.extend(paramInfo, {
            //         "ShoppingKey": "SHA|BKK|2017-05-25|2017-05-27",
            //         "SelectedFlightNumber": "MU748-MU741",
            //         "SelectedAirspaceCode": "B-K",
            //         "AirStartCityName": "上海",
            //         "AirArriveCityName": "曼谷",
            //         "AirStartDate": 1495641600,
            //         "AirBackDate": 1495814400,
            //         "AdultNum": 2,
            //         "ChildrenNum": 0,
            //         "FlightSourceType": 1,
            //
            //         // "SelectedBackFlightSourceType": 1,
            //         // "Key":"SHA|KMG|2017-04-12|2017-04-15",
            //         "SelectedBackFlightNumber": "MU5078-MU747",
            //         "SelectedBackAirSpaceCode": "K-B",
            //
            //     });
            // }
            // return paramInfo;
   }
    //根据关联ID查询相关的ResourceID
    getResourceID(releationId){
        let ResourceID=null;
        for(let i=0;i<this.changeSegmentList.length;i++)
        {
            //如果已选行程段中的SegmentID等于关联ID，则返程的舱位资源ID就是此行程段的舱位资源ID
            if(this.changeSegmentList[i].SegmentID==releationId)
            {
                ResourceID=this.changeSegmentList[i].AirPlaneTicketResourceIDList[0];
                break;
            }
        }
        return ResourceID;
    }
    //渲染行程段信息
    renderList(){
            //排序使用
            if(this.currentParamInfo.OrderByType=="asc")
            {
                this.currentParamInfo.OrderByType="desc";
            }
            else if(this.currentParamInfo.OrderByType=="desc")
            {
                this.currentParamInfo.OrderByType="asc";
            }
            else {
                this.currentParamInfo.OrderByType=this.defaultOrderType;//默认排序
            }
            //如果行程段列表不为空，遍历待渲染行程段列表
            if(this.segmentList.length>0)
            {
                //页面初始化，移除所有.backArea
                $(".descripContain").find("div.backArea").remove();
                //遍历行程段列表
                for(let i=0;i<this.segmentList.length;i++)
                {
                        //如果当前行程段有机票信息
                        if(this.segmentList[i].AirPlaneTicketList&&this.segmentList[i].AirPlaneTicketList.length>0)
                        {
                                let $item=null;
                                //渲染动态产品接口数据
                                if(this.paramInfo.entryType==3)
                                {
                                        //调动态产品模版
                                        $item=dynamicProductTicketList({AirPlaneTicketInfo:this.segmentList[i],pageInfo:this});
                                }
                                //渲染静态产品接口数据
                                else
                                {
                                        //为中间层行程段Direction赋值为0，供渲染模版使用
                                        if(this.paramInfo.entryType==1)
                                        {
                                                 //i!=0  代表不是第一个，i!=this.segmentList.length代表不是最后一个
                                                if(this.segmentList.length>2&&i!=0&&i!=this.segmentList.length-1)
                                                {
                                                    this.segmentList[i].AirPlaneTicketList[0].AirPlaneDetailList[0].Direction=0;  //代表选择中间程
                                                }
                                        }
                                        else if(this.paramInfo.entryType==2)
                                        {
                                                //this.changeSegmentList.length!=0  代表不是第一个，this.paramInfo.segmentList.length!=0代表不是最后一个
                                                if(this.changeSegmentList.length!=0&&this.paramInfo.segmentList.length!=0)
                                                {
                                                    this.segmentList[i].AirPlaneTicketList[0].AirPlaneDetailList[0].Direction=0;  //代表选择中间程
                                                }
                                        }
                                        //调静态产品模版
                                        $item=staticProductTicketList({AirPlaneTicketInfo:this.segmentList[i],pageInfo:this});

                                }
                                //第一个行程段模板显示，其他都隐藏
                                if(i!=0)
                                {
                                    $item= $($item).hide();
                                }
                                //把模版插入HTML DOM元素
                                $(".descripContain").append($item);
                        }
                }
                //每次渲染完成，清空行程段列表，以供下次渲染使用
                this.segmentList=[];
                //清除loading图标
                this.loading.remove();
            }
    }
    //展开或者闭合航班详情
    bindEventFlightDetails(){
            $(".descripContain").on('click','.flighDescr',function(){
                    //切换按钮选中状态
                    $(this).toggleClass("unfold");
                    //切换航班详情显示隐藏
                    $(this).parent().next().slideToggle();
                    //其他的所有航班详情隐藏
                    $(this).parents(".backMessage").siblings().find(".details").hide();
                    //其他的按钮未选中状态
                    $(this).parents(".backMessage").siblings().find(".backBottom .flighDescr").removeClass("unfold");
                    //所有仓位详情隐藏
                    $(".freightSpace").hide();
                    //所有仓位展开按钮是未选中状态
                    $(".check").removeClass("checkBtn");
                    //倒三角状态
                    if($(this).hasClass("unfold"))
                    {
                        $(this).addClass("up");
                        $(this).parents(".backMessage").siblings().find(".backBottom .flighDescr").removeClass("up");
                    }
                    else
                    {
                        $(this).removeClass("up");
                    }
                    //动态设置选中按钮的高度
                    if($(this).parent().height()>93)
                    {
                       $(this).height(97)
                    }
                    if($(this).parent().height()>110)
                    {
                        $(this).height(117)
                    }
            });
    }
    //展开闭合选择舱位
    bindEventPositions(){
            $(".descripContain").on('click', ".check", function () {
                //切换按钮选中状态
                $(this).toggleClass("checkBtn");
                //隔壁按钮是未选中状态
                $(this).parent().siblings().find(".check").removeClass("checkBtn");
                //其他的所有仓位详情隐藏
                $(this).parents(".backMessage").siblings().find(".freightSpace").hide();
                //其他的按钮未选中状态
                $(this).parents(".backMessage").siblings().find(".backBottom").find(".priceTick .check").removeClass("checkBtn");
                //所有航班详情隐藏
                $(".details").hide();
                //所有航班展开按钮是未选中状态
                $(".flighDescr").removeClass("unfold").removeClass("up");
                //如果未选中状态
                if(!$(this).hasClass("checkBtn"))
                {
                         //舱位详情模块隐藏
                         $(this).parents(".backBottom ").next().next().slideUp();
                }
                else
                {
                         let $freightSpace=$(this).parents(".backBottom ").next().next();
                         let content = $(this).data("rank");
                         //舱位详情单条数据隐藏
                         $freightSpace.find("div.priceContain").hide();
                        //展开头等舱
                        if (content == "best")
                        {
                            $freightSpace.find(".priceContain").find(".cabin[data-airspacecategory=1]").parent().parent().show();
                        }
                        //展开经济舱
                        else if (content == "good")
                        {
                            $freightSpace.find(".priceContain").find(".cabin[data-airspacecategory=2]").parent().parent().show();
                        }
                        $freightSpace.slideDown();

                        //居中显示.positionCabin
                        let  $tickets=$freightSpace.find("div.tickets:visible");
                        if($tickets.length<=0)
                        {
                            $freightSpace.find(".positionCabin").removeClass("float");
                        }
                        else
                        {
                            $freightSpace.find(".positionCabin").addClass("float");
                        }
                        //如果没有查到相关数据，则隐藏上层容器
                        let showArry= $freightSpace.find("div.priceContain:visible");
                        if(!showArry||showArry.length<=0)
                        {
                            $freightSpace.hide();
                        }
                }
            });
    }
    //已选择航班中的退改签规则
    bindEventRule(){
        $(".descripContain").on('click','.rul', function(){
            layer.tips($(this).data("text"), this,{tips:1,time:5000});
        });
    }
    //舱位列表中的退改签规则
    bindEventRuleDetail(){
        $(".descripContain").on('click','.ruleWrap', function(){
            layer.tips($(this).data("text"), this,{tips:1,time:5000});
        });
    }
    //返回修改
    bindEventBack(){
        let _this=this;
        $(".descripContain").on('click','.backBtn ',function(){
            if(_this.modifyFly.entryType==1||_this.modifyFly.entryType==2)
            {
                 //跳转到详情页
                 window.location.href=DetailJump(_this.ProductInfor.produceId);
            }
            else if(_this.modifyFly.entryType==3)
            {
                //跳转到动态机加酒产品选择页
                 window.location.href=config._CONFIG_[config.__webState].SelectProduct_URL;
            }
        });
    }
    //点击立即预订按钮
    bindEventBookNow(){
            let _this = this;
            $(".descripContain").on('click', '.yellowBtn', function () {
                //动态产品逻辑
                if(_this.paramInfo.entryType==3)
                {
                     //如果初始化参数中有返回时间 就是往返
                     if(_this.paramInfo.AirBackDate)
                     {
                           //无去程信息说明是第一次点击，需要做三件事1，存储去程信息 2，调返程机票接口 3.去程已选模版显示
                           if(!_this.changeSegmentList.GoFlightNumber)
                           {
                                   //1.储存去程信息
                                   _this.changeSegmentList.GoFlightNumber=$(this).data("fightcode");
                                   _this.changeSegmentList.GoAirSpaceCode=$(this).data("airspacecode");
                                   //2.调返程接口
                                   _this.paramInfo.SelectedGoFlightNumber=$(this).data("fightcode");
                                   _this.paramInfo.SelectedGoAirSpaceCode=$(this).data("airspacecode");
                                   _this.paramInfo.SelectedBackFlightSourceType=$(this).data("sourcetype");
                                   _this.currentParamInfo=_this.paramInfo;
                                   _this.currentParamInfo.Direction=2;
                                   //加载loading图标
                                   _this.loading.open();
                                   _this.dynamicProductBackRequest(_this.currentParamInfo);
                                   //3.渲染去程已选模板
                                   let info = $(this).data("info");
                                   let goTime=$(this).data("gotime");
                                   let backTime=$(this).data("backtime");
                                   let goDate=$(this).data("godate");
                                   let transFer1=$(this).data("transfer1");
                                   let transFer2=$(this).data("transfer2");
                                   let AirSpaceList=$(this).data("airspacelist");
                                   //插入已选信息模版
                                   $(".descripContain").prepend(dynamicProductMessage({info:info,AirSpaceList:AirSpaceList,pageInfo:_this,goTime:goTime,backTime:backTime,goDate:goDate,transFer1:transFer1,transFer2:transFer2,}));
                           }
                           //第二次点击只需做一件事1.把去程和返程的信息都存储到cookie
                           else
                           {
                                   //存储返程信息
                                   _this.changeSegmentList.BackFlightNumber=$(this).data("fightcode");
                                   _this.changeSegmentList.BackAirSpaceCode=$(this).data("airspacecode");
                                   _this.changeSegmentList.FlightSourceType=$(this).data("sourcetype");
                                   _this.changeSegmentList=$.extend(_this.modifyFly.postInfo,_this.changeSegmentList);
                                   //先删除原来cookie
                                   cookieFun.delCookie("modifyFly");
                                   _this.modifyFly.postInfo=_this.changeSegmentList;
                                   cookieFun.setCookie("modifyFly", JSON.stringify(_this.modifyFly));
                                   //跳转到动态机加酒产品选择页
                                   window.location.href=config._CONFIG_[config.__webState].SelectProduct_URL;
                           }
                     }
                     //单程
                     else
                     {
                             //存储去程信息
                             _this.changeSegmentList.GoFlightNumber=$(this).data("fightcode");
                             _this.changeSegmentList.GoAirSpaceCode=$(this).data("airspacecode");
                             _this.changeSegmentList.FlightSourceType=$(this).data("sourcetype");
                             _this.changeSegmentList=$.extend(_this.modifyFly.postInfo,_this.changeSegmentList);
                             //先删除原来cookie
                             cookieFun.delCookie("modifyFly");
                             _this.modifyFly.postInfo=_this.changeSegmentList;
                             cookieFun.setCookie("modifyFly", JSON.stringify(_this.modifyFly));
                             //跳转到动态机加酒产品选择页
                             window.location.href=config._CONFIG_[config.__webState].SelectProduct_URL;
                     }
                }
                //静态产品逻辑
                else
                {
                        //储存已选行程段信息
                        let selectinfo={
                                        SegmentID:$(this).data("segmentid"),
                                        AirPlaneTicketResourceIDList:[$(this).data("info").ResourceID],
                                        NeedBookingHotel:$(this).data("needbookinghotel")
                        };
                        _this.changeSegmentList.push(selectinfo);

                        //静态产品静态接口
                        if(_this.paramInfo.entryType==1)
                        {
                                //假如有下个行程段
                                let $parents= $(this).parents("div.backArea").next();
                                if($parents&&$parents.length>0)
                                {
                                       //隐藏当前行程段航班，显示下个行程段航班
                                        $(this).parents("div.backArea").hide();
                                        $parents.show();
                                }
                                //没有下个行程段就是提交
                                else
                                {
                                        //加载loading图标
                                        _this.loading.open();
                                        _this.staticProductSubmit({ProductKey:_this.paramInfo.ProductKey,ChangeSegmentList:_this.changeSegmentList});
                                        return;
                                }
                        }
                        //静态产品动态接口
                        else if(_this.paramInfo.entryType == 2)
                        {

                                //取出并删除第一个行程段
                                let segInfo= _this.paramInfo.segmentList.shift();
                                //当取不出行程段的时候就代表行程段已经调完，该提交了
                                if(!segInfo)
                                {
                                        //加载loading图标
                                        _this.loading.open();
                                        //调提交接口
                                        _this.staticProductSubmit({ProductKey:_this.paramInfo.ProductKey,ChangeSegmentList:_this.changeSegmentList});
                                        return;
                                }
                                else
                                {
                                        _this.currentParamInfo=$.extend(_this.currentParamInfo,segInfo);
                                        //调静态产品动态去程接口
                                        if(segInfo.Direction==1||segInfo.Direction==null)
                                        {
                                            //加载loading图标
                                            _this.loading.open();
                                            _this.staticProductGoRequest(_this.currentParamInfo);
                                        }
                                        //调静态产品动态返程接口
                                        else if(segInfo.Direction==2)
                                        {
                                            //获取返程舱位资源ID
                                            _this.currentParamInfo.DepartureFlightResourceID=_this.getResourceID(segInfo.RelationID);
                                            //加载loading图标
                                            _this.loading.open();
                                            _this.staticProductBackRequest(_this.currentParamInfo);
                                        }
                                }

                        }

                        //渲染已选模版
                        let info = $(this).data("info");
                        let productSegment = $(this).data("productsegment");
                        let airLineName=$(this).data("airlinename");
                        let goTime=$(this).data("gotime");
                        let backTime=$(this).data("backtime");
                        let goDate=$(this).data("godate");
                        let transFer1=$(this).data("transfer1");
                        let transFer2=$(this).data("transfer2");
                        let $area= $("div.descripContain").find("div.leaveArea");
                        //证明当前行程段是中间层
                        if($area&&$area.length>0)
                        {
                            info.Direction=0;
                            $($area).after(staticProductMessage({info:info,productSegment:productSegment, airLineName:airLineName,goTime:goTime,backTime:backTime,goDate:goDate,transFer1:transFer1,transFer2:transFer2, pageInfo:_this}))//插入已选信息模版
                        }
                        else
                        {
                            $(".descripContain").prepend(staticProductMessage({info:info,productSegment:productSegment, airLineName:airLineName,goTime:goTime,backTime:backTime,goDate:goDate,transFer1:transFer1,transFer2:transFer2, pageInfo:_this}));//插入已选信息模版
                        }
                }
            });
    }
    //点击排序
    bindEventOrder() {
        let _this = this;
        $("body").on('click', 'div.sortArea span', function () {
                //加载loading图标
                _this.loading.open();
                let idx=$("div.sortArea span").index($(this));
                let direction=$(this).data("direction");
                _this.currentParamInfo.orderIndex=idx;
                //默认排序
                if(idx==0)
                {
                        delete  _this.currentParamInfo.OrderByField;
                        delete  _this.currentParamInfo.OrderByType;
                }
                //起飞时间排序
                else if(idx==1)
                {
                        _this.currentParamInfo.OrderByField="DepartureTime";
                        _this.currentParamInfo.OrderByType=$(this).data("order");
                }
                //价格排序
                else if(idx==2)
                {
                        _this.currentParamInfo.OrderByField="Price";
                        _this.currentParamInfo.OrderByType=$(this).data("order");
                }

                //动态产品
                if(_this.paramInfo.entryType==3)
                {      //去程
                       if(direction==1)
                       {
                           _this.dynamicProductGoRequest(_this.currentParamInfo);
                       }
                       //返程
                       else if(direction==2)
                       {
                           _this.dynamicProductBackRequest(_this.currentParamInfo);
                       }
                }
                //静态产品
                else
                {
                        //去程
                        if(_this.currentParamInfo.Direction==1||_this.currentParamInfo.Direction==null)
                        {
                            _this.staticProductGoRequest(_this.currentParamInfo);
                        }
                        //返程
                        else if(_this.currentParamInfo.Direction==2)
                        {
                            _this.staticProductBackRequest(_this.currentParamInfo);
                        }
                }
        });
   }
    //获取排序样式
    getOrderClass(orderIndex,orderType){
        let orderClass="up";
        if(this.currentParamInfo.orderIndex==orderIndex)
        {
            if(orderType=="desc")
            {
                orderClass="up";
            }
            else
            {
                orderClass="down";
            }
        }
        return orderClass;
    }
    //获取排序状态
    getOrderStatus(orderIndex){
        if(this.currentParamInfo.orderIndex==orderIndex)
        {
             return this.currentParamInfo.OrderByType;
        }
        return this.defaultOrderType;
    }
    //点击重新选择
    bindEvenReselect(){
            let _this=this;
            $(".descripContain").on('click','div.flghtReset',function(){
                $(".descripContain").empty();
                _this.init();
            });
    }
    //请求静态产品静态机票接口
    staticProductFlightRequest(par){
            let _this = this;
            $.ajax({
                    type: "GET",
                    // url: "http://dev.ceair.com/api/Product/GetAirPlaneTicketListByKey",
                    url: this.config.API.baseUrl+this.config.API.travel.ticket.GetAirPlaneTicketListByKey,
                    data: par,
                    success: function(data)
                    {
                        if(data.Code==200)
                        {
                            _this.segmentList=data.Data.AirPlaneTicketList;//把行程段信息放进_this.segmentList，以供渲染
                            _this.renderList();//调渲染方法
                        }
                        else
                        {
                            _this.noData.commonShow({
                                noDataTitle: "很抱歉！",
                                noDataTip:data.Msg?data.Msg:'未知原因，机票列表获取失败',
                                btnShow: true,
                                btnText: "返回", //按钮文本
                                btnUrl:config._CONFIG_[config.__webState].travelDetail //按钮链接
                            }, 'body');
                        }

                    },
                    error: function(data)
                    {
                        _this.noData.commonShow({
                            noDataTitle: "很抱歉 !",
                            noDataTip: "没有找到符合您产品，请重新搜索！",
                            btnShow: true, //是否显示按钮
                            btnText: "返回", //按钮文本
                            btnUrl:window.location.href=config._CONFIG_[config.__webState].travelDetail //按钮链接
                        }, 'body');
                    }
            });
    }
    //请求静态产品动态去程航班列表接口
    staticProductGoRequest(par){
            let _this = this;
            $.ajax({
                    type: "POST",
                    // url: "http://devnew.ceair.com/api/Flight/GetDepartureFightList",
                    // url: "https://vacations.ceair.com/api/Flight/GetDepartureFightList",
                    url: this.config.API.baseUrl+this.config.API.travel.ticket.GetDepartureFightList,
                    data: par,
                    success: function success(data)
                    {
                            if(data.Code==200)
                            {
                                let flightList= data.Data.FlightList;
                                if(flightList&&flightList.length>0)
                                {
                                        //构造静态产品动态去程的行程段信息
                                        let segmentInfo={
                                            SegmentID:flightList[0].SegmentID,
                                            DepartureTravelCityName:flightList[0].DepartureTravelCityName,
                                            DestinationTravelCityName:flightList[0].DestinationTravelCityName,
                                            DepartureTime:flightList[0].AirPlaneDetailList[0].DepartureTime
                                        };
                                        //构造和静态接口返回同样结构的数据，既当前行程段，和当前行程段下的机票列表
                                        let info={
                                            ProductSegment:segmentInfo,
                                            AirPlaneTicketList:flightList
                                        };
                                        //把构造的行程段信息放到_this.segmentList，以供渲染使用
                                        _this.segmentList.push(info);
                                        //调渲染方法
                                        _this.renderList();
                                    }
                            }
                            else
                            {
                                    _this.noData.commonShow({
                                        noDataTitle: "很抱歉！",
                                        noDataTip:data.Msg?data.Msg:'未知原因，机票列表获取失败',
                                        btnShow: true,
                                        btnText: "返回", //按钮文本
                                        btnUrl:config._CONFIG_[config.__webState].travelDetail //按钮链接
                                    }, 'body');
                            }

                    },
                    error: function(data)
                    {
                            _this.noData.commonShow({
                                noDataTitle: "很抱歉 !",
                                noDataTip: "没有找到符合您产品，请重新搜索！",
                                btnShow: true, //是否显示按钮
                                btnText: "返回", //按钮文本
                                btnUrl:config._CONFIG_[config.__webState].travelDetail //按钮链接
                            }, 'body');
                    }
            });
    }
    //请求静态产品动态返程航班列表接口
    staticProductBackRequest(par){
            let _this = this;
            $.ajax({
                    type: "POST",
                    // url: "http://devnew.ceair.com/api/Flight/GetReturnTripFlightList",
                    // url: "https://vacations.ceair.com/api/Flight/GetReturnTripFlightList",
                    url: this.config.API.baseUrl+this.config.API.travel.ticket.GetReturnTripFlightList,
                    data: par,
                    success: function success(data)
                    {
                            if(data.Code==200)
                            {
                                    let flightList= data.Data.FlightList;
                                    if(flightList&&flightList.length>0)
                                    {
                                        let segmentInfo={
                                            SegmentID:flightList[0].SegmentID,
                                            DepartureTravelCityName:flightList[0].DepartureTravelCityName,
                                            DestinationTravelCityName:flightList[0].DestinationTravelCityName,
                                            DepartureTime:flightList[0].AirPlaneDetailList[0].DepartureTime
                                        };
                                        let info={
                                            ProductSegment:segmentInfo,
                                            AirPlaneTicketList:flightList
                                        };
                                        _this.segmentList.push(info);
                                        _this.renderList();
                                    }
                            }
                            else
                            {
                                    _this.noData.commonShow({
                                        noDataTitle: "很抱歉！",
                                        noDataTip:data.Msg?data.Msg:'未知原因，机票列表获取失败',
                                        btnShow: true,
                                        btnText: "返回", //按钮文本
                                        btnUrl:config._CONFIG_[config.__webState].travelDetail //按钮链接
                                    }, 'body');
                            }

                    },
                    error: function()
                    {
                            _this.noData.commonShow({
                                noDataTitle: "很抱歉 !",
                                noDataTip: "没有找到符合您产品，请重新搜索！",
                                btnShow: true, //是否显示按钮
                                btnText: "返回", //按钮文本
                                btnUrl:config._CONFIG_[config.__webState].travelDetail //按钮链接
                            }, 'body');
                    }
            });
    }
    //请求动态产品动态去程接口
    dynamicProductGoRequest(par){
            let _this=this;
            $.ajax({
                    type: "POST",
                    // url: "http://devnew.ceair.com/api/Product/GetGoFightList",
                    // url: "https://vacations.ceair.com/api/ProductApi/GetGoFightList",
                    url: this.config.API.baseUrl+this.config.API.travel.ticket.GetGoFightList,
                    data: par,
                    success: function success(data)
                    {
                            if(data.Code==200)
                            {
                                    let flightList=data.Data.FightCollection.FlightList;
                                    if(flightList&&flightList.length>0)
                                    {
                                        let segmentInfo={ //构造行程段信息
                                            DepartureTravelCityName:flightList[0].StartCityName,
                                            DestinationTravelCityName:flightList[0].EndCityName,
                                            DepartureTime:flightList[0].FightStartDate
                                        };
                                        let info={
                                            ProductSegment:segmentInfo,
                                            AirPlaneTicketList:flightList
                                        };
                                        _this.segmentList.push(info);
                                        _this.renderList();
                                    }
                            }
                            else
                            {
                                    _this.noData.commonShow({
                                        noDataTitle: "很抱歉！",
                                        noDataTip:data.Msg?data.Msg:'未知原因，机票列表获取失败',
                                        btnShow: true,
                                        btnText: "返回", //按钮文本
                                        btnUrl:config._CONFIG_[config.__webState].SelectProduct_URL //按钮链接
                                    }, 'body');
                            }

                    },
                    error: function()
                    {
                        _this.noData.commonShow({
                            noDataTitle: "很抱歉 !",
                            noDataTip: "没有找到符合您产品，请重新搜索！",
                            btnShow: true, //是否显示按钮
                            btnText: "返回", //按钮文本
                            btnUrl:config._CONFIG_[config.__webState].SelectProduct_URL //按钮链接
                        }, 'body');
                    }
            });
    }
    //请求动态产品动态返程接口
    dynamicProductBackRequest(par){
        let _this=this;
        $.ajax({
                type: "POST",
                // url: "http://devnew.ceair.com/api/Product/GetBackFightList",
                // url: "https://vacations.ceair.com/api/ProductApi/GetBackFightList",
                url: this.config.API.baseUrl+this.config.API.travel.ticket.GetBackFightList,
                data: par,
                success: function success(data)
                {

                        if(data.Code==200)
                        {
                                let flightList=data.Data.FightCollection.FlightList;
                                if(flightList&&flightList.length>0)
                                {
                                    let segmentInfo= {
                                        DepartureTravelCityName:flightList[0].StartCityName,
                                        DestinationTravelCityName:flightList[0].EndCityName,
                                        DepartureTime:flightList[0].FightStartDate
                                    };
                                    let info={
                                        ProductSegment:segmentInfo,
                                        AirPlaneTicketList:flightList
                                    };
                                    _this.segmentList.push(info);
                                    _this.renderList();
                                }
                        }
                        else
                        {
                                _this.noData.commonShow({
                                    noDataTitle: "很抱歉！",
                                    noDataTip:data.Msg?data.Msg:'未知原因，机票列表获取失败',
                                    btnShow: true,
                                    btnText: "返回", //按钮文本
                                    btnUrl:config._CONFIG_[config.__webState].SelectProduct_URL //按钮链接
                                }, 'body');
                        }

                },
                error: function()
                {
                        _this.noData.commonShow({
                            noDataTitle: "很抱歉 !",
                            noDataTip: "没有找到符合您产品，请重新搜索！",
                            btnShow: true, //是否显示按钮
                            btnText: "返回", //按钮文本
                            btnUrl:config._CONFIG_[config.__webState].SelectProduct_URL //按钮链接
                        }, 'body');
                }
                });
    }
    //请求提交静态产品接口
    staticProductSubmit(par){
            let _this = this;
            $.ajax({
                    type: "POST",
                    // url: "http://devnew.ceair.com/api/Product/SubmitProductResourceChange",
                    // url: "https://vacations.ceair.com/api/Product/SubmitProductResourceChange",
                    url: this.config.API.baseUrl+this.config.API.travel.ticket.SubmitProductResourceChange,
                    data: par,
                    success: function success(data)
                    {

                        if(data.Code==200)
                        {
                            //设置cookie
                            _this.ProductInfor.ProductKey=data.Data.ProductKey;
                            cookieFun.setCookie("ProductInfor", JSON.stringify(_this.ProductInfor));
                            //跳转到详情页
                           window.location.href=DetailJump(_this.ProductInfor.produceId);
                        }
                        else
                        {
                            _this.noData.commonShow({
                                noDataTitle: "很抱歉！",
                                noDataTip:data.Msg?data.Msg:'未知原因，机票列表获取失败',
                                btnShow: true,
                                btnText: "返回详情页", //按钮文本
                                btnUrl:DetailJump(_this.ProductInfor.produceId) //按钮链接
                            }, 'body');
                        }

                    },
                    error: function()
                    {
                            _this.noData.commonShow({
                                noDataTitle: "很抱歉 !",
                                noDataTip: "没有找到符合您产品，请重新搜索！",
                                btnShow: true, //是否显示按钮
                                btnText: "返回详情页", //按钮文本
                                btnUrl:DetailJump(_this.ProductInfor.produceId) //按钮链接
                            }, 'body');
                    }
            });
    }
}
new ticketListPage();





