/***
 * author: 邵剑（000145）
 * update：创建于2016年3月18日
 * js说明：旅游度假酒店产品详情行程安排电梯
 * ****/
//滚动效果
export var watchScroll = function(){
	var option = {
		target: '.togglelist'
	};
	//days
	var $days = $('.days');
	var $day = $days.find('li');
	var dayHeight = $days.offset().top;
	var $tabs = $(option.target);
	var $tabH = $tabs.outerHeight();
	var $dayH = $days.outerHeight();
	var $pd = $('#tabs');
	//获取$tabs的高度，根据需求，超过这个高度应固定在屏幕顶部
	var tabsHeight;
	//该数组用来存储路线的高度
	//入口方法
	var init = function(){
		tabsHeight = $tabs.offset().top;
		var tcClick = function(t, arr, index){
			var	$body = (window.opera) ? (document.compatMode == 'CSS1Compat' ? $('html') : $('body')) : $('html, body');
			//$(document).scrollTop(channelHeight[index]);
			$body.animate({
				scrollTop: arr[index] - $tabH - 50
			});
			t.addClass('actives').siblings().removeClass('actives');
		}
		$day.on('click', function(){
			var _this = $(this);
			var $index = _this.index();
			var daysHeightArray = $pd.data('daysHeightArray') ? $pd.data('daysHeightArray') : [];
			tcClick.call(tcClick, _this, daysHeightArray, $index);
		});
		//核心，监控scroll高度
		$(window).on('scroll',function(){
			var top = $(document).scrollTop();
			var daysHeightArray = $pd.data('daysHeightArray');
			var secondBarH = 0;
			if($pd.data('heightArray')){
				if($pd.data('heightArray')[2]){
					secondBarH = $pd.data('heightArray')[2];
				}
				else{
					secondBarH =$pd.data('heightArray')[0]+$("#Play").height();
				}
			}
			dayHeight = $pd.data('daysHeightArray') ? $pd.data('daysHeightArray')[0] : $days.offset().top;
			if( top >= dayHeight-100 && top < secondBarH - $dayH - 100){
				//TODO:添加样式，提高性能
				$days.addClass('fixed');
			}else{
				//TODO:添加样式，提高性能
				$days.removeClass('fixed');
			}
			$.each(daysHeightArray,function(i,val){
				if( i<daysHeightArray.length-1 && top>= val - $tabH - 100 && top<=daysHeightArray[i+1]){
					$('#newday'+(i+1)).find('div').addClass('actived').parent().siblings().find('div').removeClass('actived');
					$day.eq(i).addClass('actives').siblings().removeClass('actives');
				}else if( i == daysHeightArray.length - 1 && top >= daysHeightArray[i] - $tabH - 100){
					$('#newday'+(i+1)).find('div').addClass('actived').parent().siblings().find('div').removeClass('actived');
					$day.eq(i).addClass('actives').siblings().removeClass('actives');
				}
			});
		});
		//TODO:?
	};
	return init()
};
export var tabScroll = function(){
	var option = {
		target: '.togglelist'
	};
	//days
	var $days = $('.days');
	var $tabs = $(option.target);
	var $tabH = $tabs.outerHeight();
	var $tab = $(option.target).find('li');
	var $pd = $('#tabs');
	//获取$tabs的高度，根据需求，超过这个高度应固定在屏幕顶部
	var tabsHeight;
	//该数组用来存储路线的高度
	var init = function(){
		tabsHeight = $tabs.offset().top;
		$tab.eq(0).addClass('actives');
		var tcClick = function(t, arr, index){
			var	$body = (window.opera) ? (document.compatMode == 'CSS1Compat' ? $('html') : $('body')) : $('html, body');
			//$(document).scrollTop(channelHeight[index]);
			$body.animate({
				scrollTop: arr[index] - $tabH - 50
			});
			t.addClass('actives').siblings().removeClass('actives');
		}
		$tab.on('click',function(){
			var _this = $(this);
			var $index = _this.index();
			var newHeightarr = $pd.data('heightArray') ? $pd.data('heightArray') : [];
			tcClick.call(tcClick,_this, newHeightarr, $index);
		});
		$(window).on('scroll',function(){
			var top = $(document).scrollTop();
			//超过 tabsHeight，$tabs固定在屏幕顶部
			if( top > tabsHeight){
				$tabs.addClass('fixedTop');
			}else{
				$tabs.removeClass('fixedTop');
			}
			//随着高度的变化，对tab切换高亮
			var newHeightarr = $pd.data('heightArray');
			$.each(newHeightarr,function(i,val){
				if(top>newHeightarr[i] - $tabH - 150 && top<newHeightarr[i+1]){
					$tab.eq(i).addClass('actives').siblings().removeClass('actives');
				}else if( (i == newHeightarr.length - 1) && top > newHeightarr[i] - $tabH - 150){
					$tab.eq(i).addClass('actives').siblings().removeClass('actives');
				}
			});
		});
	}
	return init();
}