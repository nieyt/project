/***
 * author:孙爱祥 邵剑（000144）
 * update：创建于2016年3月28日 最后一次更新于3月28日
 * js说明：旅游度假酒店产品详情左右滚动
 * ****/
//轮播方法
export var carosuel = function(option){
	//注册一个定时器
	var timer,
		$child = $(option.child),
		$father= $(option.father);
	var $prev = $(option.prev);
	var $next = $(option.next);
	var $warp = $(option.wrap);
	//设置初始图片的位置
	var index = 0;
	//图片长度
	var maxlegnth =  option.img.length;
	//移动方法
	var move = function(){
		nextScroll();
	};
	/*逻辑需求:
	 **1.通过修改
	 * */
	//滚动下一张图片
	var nextScroll=function(){
		if($father.is(":animated")||option.img.length<=1){
			return;
		}
		var cuxIndex = $("li.select",$child).index();
		if(cuxIndex<maxlegnth-1){
			$('ul',$child).find('li').eq(cuxIndex+1).addClass('select').siblings().removeClass('select');
			$father.animate({
				left: '-1000px'
			},500,function(){
				$("li[index="+(cuxIndex+1)+"]",$father).prevAll().appendTo($('ul',$father));
				$father.css('left',0);
			});
		}else{
			$('ul',$child).find('li').eq(0).addClass('select').siblings().removeClass('select');
			$father.animate({
				left: '-1000px'
			},500,function(){
				$("li[index="+cuxIndex+"]",$father).appendTo($('ul',$father));
				$father.css('left',0);
			});
		}
	};
	//滚动上一张图片
	var prevScroll=function(){
		if($father.is(":animated")||option.img.length<=1){
			return;
		}
		var cuxIndex = $("li.select",$child).index();
		if(cuxIndex>0){
			$('ul',$child).find('li').eq(cuxIndex-1).addClass('select').siblings().removeClass('select');
			$("li:last",$father).prependTo($('ul',$father));
			$father.css('left','-1000px');
			$father.animate({
				left: '0'
			},500);
		}else{
			$('ul',$child).find('li:last').addClass('select').siblings().removeClass('select');
			$("li:last",$father).prependTo($('ul',$father));
			$father.css('left','-1000px');
			$father.animate({
				left: '0'
			},500);
		}
	};
	var init = function(){
		//渲染dom
		var childHtml = [];
		var fatherHtml = [];
		$.each(option.img,function(i,value){
			childHtml.push('<li index="'+i+'"><img  src="'+value+'"width="'+option.width+'" height="'+option.height+'"></li>')
		});
		$.each(option.img,function(i,value){
			fatherHtml.push('<li class="left" index="'+i+'"><img  src="'+value+'"></li>')
		});
		$ ('ul',$child).html(childHtml.join(''));
		$ ('ul',$father).html(fatherHtml.join(''));
		$ ('ul',$child).find('li').eq(0).addClass('select');
		//添加移动方法, []
		//进入页面，延迟3秒，执行
		if(option.img.length>1){
			timer = setInterval(move,3000);
		}
		// 点击小图，图片轮播到制定的图片，
		//需求 ，点击index，index在首位
		$ ('ul',$child).find('li').on('click',function(){
			$(this).addClass('select').siblings().removeClass('select');
			if($father.is(":animated")){
				$father.stop();
			}
			var idx =parseInt($(this).attr('index'));
			var domArr = $("ul",$father).find('li');
			var curIndex = $("li[index="+idx+"]",$father);
			var _idx=curIndex.index();
			for(var i = 0; i< _idx;i++){
				var that = domArr.eq(i);
				that.remove();
				$('ul',$father).append(that)
			}
		});
		$warp.hover(
			function(){clearInterval(timer);},
			function(){timer=setInterval(move,3000);}
		)
		$prev.on('click',function(){
			prevScroll();
		})
		$next.on('click',function(){
			nextScroll();
		})
	};
	return init()
};

