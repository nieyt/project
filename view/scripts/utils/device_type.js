
export const DeviceType=(()=>{
    var u = navigator.userAgent;
    if (u.match(/Android/i) != null) { //android代码
        return "Android";
    } else if (u.match(/iPhone|iPod/i) != null) { //IOS
        return "IOS";
    } else {
        return "WP";
    }
})()


