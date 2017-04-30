class Time{
	constructor(date){
		this.startTime = date.startTime;
		this.endTime  =  date.endTime;
		this.hourdata = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
		this.mindata = [0,10,20,30,40,50];
		this.utc = ["周日","周一","周二","周三","周四","周五","周六"]
		this._init();
	}


	_init(){
		let i=0;
		let startTime=new Date(this.startTime);
		this.dayItems=[];

		while(+startTime+1000*60<=+this.endTime){
			this.dayItems.push(new Date(startTime));
			startTime = new Date(startTime.setDate(startTime.getDate()+1));
			i++;
		}
	}


	//removeDate方法输出格式为: 
	// [
	//    Object{
	// 		date:5
	// 		hours:Array[24]
	// 		month:1
	// 		utc:"周四"
	// 		year:2017
	//	  }
	//	...
	// ]
	removeDate(date){
		this._toArr();
		let self = this;
		if(date =="now"){
			this.dateArr[0].hours = [];
			let nowHour = this.dayItems[0].getHours();
			let nowMin = this.dayItems[0].getMinutes();
			if(nowMin >50){
				nowHour +=1;
				nowMin= 0
			};
			if(nowHour == 24){
				this.dateArr.splice(0,1);
				nowHour =0;
				nowMin = 0;
			}
			this.hourdata.forEach(function(hour,i){
				if(nowHour <=i){
					let mins = [];
					if(i == nowHour){
						self.mindata.forEach(function(min){
							if(hour,nowMin <= min){
								mins.push(min);
							};
						})
					}else{
						self.mindata.forEach(function(min){
							mins.push(min);
						})
					}
					
					self.dateArr[0].hours.push({hour:hour,min:mins})
				};
			})
		}
	}
	_toArr(){
		let dateArr = [];
		let self = this;
		this.dayItems.forEach(function(item){
			let date = {
				year:item.getFullYear(),
				month:item.getMonth()+1,
				date:item.getDate(),
				utc:self.utc[item.getDay()],
				hours:[
				]
				
			}
			self.hourdata.forEach((hour)=>{
				let mins = [];
				self.mindata.forEach((min)=>{
					mins.push(min)
				})
				date.hours.push({hour:hour,min:mins});
				
			})
			dateArr.push(date);
		})
		this.dateArr = dateArr;	
	}
	getArr(){
		return this.dateArr;
	}

	//获取年月日格式
	//[
	// 	Object{
	// 		year:2017
	// 		months:Array[3] = > [ 
							// 	{month:10,day:[1,2,3,...]},
							// 	{month:11,day:[1,2,3,...]},
							// 	{month:12,day:[1,2,3,...]}
					  // ]
	// 	}
	//  Object{
	// 		year:2018
	// 		months:Array[3] = > [ 
							// 	{month:1,day:[1,2,3,...]},
							// 	{month:2,day:[1,2,3,...]},
							// 	{month:3,day:[1,2,3,...]}
					  // ]
	// 	}
	// ]
	getYMD(){		
		var ymd = [];		
		var oneYear = {};
			oneYear.month = [];
		var oneMonth ={};
			oneMonth.days = [];
		this.dayItems.forEach(day=>{
			
			let	year = day.getFullYear();
			let	month =day.getMonth()+1;
			let	date = day.getDate();
			
			oneYear.year = year;	
			if(date == 1){
				//新的一月
				oneYear.year = year;				
				if(oneMonth.days.length != 0){	
					
					oneYear.month.push(oneMonth);
					oneMonth = {};
					oneMonth.days =[];
					if(month == 1){
						//新的一年
						oneYear.year = year-1;
						ymd.push(oneYear);
						oneYear = {};
						oneYear.year = year;
						oneYear.month = [];
					}
				};
							
			}
			oneMonth.month = month;
			oneMonth.days.push(date);
		})
		if(oneMonth.days.length > 0){
			oneYear.month.push(oneMonth);
		}
		if(oneYear.month.length > 0){
			ymd.push(oneYear);
		}
		return ymd;
	}

}


module.exports = Time;