import 'es5';
import './mod/mod-public-method';
import 'layerPc301';
import 'datePicker';
import validate from 'validatePC';
import mySerialize from 'serialize';


class Component{
    constructor(){

    }
    action(){
        //折叠面板
        $(".layui-collapse .layui-colla-item .layui-colla-title").on("click",function () {
            $(this).next().toggleClass("layui-show");
        })

        //简单弹框提示
        $("#msgBtn").on('click',function(){
            layer.msg('hello');
        })

        //有确定按钮提示
        $("#msgOpen").on('click',function(){
            layer.open({
                title: '在线调试'
                ,content: '可以填写任意3的layer代3码h',
                area:'400px',
                yes:function () {
                    alert(1);
                },
                btn: ['确定', '取消'],
                cancel:function () {
                    console.log(2);
                    alert(2);
                }
            });
        })

        //区域loading
        var loading=new AjaxLoading();
        //开启
        $("#msgloading").on('click',function(){
            //index =layer.load(1,"#loadingBox");
            loading.open({"maskClass": "hide", target:"#loadingBox"}); //整页面loading去掉#loadingBox，第三个参数maskStyle: "dotLoading"，更改loading点点
        })
        //关闭
        $("#msgLoadingClose").on('click',function(){
            loading.remove();
        })

        //全屏loading
        $("#fullloading").on('click',function(){
            loading.open({"maskClass": "hide"});
        })

        var noData=new noDataShow();
        $("#showNoData").on('click',function(){
            noData.commonShow({
                noDataTitle: "很抱歉！",
                noDataTip: "不存在该产品信息或产品已过期！",
                btnShow: true,
                btnText: "返回首页",
                btnUrl: '#'
            }, '#noDataBox');
        });

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
            showBtn:true,
            onRender: function (date) {
                return {
                    disabled: (date.valueOf() < new Date().valueOf())
                }
            },
            onBeforeShow: function () {
                $('#inputDate').DatePickerSetDate($('#inputDate').val(), true);
                //$('.cityPanel').hide();
            },
            onChange: function (formated, dates) {
                $('#inputDate').val(formated).DatePickerHide();
            }
        });

        validate (module => {
            var m = new module({
                target: '.msgBox',
                position:1
            });
            console.log(m.check());
            // true,false
        });
        $("#boxBtn").off("click").on("click",()=>{
            mySerialize(module => {
                var m = new module();
                var getJson = m.getJSON($('.box'));
                console.log(getJson);
            })
        })
        selectdownList();
    }
    int(){
        this.action();
    }
}
let component=new Component();
component.int();

