import objectAssign from 'object-assign';
let util = {
    getUrlPrometer(pName) {
        if(!pName){
            return "";
        }
        let reg = new RegExp(pName + "=[^&]*");
        let ar = location.search.match(reg) || [""];
        return ar[0].replace(pName + "=","");
    }
};
let customDate = {
    dateFormat(date,fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
};
objectAssign(util,customDate);
export default util;

