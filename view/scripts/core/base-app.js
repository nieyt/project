import Base from './base';
let shareHandler=[];
class BaseApp extends Base {
	/**
	* @method getDeviceType
	* @description 获取设备系统名称
	*/
	getDeviceType() {
		const u = navigator.userAgent;
	    if (u.match(/Android/i) != null) { //android代码
	        return "Android";
	    } else if (u.match(/iPhone|iPod/i) != null) { //IOS
	        return "IOS";
	    } else {
	        return "WP";
	    }
	}
	
	/**
	* @method isInApp
	* @param  无
	* @description 获取运行平台
	*/
	isInApp() {
		if(navigator.userAgent.indexOf('CEAIRAPP')>-1||this.getP())return true;

		switch (this.getDeviceType()) {
	        case "Android":
	            return !!window.Login&&!!window.gotoback;

	        case "IOS":
	            return !!window.clickOnback&&!!window.clickOnLogin;

	        case "WP":
	            return !!window.external&&!!window.external.notify;

	    }
	}
	/**
	* @method setHeader
	* @param  title 字符串
	* @description 设置app头部显示内容
	*/
	setHeader(title) {
		try{
	    	switch (this.getDeviceType()) {
	            case "Android":
	                gototitle.clickOntitle(title);
	                break;
	            case "IOS":
	                clickOntitle(title);
	                break;
	            case "WP":
	                external.notify('clickOntitle?' + title);
	                break;
	    	}
		}catch(e){
	        console.log(e)
		}
	}
	bindBack(){
	    window.historyBack=()=> history.go(-1);
	    return (isFirst)=>{
	        try{
	           switch (this.getDeviceType()) {
	                case "Android":
	                    if(!isFirst){
	                        gotoback.clickOnback('true', 'historyBack()');
	                    }
	                    else
	                        gotoback.clickOnback('false', '');
	                    break;
	                case "IOS":
	                    if(!isFirst)
	                        clickOnback("true", "historyBack()");
	                    else{
	                        clickOnback("false", "");
	                    }
	                    break;
	                case "WP":
	                    if(!isFirst)
	                        external.notify('clickOnback?true&historyBack');
	                    else
	                        external.notify('clickOnback?true&');
	                    break;
	            }
	        }catch(e){
	            console.log(e)
	        }
	    }
	}
	/**
	* @method login
	* @param  url 字符串 登录后跳转的地址
	* @param  title 字符串	登录后的title
	* @description 页面跳转
	*/
	login(url=location.href, title){
		if(this.isInApp()){
			this.hybirdLogin(location.href,title);
			return;
		}
		location.href = 'http://m.ceair.com/mobile/user/user!loginOtherPage.shtml?channel=712&redirectUrl=' + url;
		// location.href='http://sc.ceair.com:8080/mobile/user/user!loginOtherPage.shtml?channel=712&redirectUrl=' + url
	}
	// 登录
	hybirdLogin(url=location.href, title){
		url=url.replace(/\&/g,'&amp;');
        try{
            switch (this.getDeviceType()) {
                case "Android":
                    Login.clickOnLogin(url, title, "mobile_login");
                    break;
                case "IOS":
                    clickOnLogin(url, title, "mobile_login");
                    break;
                case "WP":
                    external.notify("clickOnLogin?" + url + "&" + title + "&mobile_login");
                    break;
            }
        }catch(e){
            console.log(e);
        }
	}


   getCardVoucher(passportId,couponType,couponStatus,pageNo,pageSize){
   		if(this.isInApp()){
			this.hybirdCardVoucher(passportId,couponType,couponStatus,pageNo,pageSize);
			return;
		}else{
			location.href ='http://m.ceair.com/pages/coupon/index.html?p='+this.getP();
		}

   }


    /**
	* @method CardVoucher
	* @param  passportId 字符串 用户ID
	* @param  couponType 字符串	 HONGBAO（红包），THIRD_COUPON（第三方卡券），TALENT（达人券）
	* @param  couponStatus 字符串 // 默认 FORUSE
	* @param  pageNo  字符串    // 默认 1
	* @param  pageSize 字符串   // 默认 25
	*/
    hybirdCardVoucher(passportId,couponType,couponStatus,pageNo,pageSize){
    	 try{
            switch (this.getDeviceType()) {
                case "Android":
                    gotocardsurl.clickOngotoCardsurl( passportId,couponType,couponStatus,pageNo, pageSize )
                    break;
                case "IOS":
                    clickOngotoCardsurl( passportId,couponType,couponStatus,pageNo,pageSize )
                    break;
                case "WP":
                    external.notify('clickOngotoCardsurl? passportId& couponType &couponStatus &pageNo & pageSize ');
                    break;
            }
        }catch(e){
            console.log(e);
        }
    }


    saveAppParam(params={}){
	    let {p,Entry}=params;
	    p&&this.saveP(p);
	    Entry&&this.saveEntry(Entry);
	}
	saveP(p){
	   	p&&sessionStorage.setItem('p',p);
	}
	getP(){
	    return sessionStorage.getItem('p');
	}
	saveEntry(Entry){
	    Entry&&this.setCookie('Entry',Entry,{path:'/'});
	}
	getEntry(Entry){
	    return this.getCookie('Entry');
	}

	isHybirdLogin(){
	    return !!this.getP();
	}
	downloadPdf(title,url){
	    if(!this.isInApp())return;
	    try{
	        switch (this.getDeviceType()) {
	            case "Android":
	            gotopdf.clickOnPdf(title,url);
	            break;
	        }
	    }catch(e){
	        console.log(e);
	    }
	}
	isHybirdAdroid(){
	    return this.isInApp()&&this.getDeviceType()=='Android';
	}
	/*
	@description 解析url参数
	@param url {string} url
	@return {object} 参数对象
	*/
	parse_url(url=window.location.href) {
	    var pattern = /(\w+)=([^\#&]*)/ig;
	    var parames = {};
	    url.replace(pattern, function (attr, key, value) {
			let paramValue=decodeURIComponent(value);
			if(paramValue=='null'){
				paramValue=null;
			}else if(paramValue=='true'){
				paramValue=true;
			}else if(paramValue=='false'){
				paramValue=false;
			}else if(paramValue!=null&&!isNaN(Number(paramValue))){
				paramValue=Number(paramValue);
			}
	        parames[key] = paramValue;
	    });
	    return parames;
	};
	/*
	@description 设置url参数
	@param url {string} url
	@param params {object} 参数
	@return {string} 新的url
	*/
	setUrlParams(url,params){
		var urlStr=url.split('?');
		urlStr[1]=this.serializeParams(params);
		return urlStr.join('?')
	}
	/*
	@description 修改url参数
	@param url {string} url
	@param params {object} 参数
	@return {string} 新的url
	*/
	extendUrlParams(url,params){
		var oldparams=this.parse_url(url);
		return this.setUrlParams(url,Object.assign(oldparams,params));
	}

	/*
	@description 继承当前url参数变成新的url
	@param newBaseUrl {string} url
	@param params {object} 参数
	@return {string} 新的url
	*/
	extendUrlParamsAndCreateNewUrl(newBaseUrl,params){
		var oldparams=this.parse_url(location.href);
		return this.setUrlParams(newBaseUrl,Object.assign(oldparams,params));
	}

	serializeParams(params){
		var strParams=[];
		for(var key in params){
			if(params[key]!=undefined){
				strParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
			}
		}

		return strParams.join('&');
	}

	/*
	@description app头部分享按钮绑定分享内容
	@param {object} options
	options.type type='share' 显示分享按钮，type='home'显示home按钮
	options.shareTitle {string}  分享标题
	options.imgUrl {string}  分享图片路径
	options.shareContent {string}  分享内容
	options.shareUrl {string}  分享的url链接
	*/
	onHeaderShare({type, shareTitle='',imgUrl='',shareContent='', shareUrl=''}) {
		try{
			this.extendUrlParams(shareUrl,{p:undefined});//过滤p值
			switch (this.getDeviceType()) {
				case 'Android':
					gotoTitleShare.clickOnTitleShare(type, shareTitle,imgUrl,shareContent, shareUrl);
					break;
				case 'IOS':
					clickOnTitleShare(type, shareTitle, imgUrl||'null', shareContent, shareUrl);
					break;
			}
		}catch(e){
			console.log(e);
		}

	}
	/*
	@description H5页面分享
	@param {object} options
	options.shareTitle {string}  分享标题
	options.imgUrl {string} 分享图片路径
	options.shareContent {string} 分享内容
	options.shareUrl {string} 分享的url链接
	options.success {function}  分享成功回调
	options.error {function}  分享失败回调
	*/
	share({shareTitle='',imgUrl='',shareContent='', shareUrl='',success=new Function,error=new Function}){
		this.extendUrlParams(shareUrl,{p:undefined});//过滤p值
		shareHandler.push({success,error});
		try{
			switch (this.getDeviceType()) {
				case 'Android':
					gotowebchatshare6.clickOnwebchatshare6(shareTitle,shareContent, shareUrl,'shareSuccess()','shareFail()', imgUrl);
					break;
				case 'IOS':
					clickOnwebchatshare(shareTitle, shareContent, shareUrl,'shareSuccess()','shareFail()',imgUrl);
					break;
			}
		}catch(e){
			console.log(e);
		}
	}
	/*
	@description 获取localStorage中对应key的值
	@param key {string}
	*/
	getItem(key) {
		var valueObj = localStorage.getItem(key);
		if(valueObj.expires < new Date){
			localStorage.removeItem(key);
			return null;
		}
		return valueObj.value;
	}
	/*
	@description 把值存储到localStorage中
	@param key {String} 键
	@param value {String} 值
	@param expires {Date} 过期时间，不填则存储一个理论上永不过期的值
	*/
	setItem(key,value,expires=new Date('2099/12/31 23:59:59')) {
		localStorage.setItem(key,{value,expires});
	}
	/*
	@description 删除localStorage中对应的key项
	@param key {String} 键
	*/
	removeItem(key) {
		localStorage.removeItem(key);
	}
	/*
	@description 删除localStorage所有项
	*/
	clear(){
		localStorage.clear();
	}
};
export default BaseApp;

window.shareSuccess=function(...args){
	while(shareHandler.length){
		let {success}=shareHandler.shift();
		if(typeof success=='function')
			success(...args);
	}
}

window.shareFail=function(...args){
	while(shareHandler.length){
		let {error}=shareHandler.shift();
		if(typeof error=='function')
			error(...args);
	}
}
