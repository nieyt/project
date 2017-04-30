class Serialize {
    constructor() {
    }
    getJSON(panel) {
        var self = this;
        var data = {};
        if(!$(panel)){
            throw new Error("the parameter can`t be empty");
        }
        $(panel).find("[name]").each(function(){
            var _this = $(this);
            var name = _this.attr("name");
            var value = $.trim(_this.val());
            var tagName = self._getTagtName(_this);
            // 禁用的文本框不取值
            if(_this.prop("disabled")){
                return;
            }
            var defaultValue = _this.attr("default");
            self._chioseMethod.call(self,{
                tagName : tagName,
                target : _this,
                name : name,
                value : value,
                data : data,
                defaultValue : defaultValue
            });
        });
        return data;
    }
    // 获取元素的名称
    _getTagtName(element){
        var tagName = element.prop("tagName").toLowerCase();
        var type = element.attr("type");
        switch (tagName){
            case "input" :
                if(type == "radio" || type == "checkbox"){
                    tagName = type;
                }else{
                    tagName = "input";
                }
                break;
            case "select" :
                tagName = "select";
            default :
                tagName = "input";
                break;
        }
        return tagName;
    }
    // 外观模式方法
    _chioseMethod(options){
        switch (options.tagName){
            case 'radio' :
                this._radio(options);
                break;
            case 'checkbox' :
                this._checkbox(options);
                break;
            default :
                this._normal(options);
                break;
        }
    }
    _normal(options){
        // 获取分割符
        var symbol = options.target.attr("split");
        if(options.data[options.name] === undefined){
            if(options.defaultValue && options.value.length === 0){
                options.value = options.defaultValue;
            }
        }
        // 用自义的分割符将值分割
        if(symbol){
            if(options.value === ""){
                options.data[options.name] = [];
            }else{
                options.data[options.name] = options.value.split(symbol);
            }
            return;
        }
        options.data[options.name] = options.value;
    }
    // 获取选中的radio值
    _radio(options){
        // 初次的时候赋空值
        if(options.data[options.name] === undefined){
            options.data[options.name] = "";
        }
        if(!options.target.prop("checked")){
            return;
        }
        options.data[options.name] = options.value;
    }
    // 获取选中的checkbox值
    _checkbox(options){
        if(options.data[options.name] === undefined){
            options.data[options.name] = [];
        }
        if(!options.target.prop("checked")){
            return;
        }
        options.data[options.name].push(options.value);
    }
}
export default Serialize;