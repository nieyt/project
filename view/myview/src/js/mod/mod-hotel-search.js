import {searchCondition} from './mod-public-template';

export default class search{
	constructor(...param){
        $.extend(this,...param);
        this.loading=new AjaxLoading();//实例化加载
        this.UrlConfig=this.props.config.API;
        this.queryData();
    }

    queryData(){
	    let _this=this;
        _this.props.filterBox.empty();
        _this.loading.open({"maskClass": "hide","target":this.props.filterBox});
        _this.ajax({
            url: _this.UrlConfig.baseUrl+_this.UrlConfig.travel.Keyword,
            type: 'post',
            data:{
                Keyword:""
            },
            complete(){
                _this.loading.remove();
            }
        },data => {
            _this.props.filterBox.html(searchCondition(data));
            $('.filterItem',_this.filterBox).map(function (i,data) {
                _this.handleSelect($(data));
            })
        });
    }
    handleSelect(element){
        let that=this.props,
            _this=this,
            key=element.attr('key'),
            valueArr=[],
            textArr=[];
        if(key==='Brand'){
            element.find('.tabGroup').on('click', 'li:not(.not)', function() {
                let $this=$(this),
                    group=$this.parent().next().find('.itemsWrap ul').eq($this.index()-1);
                $this.addClass('checked').siblings().removeClass('checked');
                group.addClass('show').end().next().off('click');
                group.parent().siblings().find('ul').removeClass('show');
                element.find('.moreBrand').hide();
                if(group.find('li').length>18){
                    group.next().show();
                    group.next().click(function() {
                        $(this).text()==='更多'?$(this).text('收起'):$(this).text('更多');
                        group.toggleClass('auto');
                    });
                    if(!$this.hasClass('checked')){
                        group.next().hide();
                    }
                }
            });
        }
        if(key==='Price'){
            let min = element.find('input[name=min]'),
                max = element.find('input[name=max]');
            element.on('click','.confirm',function(){
                if(min.val()=='' && max.val()==''){
                    return ;
                }
                valueArr.length = 0;
                // textArr.length = 0;
                if((min.val()!='' && !/^[0-9]*$/gi.test(min.val()))||(max.val()!='' && !/^[0-9]*$/gi.test(max.val()))){
                    layer.open({
                        content:"请输入正确的价格区间数值."
                    });
                    min.val('');
                    max.val('');
                    return;
                }
                if(min.val()=='' && max.val()!=''){
                    valueArr.push('z0-'+max.val());
                    // textArr.push('￥0-'+max.val());
                }else if(min.val()!='' && max.val()==''){
                    valueArr.push('z'+min.val()+'-');
                    // textArr.push('￥'+min.val()+'以上');
                }else if(min.val()!='' && max.val()!=''){
                    if(min.val() >= max.val()){
                        max.val('');
                    }
                    valueArr.push('z'+min.val()+'-'+max.val());
                    // textArr.push('￥'+min.val()+(min.val() < max.val()?('-'+ max.val()):'以上'));
                }
                _this.setParam(key,valueArr);
                that.param.PageNum=1;
                that.searchList(that.type,that.param);
                element.find('li').not('.customPrice').removeClass('checked')
            }).on('click','.cancel',function(){
                element.find('.checkboxGroup li.not').addClass('checked').end().find('.checkbox').removeClass('checked');
                min.val('');
                max.val('');
                valueArr.length = 0;
                _this.setParam(key,valueArr);
                that.param.PageNum=1;
                that.searchList(that.type,that.param);
                // textArr.length = 0;
            });
        }
        element.find('.checkbox').on('click', function() {
            $(this).toggleClass('checked');
            if($(this).hasClass('checked')){
                valueArr.push($(this).data('value'));
                textArr.push($(this).text());
            }else{
                _this.removeArrElem(valueArr,$(this).data('value'));
                _this.removeArrElem(textArr,$(this).text());
            }
            if(key==='Brand'){
                if(valueArr.length){
                    element.find('.not').removeClass('checked')
                }
                let a=$(this).parent().parent().index();
                element.find('.tabGroup').find('li:not(.not)').eq(a).addClass('checked');
            }else{
                if(valueArr.length){
                    element.find('.not').removeClass('checked')
                }else{
                    element.find('.not').addClass('checked')
                }
            }
            // _this.selectedDom(valueArr,textArr,key);
            _this.setParam(key,valueArr);
            that.param.PageNum=1;
            that.searchList(that.type,that.param);

        }).end().find('.not').click(function () {
            $(this).addClass('checked').siblings().removeClass('checked');
            valueArr=[];
            _this.setParam(key,valueArr);
            that.param.PageNum=1;
            that.searchList(that.type,that.param);
            // textArr=[];
            if(key==='Brand'){
                element.find('.checkbox').removeClass('checked');
            }
        });
    }
    /**
     * 选中数据渲染
     */
/*    selectedDom(valueList,textList,key){
        let label = [],
            query=this.querySelected;
        query[key]=this.setQuery(valueList,textList);
        for(var k in query){
            for(var item in query[k]){
                label.push(`<label>${query[k][item]}<em data-key="${k}" data-value="${item}">×</em></label>`);
            }
        }
        if(label.length) {
            label.push('<span class="clearAll">清除全部</span>');
        }
        this.props.filterSelected.html(label);
        this.selectedHandle(valueList,textList);
        this.setParam(key,valueList);
    }*/

    setParam(key,value){
        let that=this;
        that.props.param[key]=value.join(',');
    }

    setQuery(value, text,query={}){
       for(let i=0,l=value.length;i<l;i++) query[value[i]]=text[i];
       return query;
    }

    removeArrElem(arr,elem){
        let index=arr.indexOf(elem);
        arr.splice(index,1);
    }
    /**
     * 绑定选中事件操作
     */
/*    selectedHandle(valueList,textList){
        let that = this;
        that.props.filterSelected.off().on('click','label>em',function(){
            let key = $(this).attr('data-key'),
                value = $(this).attr('data-value');
            that.removeArrElem(valueList,$(this).data('value'));
            that.removeArrElem(textList,$(this).text());
            that.selectedDom(valueList,textList,key);
            console.log(textList);
        })
        .on('click','.clearAll',function(){
            that.props.setQuery('Price',false,[],[]);
            that.props.setQuery('Star',false,[],[]);
            that.props.setQuery('Brand',true,[],[]);
            that.setChecked('clearAll');
        });
    }*/

}