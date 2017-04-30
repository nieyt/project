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
	*/
	setItem(key,data){
		return this.storage.setItem(key,data);
	}

	/*获取缓存
	@key string 缓存标识
	@retrun srting 缓存数据
	*/
	getItem(key,getOne){
		var data =this.storage.getItem(key);
		if(getOne===true)
			this.removeItem(key);
		return data;
	}

}
export const sessionStorage=new StorageBase(window.sessionStorage);
export const localStorage=new StorageBase(window.localStorage);