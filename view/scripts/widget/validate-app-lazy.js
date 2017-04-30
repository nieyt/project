import 'layerApp';
import 'layerAppCss';
class Validate {
    constructor(options) {
        this.options = {
            target: ".validate_box",                        // 验证区域
            errorClassName: 'f_error',                      // 验证失败样式
            blur: true,                                     // 是否支持失去焦点即验证
            isOk: true,                                     // 验证区域的验证结果
            callback: null,                                 // 验证不通过回调函数
            firstCheckSelf: true,
            time: 3000,
            breakFn: null,
            resultState:false
        }
        if (options) {
            $.extend(this.options, options);
        }
        this.tooltip = null;// 存储tooltip实例
        this._method = {
            // 必填
            required:function(value,rule){
                var result = {
                    message: "此项为必填项",
                    isOk: true
                }
                var defaultValue = $(this).attr("defaultvalue");
                if (!rule) {
                    return result;
                }
                if (!value.length || defaultValue == value) {
                    result.isOk = false;
                }
                return result;
            },
            // 最小长度
            minLength: function (value, rule) {
                var result = {
                    message: "输入长度最小是" + rule + "的字符串",
                    isOk: true
                }
                if (value.length < rule) {
                    result.isOk = false;
                }
                return result;
            },
            // 最大长度
            maxLength: function (value, rule) {
                var result = {
                    message: "输入长度最大是" + rule + "的字符串",
                    isOk: true
                }
                if (value.length > rule) {
                    result.isOk = false;
                }
                return result;
            },
            // 长度区间
            rangeLength: function (value, rule) {
                var result = {
                    message: "输入长度必须介于 " + rule[0] + " 和 " + rule[1] + " 之间的字符串",
                    isOk: true
                }
                if ((value.length < rule[0]) || (value.length > rule[1])) {
                    result.isOk = false;
                }
                return result;
            },
            // 最小值
            min: function (value, rule) {
                var result = {
                    message: "最小值不能小于" + rule,
                    isOk: true
                }
                if (isNaN(value)) {
                    return result.isOk = false;
                }
                if (Number(value) < Number(rule)) {
                    result.isOk = false;
                }
                return result;
            },
            // 最大值
            max: function (value, rule) {
                var result = {
                    message: "最大值不能大于" + rule,
                    isOk: true
                }
                if (isNaN(value)) {
                    return result.isOk = false;
                }
                if (Number(value) > Number(rule)) {
                    result.isOk = false;
                }
                return result;
            },
            // 范围
            range: function (value, rule) {
                var result = {
                    message: "请输入" + rule[0] + "至" + rule[1] + "之间的数字",
                    isOk: true
                }
                value = parseInt(value);
                if (typeof value != 'Number') {
                    result.isOk = false;
                } else if ((value < rule[0]) || (value > rule[1])) {
                    result.isOk = false;
                }
                return result;
            },
            // 数字
            isNumber: function (value, rule) {
                var result = {
                    message: "请输入数字",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (isNaN(value)) {
                    result.isOk = false;
                }
                return result;
            },
            // 整数
            isDigits: function (value, rule) {
                var reg = /^-?[1-9]\d*$/;
                var result = {
                    message: "请输入整数",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value)) {
                    result.isOk = false;
                }
                return result;
            },
            // 匹配电子邮箱
            isEmail: function (value, rule) {
                //var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
                var result = {
                    message: "请输入正确的电子邮箱",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value) || value.length == 0) {
                    result.isOk = false;
                }
                return result;
            },
            // 匹配URL
            isUrl: function (value, rule) {
                //var reg = /(https?|ftp|mms):\/\/([A-z0-9]+[_\-]?[A-z0-9]+\.)*[A-z0-9]+\-?[A-z0-9]+\.[A-z]{2,}(\/.*)*\/?/;
                var reg = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
                var result = {
                    message: "请输入正确的URL",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value) || value.length == 0) {
                    result.isOk = false;
                }
                return result;
            },
            // 匹配国内座机
            isPhone: function (value, rule) {
                var reg = /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
                var result = {
                    message: "请输入正确的电话号码",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value) || value.length == 0) {
                    result.isOk = false;
                }
                return result;
            },
            // 匹配手机号
            isMobile: function (value, rule) {
                var reg = /1[3,4,5,8]\d{9}$/;
                var result = {
                    message: "请输入正确的手机号码",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value)) {
                    result.isOk = false;
                }
                return result;
            },
            // 匹配身份证
            isIdCard: function (value, rule) {
                var reg = /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
                var result = {
                    message: "请输入正确的身份证号码",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value)) {
                    result.isOk = false;
                }
                return result;
            },
            // 匹配邮政编码
            isPostCode: function (value, rule) {
                var reg = /^[1-9]\d{5}$/;
                var result = {
                    message: "请输入正确的邮政编码",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value) || (value.length != 6)) {
                    result.isOk = false;
                }
                return result;
            },
            // 匹配邮政编码
            isIP: function (value, rule) {
                var reg = /^((0[0-9]|1[0-9]\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\d{1,2}))\.((0[0-9]|1[0-9]\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\d{1,2}))$/;
                var result = {
                    message: "请输入正确的IP地址",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value)) {
                    result.isOk = false;
                }
                return result;
            },
            // 验证输入相同
            equalTo: function (value, rule) {
                var val = $.trim($(rule).val());
                var result = {
                    message: "两次输入不一致",
                    isOk: true
                };
                if (value !== val) {
                    result.isOk = false;
                }
                return result;
            },
            // 验证日期，只验证格式，不验证有效性
            date: function (value, rule) {
                var result = {
                    message: "请输入正确格式的日期，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})|(^\d{4})\/(\d{1,2})\/(\d{1,2})/;
                if (!reg.test(value)) {
                    result.isOk = false;
                }
                return result;
            },
            //验证QQ
            isQQ: function (value, rule) {
                var reg = /^\d{5,10}$/;
                var result = {
                    message: "请输入正确的QQ号",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value)) {
                    result.isOk = false;
                }
                return result;
            },
            // 中文姓名
            cnName: function (value, rule) {
                var reg = /^[\u4e00-\u9fa5a-zA-Z-]+$/;
                var result = {
                    message: "中文姓名只能包含汉字（至少一个）、字母和连字符，生僻字可用拼音代替",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (!reg.test(value)) {
                    result.isOk = false;
                }
                return result;
            },
            // 至少N个中文汉字
            hasCnChar: function (value, rule) {
                var reg = /[\u0100-\uffff]/;
                var result = {
                    message: "至少包含一个中文",
                    isOk: true
                };
                if (!rule) {
                    return result;
                }
                if (reg.test(value)) {
                    return result;
                }
                return result.isOk = false;
            },
            // 自定义正则校验
            regEXP: function (value, rule) {
                var result = {
                    message: "内容不符合要求",
                    isOk: true
                };
                try {
                    var reg = new RegExp(rule);
                } catch (e) {
                    return result;
                }
                if (!reg.test(value)) {
                    result.isOk = false;
                }
                return result;
            },
            //
            childrenSelect: function (value, rule) {
                var result = {
                    message: "请选择一条记录",
                    isOk: false
                };
                var element = rule.split(',')[0];
                var className = rule.split(',')[1];
                $(this).children(element).each(function () {
                    if ($(this).hasClass(className)) {
                        result.isOk = true;
                        return false;
                    } else {
                        result.isOk = false;
                    }
                });
                return result;
            }
        }
        this.init();
    }
    init() {
        this._event();
    }
    _event() {
        if (this.options.blur) {
            this._blur();
        }
    }
    // 失去焦点
    _blur() {
        var self = this;
        var result = true;
        var noblur = false;
        $(this.options.target).find('*[rule]').blur(function () {
            // 禁用的文本框跳过，不进行验证
            if($(this).prop("disabled")){
                return;
            }
            if (self.options.firstCheckSelf) {
                result = self._checkRule.call(this, self,1);
                if (result) {
                    self._removeClass.call(self, this);
                    //搜索页面不需要实时验证上面未填的选项
                    self.check(this)
                }
            } else {
                self.check(this)
            }
            if (self.options.callback && (typeof self.options.callback == 'function')) {
                self.options.callback.call(self);
            }
        });
    }
    // 验证所有
    check(target) {
        var self = this;
        var result = true;
        $(this.options.target).find('*[rule]').each(function () {
            if (this === target) {
                return false;
            }
            result = self._checkRule.call(this, self);
            if (!result) {
                return false;
            }
            self._removeClass.call(self, this);
            if (self.options.breakFn) {
                if (!self.options.breakFn()) {
                    return false;
                }
            }
        });

        return this.options.isOk;
    }
    // 执行验证
    _checkRule(self,num) {
        var rule = self._getRule(this);
        if (rule) {
            var value = $.trim($(this).val());
            var result = {};
            for (var i in rule) {
                // 当用户配置的验证不存在，则忽略进行下一个匹配校验
                try {
                    result = self._method[i].call(this, value, rule[i]);
                } catch (e) {
                    //console.log("验证规则"+i+"暂不存在");
                    continue;
                }
                if (!result.isOk) {
                    if (!self._getMessage(this)) {
                        self.showError(this, result.message);
                    } else {
                        var message = self._getMessage(this)[i];
                        if (message) {
                            self.showError(this, message);
                        } else {
                            self.showError(this, result.message);
                        }
                    }
                    return self.options.isOk = false;
                }
            }
            return self.options.isOk = true;
        }
        return self.options.isOk = true;
    }
    // 获取自定义验证规则
    _getRule(me) {
        var rule = $(me).attr("rule");
        if (rule) {
            rule = $.parseJSON(rule);
        }
        return rule;
    }
    // 获取自定义验证信息
    _getMessage(me) {
        var message = $(me).attr("message");
        if (message) {
            message = $.parseJSON(message);
        }
        return message;
    }
    // 获取验证结果
    getVelidateResult() {
        return this.options.isOk;
    }
    // 验证成功后删除错误class名
    _removeClass(target) {
        $(target).removeClass(this.options.errorClassName);
    }
    
    // 验证失败提示-tooltip module
    showError(target, message, self) {
        $(target).addClass(this.options.errorClassName);
        layer.open({
            content: message,
            skin: 'msg',
            time: this.options.time
        });
    }
}
export default Validate;