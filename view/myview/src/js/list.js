import {listItem} from './mod/mod-public-template';
import './mod/mod-public-method';
import basePC from 'basePC';
class list extends basePC{
	constructor(){
		super();
		this.noData=new noDataShow();//实例化无数据显示
		this.loading=new AjaxLoading();//实例化加载
		this.param={
			brand:"",
			area:"",
			price:""
		};
		this.url='/listshouji';
		this.getParam =this.parseUrl();
		this.init();
	}
	init(){
    	let	_this=this,
    		href=window.location.href;
		Array.prototype.map.call($('.filterItem'),this.searchList,_this);
		if(href.match(/shouji/ig)){
			_this.url='/listshouji';
		}else if(href.match(/pingban/ig)){
			_this.url='/listpingban';
		}else if(href.match(/bijiben/ig)){
			_this.url='/listbijiben';
		}else{
			_this.url='/listall';
		}
		if(_this.getParam&&_this.getParam.keyword){
			_this.sendreq({keyword:_this.getParam.keyword});
		}
		if(_this.getParam&&_this.getParam.brand){
			let brand=_this.getParam.brand;
			$('#filterBox').find('[data-value='+brand+']').click();
		}
	}
	searchList(element){
		let _this=this,
			valueArr=[],
			elem=$(element),
			key=elem.attr('key');
		elem.on('click','li:not(.not,.customPrice)',function () {
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
		if(elem.attr('key')=='price'){
			let min = elem.find('input[name=min]'),
                max = elem.find('input[name=max]');
            elem.on('click','.confirm',function(){

                if(min.val()=='' && max.val()==''){
                    return ;
                }
                valueArr.length = 0;
                if((min.val()!='' && !/^[0-9]*$/gi.test(min.val()))||(max.val()!='' && !/^[0-9]*$/gi.test(max.val()))){
                    layer.open({
                        content:"请输入正确的价格区间数值."
                    });
                    min.val('');
                    max.val('');
                    return;
                }
                if(min.val()=='' && max.val()!=''){
                    valueArr.push('0-'+max.val());
                }else if(min.val()!='' && max.val()==''){
                    valueArr.push(min.val()+'-100000');
                }else if(min.val()!='' && max.val()!=''){
                    if(min.val() >= max.val()){
                        max.val('100000');
                    }
		        }
		        elem.find('li').not('.customPrice').removeClass('checked')
		        valueArr.push(min.val()+'-'+max.val());
                _this.param[key]=valueArr.join(',');
                _this.sendreq(_this.param);
		    });
            elem.find('li.customPrice').on('click','.cancel',function(){
	                elem.find('li.not').addClass('checked').end().find('.checkbox').removeClass('checked');
	                min.val('');
	                max.val('');
	                valueArr.length = 0;
	                _this.param[key]="";
	                _this.sendreq(_this.param);
            });
        }
	}
		
    removeArrElem(arr,elem){
        let index=arr.indexOf(elem);
        arr.splice(index,1);
    }
    ajax(option,successCall){
        let _this=this,index;
        $.ajax(
            $.extend({
                type: 'POST',
                dataType: 'json',
                beforeSend(){
                    index = layer.load(2, {shade: false});
                },
                complete(){
                    layer.close(index);
                },
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
    		url:_this.url,
    		data:data
    	},data=>{
    		if(!data.info||data.info.length==0){
              _this.noData.commonShow({
                    noDataTip:'暂无符合条件的商品信息,请重新搜索',
                    btnShow: false
                }, $('#prodList'));
              return;
    		}
    		for(let i in data.info){
    			data.info[i].create_at=_this.formatDate(new Date(data.info[i].create_at),'yyyy-MM-dd').format;
    		}
    		$('#prodList').empty().html(listItem(data));
    	})
    }
}
new list();