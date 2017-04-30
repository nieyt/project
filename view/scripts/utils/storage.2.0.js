class StorageBase{
	constructor(storage){
		this.storage=storage;
	}
	/*获取缓存
	@key string 缓存标识
	@getOne boolean 是否读取后删除缓存
	@retrun Object 缓存数据
	getOne==true 读取后删除缓存
	*/
	getJson(key,getOne){
		var data =JSON.parse(this.storage.getItem(key));
		if(getOne===true)
			this.removeItem(key);
		return data;
	}
	/*设置已存在的缓存
	@key string 缓存标识
	@data object 缓存
	*/
	extendJson(key,data){
		var oldData =this.getJson(key);
		Object.assign(oldData,data);
		this.setJson(key,oldData);
	}
	/*设置缓存
	@key string 缓存标识
	@data object 缓存的对象
	*/
	setJson(key,data){
		return this.storage.setItem(key,JSON.stringify(data));
	}
	/*删除缓存
	@key string 缓存标识
	*/
	removeItem(key){
		return this.storage.removeItem(key);
	}

	/*设置缓存
	@key string 缓存标识
	@data string 缓存的字符串
	@expires number 过期时间的时间戳
	*/
	setItem(key,data,expires){
		let objData = {};
		objData = Object.assign({},{data});
		expires && Object.assign(objData,{expires})
		return this.storage.setItem(key,JSON.stringify(objData));
	}

	/*获取缓存
	@key string 缓存标识
	@retrun srting 缓存数据
	*/
	getItem(key){
		var value =this.storage.getItem(key);
		var time = Date.now();
		// 取值为undefined代码没有存储，直接返回结果，否则进行转换为Object
		if(value === undefined){
			return value;
		}else{
			value = JSON.parse(value);
		}
		// 存在设置过期时间的情况
		if(value.expires && value.expires <= time){			// 设置过期时间但未过期
			delete value.expires;	// 删除冗余标识
			return value.data;
		}else if(value.expires && value.expires > time){	// 设置过期时间已过期
			this.removeItem(key);
			return undefined;
		}
		return value.data;
	}

}
export const sessionStorage=new StorageBase(window.sessionStorage);
export const localStorage=new StorageBase(window.localStorage);