class list{
	constructor(){
		let _this=this;
		this.param={
			brand:"",
			area:"",
			price:""
		};
		Array.prototype.map.call($('.filterItem'),this.searchList,_this);
	}
	searchList(element){
		let _this=this,
			valueArr=[],
			elem=$(element),
			key=elem.attr('key');
		elem.on('click','li:not(.not)',function () {
			$(this).toggleClass('checked');
			if($(this).hasClass('checked')){
                valueArr.push($(this).data('value'));
            }else{
                _this.removeArrElem(valueArr,$(this).data('value'));
            }
            if(valueArr.length){
	            _this.param[key]=valueArr.join(',');
				$(this).siblings('.not').removeClass('checked');
            }else{
            	_this.param[key]="";
				$(this).siblings('.not').addClass('checked');
            }
            _this.sendreq(_this.param);
		})
		elem.find('.not').click(function() {
			$(this).addClass('checked').siblings().removeClass('checked');
            valueArr=[];
            _this.param[key]="";
            _this.sendreq(_this.param);
		});
	}
    removeArrElem(arr,elem){
        let index=arr.indexOf(elem);
        arr.splice(index,1);
    }
    ajax(option,successCall){
        let _this=this;
        $.ajax(
            $.extend({
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                error(err){
                    console.log(err);
                },
                success(data){
                    successCall(data);
                }
            },option)
        );
    }
    sendreq(data){
    	let _this=this;
    	_this.ajax({
    		url:'/shouji',
    		data:data
    	},data=>{
    		console.log(data);
    	})
    }
}
new list();