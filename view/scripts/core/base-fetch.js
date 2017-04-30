import 'fetch';

let reqCount=0;
let _fetch=window.fetch;

export default class BaseFetch{
	constructor(option={}) {
		this.option=option;
	}
	/*
	  @param {object} option 请求参数对象
	  @return {Promise}
	*/
	fetch(option){

		reqCount++;
		deleteUndefined(option);
		option=Object.assign({},this.option,option);//合并config配置
		let {url,method='GET',hasLoading}=option;
		hasLoading!==false?this.showLoading():this.clearReqCount();//loading处理
		this.addParams(option);
		this.addData(option);
		url=this.handleUrl(url);//url处理
		url= buildUrl(url,paramSerializer(option.params));//url加上参数
		this.handleBody(option);//请求body处理
		return _fetch(url,{
				method,
				...option.configs
			})
			.then((...args)=>this.checkStatus(...args))
			.then((...args)=>this.parseJSON(...args))
			.catch((...args)=>this.catchParseJSON(...args))
			.then((...args)=>this.checkCode(...args))
	}

	get(url,{hasLoading,params,...config}={}){
		return this.fetch({
			...config,
			method:'GET',
			url:url,
			hasLoading,
			params
		})
	}

	post(url,data={},{hasLoading,params,...config}={}){
		return this.fetch({
			...config,
			method:'POST',
			url:url,
			data:data,
			hasLoading,
			params
		})
	}
	/*
	@param {object} 请求可选参数
	@description 修改默认参数	
	*/
	setConfig(option){
		Object.assign(this.option,option);
	}
	/*@description 根据ContentType系列化参数*/
	handleBody(option){
		let {method,headers={},data={}}=option;
		if(method.toUpperCase()=='POST'){
			option.configs=Object.assign({},option.configs) ||{};
			if(headers['Content-Type']==undefined){
				option.configs.headers=Object.assign({'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',Accept:'application/json, text/plain, */*'},headers);
			}
			
			option.configs.body=option.configs.headers['Content-Type'].indexOf('x-www-form-urlencoded')>-1&&(typeof data=='object')?serialize(data):data;
		}
	}
	/*@description json返系列化*/
	parseJSON(response){
		return response.json();
	}
	
	checkStatus(response){	
		if(reqCount>0)	
			reqCount--;
		if(reqCount==0){
			this.hideLoading();//请求数为零，隐藏loading
		}
		if (response.status >= 200 && response.status < 300) {//处理http请求code
		    return Promise.resolve(response)
	  	} else {
		    var error = new Error(response.statusText)
		    error.response = response
		    return Promise.reject(response)
	  	}
	}

	catchParseJSON(error){
		console.log(error);
	}
	/*@description 对后端返回的请求状态做处理，此方法需要子类重写*/
	checkCode(response){
		return Promise.resolve(response);
	}
	/*@description 添加url参数,此方法需子类重写*/
	addParams(option){

	}
	/*@description 添加body参数,此方法需子类重写*/
	addData(option){

	}
	/*@description 对url进行处理,此方法需子类重写*/
	handleUrl(url){
		return url;
	}

	/*@description 隐藏loading,此方法需子类重写*/
	hideLoading(){

	}
	/*@description 显示loadding,此方法需子类重写*/
	showLoading(){

	}
	/*@description 清除请求计数，隐藏loadding*/
	clearReqCount(){
		reqCount=0;
		this.hideLoading();
	}
}


function serialize(data){
	var strs=[];
	Object.keys(data).forEach((key)=>{
		paramsCollection(data[key],key,strs);
	})
	return strs.join('&');
}

function paramsCollection(data,prefix,strs){
	if (typeof data==='object' && data!=undefined) {
		Object.keys(data).forEach((key)=>{
			var pref = prefix + '[' + key + ']';
			paramsCollection(data[key], pref, strs);
		})

	} else if(data!==undefined) {
		strs.push(encodeURIComponent(prefix) + '=' + encodeURIComponent(data));
	}
}

function paramSerializer(params={}) {
	var parts = [];

	Object.keys(params).forEach((key)=>{
		if(typeof params[key]!=='object'&& params[key]!==undefined)
			parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
	})

	return parts.join('&');
};

function deleteUndefined(obj){
	for(let key in obj){
		if(obj[key]===undefined)
			delete obj[key];
	}
	return obj;
}

function buildUrl(url, serializedParams) {
	if (serializedParams.length > 0) {
		url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams;
	}
	return url;
}