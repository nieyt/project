import {setCookie,getCookie} from 'cookieUtils';
class Base {
    /**
     * @param  url 字符串
     * @description 以object的类型返回当前页面的URL参数，
     */
    parseUrl() {
        var pattern = /(\w+)=([^\#&]*)/ig,
            parames = {};
        location.href.replace(pattern, function (attr, key, value) {
            parames[key] = decodeURI(value);
        });
        return parames;
    }

    formatDate(e, separator){
        switch (typeof e) {
            case "string":
                e = new Date(parseInt(e));
                break;
            case "number":
                e = new Date(e);
        }
        var t = new RegExp(/^(\d{1})$/),
            a = (e.getMonth() + 1 + "").replace(t, "0$1"),
            n = (e.getDate() + "").replace(t, "0$1");

        function Format() {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
                "H+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            var week = {
                "0": "\u65e5",
                "1": "\u4e00",
                "2": "\u4e8c",
                "3": "\u4e09",
                "4": "\u56db",
                "5": "\u4e94",
                "6": "\u516d"
            };
            if (/(y+)/.test(separator)) {
                separator = separator.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(separator)) {
                separator = separator.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(separator)) {
                    separator = separator.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return separator;
        }

        return {
            year: e.getFullYear(),
            month: a,
            date: n,
            //format: this.year + separator + this.month + separator + this.date
            format: Format.call(e, separator)
        }
    }


    setCookie(...args) {
        setCookie(...args);
    }
    getCookie(key) {
        return getCookie(key)
    }
    getPreMonth(date) {
        var year = date.getFullYear(); //获取当前日期的年份
        var month = date.getMonth() + 1; //获取当前日期的月份
        var day = date.getDate(); //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 == 0) {
            year2 = parseInt(year2) - 1;
            month2 = 12;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
        var t2 = new Date(year2 + '/' + month2 + '/' + day2);
        return t2;
    }
    getNextMonth(date) {
        var year = date.getFullYear(); //获取当前日期的年份
        var month = date.getMonth() + 1; //获取当前日期的月份
        var day = date.getDate(); //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中的月的天数
        var year2 = year;
        var month2 = parseInt(month) + 1;
        if (month2 == 13) {
            year2 = parseInt(year2) + 1;
            month2 = 1;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }
        var t2 = new Date(year2 + '/' + month2 + '/' + day2);
        return t2;
    }
}
export default Base;

