/**
 * Created by sunyi on 2016/11/23.
 */
import 'es5';
import {template} from './mod-public-template';

import './mod-public-head';
import './mod-public-method';
import 'layerPc';
import 'layerPcCss';
import '../control/datepicker';

//import '../control/date';

var loading=new AjaxLoading();
window.loading=loading;
var noData=new noDataShow();
window.noData=noData;

//根据URL得到想对应的旅游类型
function parse_url_my(url) {
    var pattern = /(\w+)=([^\#&]*)/ig;
    var parames = {};
    url.replace(pattern, function (attr, key, value) {
        parames[key] = value;
    });
    return parames;
}
window.parse_url_my=parse_url_my;

window.api=API.baseUrl;

class Render{
    init(){
        var _this = this;

        _this.airport();
        _this.command();
    }
    easyAjax(opts){
        var define = {
            type:'post',
            url:'null',
            scriptCharset: "utf-8",
            dataType:'json',
            data:{},
            cache:false,
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
    }
    airport(){
        var _this = this,
            DifferenceFun,//机场列表ajax方法
            TerminalFun;   //机场经纬度
        DifferenceFun=function (data) {
            loading.remove();
            if(data.HttpCode==200 && $.isEmptyObject(data.Data)==false){
                var english=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
                    head={};
                function Contrast(name) {
                    for(var n=0; n<english.length;n++){
                        if(english[n]==name){
                            return true;
                        }
                    }
                    return false;
                }
                $.each(data.Data,function (i,item) {
                    var Letter;    //首字母
                    Letter=(item.Pinyin).substring(0,1);
                    if(Contrast(Letter)){
                        if(!head[Letter])
                            head[Letter]=[];
                        head[Letter].push(item);
                    }
                });
                //console.log(JSON.stringify(head));
                var html = template({data:head,english:english});
                $('body').append(html);
                $('.cityMain .title li').click(function (e) {
                    e.stopPropagation();
                    $('.cityMain .title li').removeClass('active');
                    $(this).addClass('active');
                    $('.cityMain .city_body').hide();
                    var nr=$('.cityMain .city_body'),
                        pipei =$.trim($(this).html()),
                        aimVal;
                    for(var i=0; i < nr.length; i++){
                        aimVal = $.trim(nr.eq(i).attr('data-letter'));
                        if(pipei.indexOf(aimVal) != -1 && aimVal != ''){
                            nr.eq(i).show()
                        }
                    }
                });
                $('.cityMain').click(function (e) {
                    e.stopPropagation();
                    $(this).show();
                });
                $('.cityMain .citykuai li').click(function (e) {
                    e.stopPropagation();
                    var $thisval=$(this).html(),
                        $thisCity=$(this).attr('data-cityname'),
                        $thistype=$('.selectTransfer .on').attr('data-cod');
                    if($thistype==1){
                        $('.jieji .airportTxt').val($thisval);
                        $('.jieji .airportTxt').attr('data-cityname',$thisCity);
                    }else{
                        $('.songji .airportTxt').val($thisval);
                        $('.songji .airportTxt').attr('data-cityname',$thisCity);
                    }
                    $('.cityMain').hide();
                    _this.easyAjax({
                        url:api+API.transfer.DDPOI,
                        data:{
                            'city':$thisCity,
                            'sug':$thisval
                        },
                        success:TerminalFun
                    });
                    loading.open({"maskClass": "hide"}); //整页面loading去掉#loadingBox，第三个参数maskStyle: "dotLoading"，更改loading点点
                });
            }
        };
        TerminalFun=function (data) {
            loading.remove();
            $('.noData').remove();
            var address,
                longitude, //经度
                latitude,  //纬度
                displayname,
                $thistype=$('.selectTransfer .on').attr('data-cod');
            //console.log(data.Data[0].address);
            if(data.HttpCode==200 && $.isEmptyObject(data.Data)==false){
                address=data.Data[0].address;
                longitude=data.Data[0].lng;
                latitude=data.Data[0].lat;
                displayname=data.Data[0].displayname;
                //console.log(address+longitude+latitude);
                if($thistype==1){
                    $('.jieji .airportTxt').attr({'data-address':address,'data-lng':longitude,'data-lat':latitude,'data-displayname':displayname});
                    $('.jieji .addressTxt').removeClass('disableTxt');
                    $('.jieji .addressTxt').removeAttr('readonly');
                }else{
                    $('.songji .airportTxt').attr({'data-address':address,'data-lng':longitude,'data-lat':latitude,'data-displayname':displayname});
                    $('.songji .addressTxt').removeClass('disableTxt');
                    $('.songji .addressTxt').removeAttr('readonly');
                }
                $("#CarList").empty();
            }else{
                //if($thistype==1){
                    $('.jieji .addressTxt').addClass('disableTxt');
                    $('.jieji .addressTxt').attr('readonly','readonly');
                    noData.commonShow({
                        noDataTitle: "很抱歉！",
                        noDataTip:"该机场暂时还不支持接送机！"
                    }, '#CarList1');
                // }else{
                //     $('.songji .addressTxt').addClass('disableTxt');
                //     $('.songji .addressTxt').attr('readonly','readonly');
                //     noData.commonShow({
                //         noDataTitle: "很抱歉！",
                //         noDataTip:"该机场暂时还不支持接送机！"
                //     }, '#CarList2');
                // }
                // $('.addressTxt').addClass('disableTxt');
                // $('.addressTxt').attr('readonly','readonly');
                // //layer.msg('该机场暂时还不支持接送机！');
                // noData.commonShow({
                //     noDataTitle: "很抱歉！",
                //     noDataTip:"该机场暂时还不支持接送机！"
                // }, '#CarList');
            }
        };
        _this.easyAjax({
            url:api+API.transfer.GetDDSupportAirportList,
            type:'get',
            success:DifferenceFun
        });
        loading.open({"maskClass": "hide"}); //整页面loading去掉#loadingBox，第三个参数maskStyle: "dotLoading"，更改loading点点
        var airportTxtclick=function (e) {
            e.stopPropagation();
            var $top=$(this).offset().top + 31,
                $left = $(this).offset().left;
            $('.cityMain').css({'display':'block','top':$top,'left':$left});
            $('.cityMain .title li:first').click();
        };
        $("body").off("click", ".airportTxt");
        $('body').on('click','.airportTxt',airportTxtclick);
    }
    command(){
        var _this = this,
            $thisCity='',
            addressFun,
            htmllist='<div class="addressList"><ul></ul></div>';
        $('body').append(htmllist);
        addressFun=function (data,type) {
            var addressList='',
                $top=$(this).offset().top + 31,
                $left = $(this).offset().left;
            //console.log(this);
            $('.addressList').css({'display':'block','top':$top,'left':$left});
            if(data.HttpCode==200){
                if($.isEmptyObject(data.Data)==false){
                    $.each(data.Data,function (i,item) {
                        addressList+='<li data-lng="'+item.lng+'" data-lat="'+item.lat+'" data-address="'+item.address+'" title="'+item.displayname+'">'+item.displayname+'</li>';
                    });
                    $('.addressList ul').empty().append(addressList);
                    $('.addressList ul li').click(function (e) {
                        e.stopPropagation();
                        var $thisval=$(this).html(),
                            $thislng=$(this).attr('data-lng'),
                            $thislat=$(this).attr('data-lat'),
                            $thisaddress=$(this).attr('data-address');
                        if(type==1){
                            $('.jieji .addressTxt').val($thisval);
                            $('.jieji .addressTxt').attr({'data-lng':$thislng,'data-lat':$thislat,'data-address':$thisaddress});
                        }else{
                            $('.songji .addressTxt').val($thisval);
                            $('.songji .addressTxt').attr({'data-lng':$thislng,'data-lat':$thislat,'data-address':$thisaddress});
                        }
                        $('.addressList').hide();
                    });
                }
            }else{
                layer.msg(data.ErrorMessage);
            }
        };
        var addressTxtKey=function (e) {
            e.stopPropagation();
            var $thisval=$(this).val(),
                $this=this,
                $thistype=$('.selectTransfer .on').attr('data-cod');
            if($thistype==1){
                $thisCity=$('.jieji .airportTxt').attr('data-cityname');
            }else{
                $thisCity=$('.songji .airportTxt').attr('data-cityname');
            }
            $(this).removeAttr('data-address');
            if($thisval!=''){
                _this.easyAjax({
                    url:api+API.transfer.DDPOI,
                    data:{
                        'city':$thisCity,
                        'sug':$thisval
                    },
                    success:function(data){
                        addressFun.call($this,data,$thistype);
                    }
                });
            }else{
                $('.addressList ul').empty();  //搜索地名隐藏
            }
        };
        $("body").off("keyup", ".addressTxt");
        $('body').on('keyup','.addressTxt',addressTxtKey);
        // var addressTxtclk=function (e) {
        //     e.stopPropagation();
        //     if($('.addressList ul li').length>0){
        //         $('.addressList').show();
        //     }
        // };
        // $('body').off('clcik','.addressTxt');
        // $('body').on('click','.addressTxt',addressTxtclk);
        //$(document).off().on('click','body',function (){
        $('body').click(function () {
            $('.cityMain').hide();
            $('.addressList').hide();
        });
    }
}
new Render().init();