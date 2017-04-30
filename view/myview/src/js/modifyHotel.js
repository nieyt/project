/**
 * Created by 000232 on 2017/3/14.
 */
import  {ga} from 'ga';
import 'es5';
import './mod/mod-public-head';
import './mod/mod-public-method';
import {html_decode,cookieFun} from './mod/mod-public-method';
import 'layerPc301';
import * as config from './mod/mod-public-config';
import basePC from 'basePC';
import './control/pagerControl';
import search from './mod/mod-hotel-search';
import {selectDownHack,modifyList,roomList} from './mod/mod-public-template';
ga();
class modifyHotel extends basePC{
    constructor(){
        super();
        this.noData=new noDataShow();//实例化无数据显示
        this.loading=new AjaxLoading();//实例化加载
        this.config = config;
        this.typeList=$('#typeList');
        this.filterBox=$('#filterBox');
        this.filterSelected=$('#filterBar');
        this.getParam = this.parseUrl();
        this.type=this.getParam.entryType==1?'ss':this.getParam.entryType==2?'sd':'dd';
        this.modifyParm =JSON.parse(cookieFun.getCookie("modifyFly"));
        this.ProductInfor =JSON.parse(cookieFun.getCookie("ProductInfor"));
        this.param = this.type==='ss'?{}:this.type==='sd'?{
            PageNum:1,
            PageSize:10,
            Price: '',
            Star: '',
            Brand: '',
            Sort:'',
            IsAsc:false
        }:{
            PageNum:1,
            PageSize:10,
            Price: '',
            Star: '',
            Brand: '',
            OrderByField:'',
            OrderByType:'desc'
        };//基础参数配置
        this.paramInit();
        if(this.type==='dd'){
            let mHotel=this.modifyParm.postInfo;
            this.param.SelectedHotelID=mHotel.HotelID;
            this.param.SelectedRoomID=mHotel.RoomID;
            this.param.SelectedRoomProviderID=mHotel.RoomProviderID;
            this.param.SelectedRoomRatePlanID=mHotel.RoomRatePlanID;
            this.param.SelectedRoomNumber=mHotel.RoomNumber;
            this.param.SelectedRoomPerson=mHotel.RoomPerson;
            this.param.HotelCityName=mHotel.HotelCityName;
            this.param.AdultNum=mHotel.AdultNum;
            this.param.ChildrenNum=mHotel.ChildrenNum;
        }
    }
    init(){
        let that=this;
        if (that.type!='ss'){
            that.search = new search({ //实例化搜索条件
                ajax: this.ajax,
                props: this
            });
        }else{
            that.filterBox.hide();
            $('#hotelInfo').css({
                'border-bottom':0,
                'margin-bottom':0
            })
            that.typeList.find('.topBar ul').hide();
        }
        //点击排序
        if(this.type!=='ss'){
            that.typeList.find('.topBar').on('click','ul li',function () {
                if($(this).hasClass('recommend')){
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active').removeClass('asc').data('act',false);
                    that.type==='sd'?that.param.Sort='':that.param.OrderByField='';
                }else{
                    $(this).addClass('active');
                    if($(this).data('act')){
                        $(this).toggleClass('asc');
                    }else{
                        if($(this).data('key')==='Price'){
                            $(this).addClass('asc');
                        }
                    }
                    $(this).siblings().removeClass('active').removeClass('asc').data('act',false);
                    if(that.type==='sd'){
                        that.param.Sort=$(this).data('key');
                        that.param.IsAsc=$(this).hasClass('asc');
                    }else{
                        that.param.OrderByField=$(this).data('key');
                        that.param.OrderByType=$(this).hasClass('asc')?'asc':'desc';
                    }
                    $(this).data('act',true)
                }
                that.searchList(that.type,that.param);
            })
        }
        that.searchList(that.type,that.param);
    }

    /** 根据参数渲染默认酒店*/
    paramInit(){
        let that=this,
            topInfo=$('#hotelInfo');
        this.param=$.extend(this.param,this.getParam);
        let checkInDate=this.param.HotelCheckInDate*1000,
            checkOutDate=this.param.HotelCheckOutDate*1000;
        let dataInfo=`<span>${this.param.HotelName}</span>
                      <span>${this.formatDate(checkInDate,'yyyy-MM-dd').format}
                            ${this.formatDate(checkInDate,'EE').format}入住 -
                            ${this.formatDate(checkOutDate,'yyyy-MM-dd').format}
                            ${this.formatDate(checkOutDate,'EE').format}离店
                            (${Math.ceil((checkOutDate-checkInDate)/86400000)}晚)
                      </span>
                      <a class="backBtn">返回商品详情</a>`;
        topInfo.append(dataInfo).on('click','.backBtn',function () {
            if(that.type!=='dd'){
                window.location.href=DetailJump(that.ProductInfor.produceId);
            }else{
                window.location.href=config._CONFIG_[config.__webState].SelectProduct_URL;
            }
        });
    }

    /** 调取修改酒店列表
     *@param {string} sort 'dd':动态产品动态酒店；'sd':静态产品动态酒店；'ss':静态产品静态酒店(默认值)
     *@param {object} data 请求参数 */
    searchList(sort,sendData,current){
        let url=sort==='dd'?config.API.baseUrl+config.API.travel.GetHotelList:sort==='sd'?config.API.baseUrl+config.API.travel.GetDynamicHotelList:config.API.baseUrl+config.API.travel.GetSegmentHotelListByKey;
        let that=this;
        this.ajax({
            url: url,
            data: sendData,
            type:sort==='ss'?'get':'post',
            beforeSend(){
                that.typeList.find('.hotelList').empty();
                that.loading.open({"maskClass": "hide","target":that.typeList.find('.hotelList')});
            },
            complete(){
                that.loading.remove();
            }
        },data => {
            if(data.HotelList && data.HotelList.length){
                let l;
                if(sort==='ss'){
                    l=data.HotelList.length;
                    for(let i=0;i<l;i++){
                        let hotelListItem=data.HotelList[i];
                        hotelListItem.RoomList=that.roomGroup(hotelListItem.RoomList);
                        hotelListItem.HotelDes=html_decode(hotelListItem.HotelDes);
                        if(hotelListItem.DefaultRoom && hotelListItem.DefaultRoom.IsDefault===true){
                            data.BookingCount=hotelListItem.DefaultRoom.BookingCount;
                            that.defaultPrice= data.Price=hotelListItem.DefaultRoom.PriceInfoList[0].OriginalPrice * data.BookingCount;
                            hotelListItem.default=true;
                        }
                    }
                }else{
                    l=data.Paging.TotalCount;
                    let example=data.HotelList[0].RoomList[0];
                    if(sort==='dd'){
                        data.BookingCount=that.modifyParm.postInfo.RoomNumber;
                    }else{
                        data.BookingCount=example.BookingCount;
                    }
                    // that.defaultPrice=example.SalePrice * data.BookingCount - example.PriceDifference;//计算默认总价
                    that.defaultPrice=data.Price=that.param.sigglePrice * data.BookingCount;//计算默认总价
                    for(let i=0,list=data.HotelList.length;i<list;i++){
                        let hotelListItem=data.HotelList[i];
                        hotelListItem.RoomList=that.roomGroup(hotelListItem.RoomList);
                        hotelListItem.HotelDes=html_decode(hotelListItem.HotelDes);
                    }
                }
                that.typeList.find('.topBar .right').html(`
                <div class="con">当前<span>${l}</span>条符合条件</div>
                <div class="result">共计<span>${l}</span>个酒店结果</div>`);
                that.typeList.find('.hotelList').html(modifyList(data));
                that.handleList(sort);
                if(sort!=='ss'&&!current){
                    let page=$('#page_id');
                    page.empty();
                    page.Paging({
                        pagesize: that.param.pageSize, //每页条数
                        count: data.Paging.TotalCount, //总数据长度
                        firstTpl: false, //是否显示首页标签
                        lastTpl: false, //是否显示尾页标签
                        toolbar: 1, //快速跳转,0不显示,1显示跳转,2全部显示
                        callback: function (current) {
                            sendData.PageNum=current;
                            that.searchList(sort,sendData,current);
                        }
                    });
                }
            }else{
                that.noData.commonShow({
                    noDataTitle: "很抱歉！",
                    noDataTip:'暂无符合要求的酒店',
                    btnShow: false
                }, that.typeList.find('.hotelList'));
            }
        });
    }

    /** 点击展开房型 调取更多房型
     *@param {string} sort 'dd':动态产品动态酒店；'sd':静态产品动态酒店(默认值)
     *@param {object} data 请求参数 */
    searchRoomList(sort,data){
        let url=sort==='dd'?config.API.baseUrl+config.API.travel.GetDynamicHotelMoreRoomList:config.API.baseUrl+config.API.travel.GetDynamicMoreRoomList;
        let that=this;
        this.ajax({
            url: url,
            data: data
        },data => {
            data.RoomList=that.roomGroup(data.RoomList);
            console.log(data);
            // roomList(data).on('click','.checkCol i',function () {
            //     $(this).addClass('active');// todo
            // })
            that.typeList.find('.roomTypeWrap').append(roomList(data));
        });
    }

    /** 根据ID将RoomList数据分组
     *@param {array} roomList 房型列表 */
    roomGroup(roomList){
        let map={},list=[];
        for(let j=0,jl=roomList.length;j<jl;j++){
            let item=roomList[j];
            if(!map[item.ID]){
                list.push({
                    'ID':item.ID,
                    'ResourceName':item.ResourceName,
                    'PictureURL':item.PictureURL,
                    'Group':[item]
                })
                map[item.ID]=item;
            }else{
                for(let k=0,kl=list.length;k<kl;k++){
                    let listItem=list[k];
                    if(listItem.ID===item.ID){
                        listItem.Group.push(item);
                        break;
                    }
                }
            }
        }
        return list;
    }

    /** 提交资源数据绑定*/
    submitBind(element,sort){
        let that=this;
        element.on('click','.checkCol i',function () {
            $(this).addClass('active');
            that.loading.open({"maskClass": "hide"});
            if(sort==='dd'){
                that.DynamicSubmit({
                    HotelID:element.data('hotelid'),
                    RoomID:$(this).data('id'),
                    RoomNumber:$(this).parent().siblings('.selectCol').find('input').val(),
                    RoomProviderID:$(this).data('pid'),
                    RoomRatePlanID:$(this).data('rateid')
                });
            }else{
                that.StaticSubmit({
                    "ProductKey":that.param.ProductKey,
                    "ChangeSegmentList": [
                        {
                            "SegmentID": that.param.SegmentID,
                            "RoomList": [
                                {
                                    "RoomResourceID": $(this).data('rid'),
                                    "BookingCount": $(this).parent().siblings('.selectCol').find('input').val()
                                }
                            ],
                            "NeedBookingHotel": true
                        }
                    ]
                })
            }
        })
    }

    /** 展开收起房型*/
    handleList(sort){
        let that=this,
            tableWrap=that.typeList.find('.tableWrap');
        that.selectHack();
        for(var i=0,l=tableWrap.length;i<l;i++){
            let tableItem=$(tableWrap[i]);
            that.submitBind(tableItem,sort);
            if(tableItem.find('.roomTypeWrap').height()<176){
                tableItem.next().hide();
                tableItem.addClass('unfold');
            }else{
                let colItem=tableItem.find('.first .roomTypeCol');
                for(let j=0,jl=colItem.length;j<jl;j++){
                    if($(colItem[j]).attr('rowspan')>3){
                        $(colItem[j]).addClass('high');
                    }
                }
                let foldHeight=$(colItem[0]).attr('rowspan')>3?176:32+$(colItem[0]).outerHeight();
                tableItem.height(foldHeight);
                tableItem.next().click(
                    function () {
                        $(this).toggleClass('active');
                        if($(this).hasClass('active')){
                            if(!$(this).data('active') && sort!='ss'){
                                that.searchRoomList(sort,$.extend({HotelID:$(this).data('hotelid')},that.param)); // todo
                            }
                            $(this).find('.foldText').html('收回房型');
                            tableItem.height(tableItem.find('table').outerHeight());
                        }else{
                            $(this).find('.foldText').html('展开房型');
                            tableItem.height(foldHeight);
                        }
                        $(this).data('active', true);
                    }
                )
            }
        }
    }

    /** 下拉框重写，避免收起房型时下拉框被隐藏*/
    selectHack(){
        let that=this;
        let typeList=this.typeList;
        typeList.off('click').on("click",".selectModel .select",function(){
            let _this=$(this);
            _this.toggleClass('active');
            $(".selectModel .select").not(_this).removeClass('active');
            typeList.find('.downList li').off('click');
            typeList.find('.downList').slideUp('fast',function () {
                $(this).remove();
            });
            if(_this.hasClass('active')){
                typeList.find('.hotelList').append(selectDownHack({
                    max:_this.data('max'),
                    min:_this.data('min')
                }));
                let top=_this.offset().top-typeList.find('.hotelList').offset().top+22,
                    left=_this.offset().left-typeList.offset().left-1;
                typeList.find('.downList').css({
                    'top': top,
                    'left': left,
                    'z-index':1000
                }); 
                typeList.find('.downList').slideDown('fast');
            }
            typeList.find('.downList li').on("click",function(){
                let val=this.getAttribute('value');
                _this.toggleClass('active').text($(this).text());
                _this.next().val(val);
                typeList.find('.downList').slideUp('fast',function () {
                    $(this).remove();
                });
                that.diffCount(_this,val);
            })
        })
    }

    /** 静态产品提交资源*/
    StaticSubmit(data){
        this.ajax({
            url: config.API.baseUrl+config.API.travel.ticket.SubmitProductResourceChange,
            data: data
        },data => {
            this.ProductInfor.ProductKey=data.ProductKey;
            cookieFun.delCookie("ProductInfor");
            cookieFun.setCookie("ProductInfor",JSON.stringify(this.ProductInfor));
            window.location.href=DetailJump(this.ProductInfor.produceId);
        });
    }

    /** 动态产品提交资源(修改cookie至上个页面提交)*/
    DynamicSubmit(data){
        $.extend(this.modifyParm.postInfo,data,true);
        cookieFun.delCookie("modifyFly");
        cookieFun.setCookie("modifyFly",JSON.stringify(this.modifyParm));
        window.location.href=config._CONFIG_[config.__webState].SelectProduct_URL;
    }
    /** 计算差价
     * @param {target} _this 当前点击的下拉框显示框
     * @param {int/string} val 当前选中间数 */
    diffCount(_this,val){
        let diff=_this.parent().parent().next().next(),
            diffVal=diff.data('price')*val - this.defaultPrice;//总价减默认总价
        if(diffVal>=0){
            diff.text(diffVal);
            diff.hasClass('less') && diff.removeClass('less');
        }else{
            diff.text(-diffVal);
            diff.addClass('less');
        }
    }

    /** ajax通用方法
    *@param {object} option
    *@param {function} successCall
    *@param {function} errorCall*/
    ajax(option,successCall,errorCall)
    {
        let that=this;
        $.ajax(
            $.extend({
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                error(err){
                    console.log(err);
                },
                success(data){
                    switch(data.Code){
                        case 200:
                            successCall && successCall(data.Data);
                            break;
                        case 401:
                            LoginJump(window.location.href);
                            break;
                        default:
                            errorCall && errorCall();
                    }
                }
            },option)
        );
    }
}
new modifyHotel().init();