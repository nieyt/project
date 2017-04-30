/*
    依赖jquery
*/
class Pjax {
    constructor(options) {
        this.options = {
            callback: null
        }
        this.defaults = {
            pjax : null,
            progress : $('<div class="top_loading">\
                <div class="progress" style="width:10%;height:3px;background:#f90"></div>\
                <img src="http://ceair-resource.oss-cn-shanghai.aliyuncs.com/images/s_loading.gif">\
            </div>')
        };
        if(options){
            $.extend(this.options,options);
        }
        this._init();
    }
    _init() {
        $("body").append(this.defaults.progress);
        this._event();
    }
    _event() {
        this._popState();
    }
    // 浏览器的前进、回退监听
    _popState() {
        var self = this;
        window.onpopstate = function(event){
            if(history.replaceState && event.state && event.state.url && event.state.title){
                self.sendAjax({
                    url : event.state.url,
                    target : "home"
                },false);
            }
        }
    }
    // 向目标URL发起请求
    request(obj) {
        var self = this;
        // 判断浏览器是否支持pjax
        if('pushState' in history){
            self.sendAjax(obj,true);
        }else{
            location.href = obj.url;
        }
    }
    //分离请求
    sendAjax(obj,pushState) {
        var self = this;
        this._startStage();
        if(window.pjax){
            window.pjax.abort();
            window.pjax = null;
        }
        window.pjax = $.ajax({
            url : obj.url,
            type : obj.method,
            dataType : 'json',
            data : obj.data,
            cache: false,
            success : function(result){
                window.pjax = null;
                if(result && result.Code == '0' && result.Data){
                    self._render(result,obj.url,pushState);    
                }
            },
            timeout : 5000,
            error:function(result){
                window.pjax = null;
                location.href = obj.url;
                //会自动捕获到301重定向的新结果
            }
        });
    }
    // 渲染
    _render(result,url,pushState) {
        for(var i=0;i<result.Data.length;i++){
            // Mode为3代表为返回的全局变量GS的最新值
            $("#"+result.Data[i].Id).prop("outerHTML",result.Data[i].Content);
        }
        this._endStage();
        if(pushState){
            document.title = result.Title;
            history.pushState({url:url,title:document.title},document.title,url);
        }
        if(this.options.callback && (typeof this.options.callback == 'function')){
            // 渲染后的回调方法
            this.options.callback.apply(this,arguments);
        }
    }
    // 动画第一阶段
    _startStage() {
        var self = this;
        this.defaults.progress.fadeIn().find(".progress").css({"width":0}).animate({"width":"85%"},400,function(){
            self._secondStage();
        });
    }
    // 动画第二阶段
    _secondStage() {
        var self = this;
        this.defaults.progress.find(".progress").animate({"width":"95%"},2000,function(){
            self._thirdStage();
        });
    }
    // 动画第三阶段
    _thirdStage() {
        var self = this;
        this.defaults.progress.find(".progress").animate({"width":"98%"},3000,function(){
            //self._endStage();
        });
    }
    // 动画第四阶段
    _endStage() {
        this.defaults.progress.find(".progress").stop(true,false).animate({"width":"100%"},200,function(){
            $(this).css({"width" : "0"}).parent().hide();
        });
    }
}
export default Pjax;