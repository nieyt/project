/**
*	Creat Date:  2015-12-21
*	Code author: Alan
*	Email: 1480801@qq.com
*	Plugin Name: Alan slides
**/

(function($,w) {
	function Slider(param){
		this.wrapper = $(".slider-wrapper",this);
		this.controls = $("<ul>",{"class":"slider-controls"}).html('<li class="v-prev">prev</li><li class="v-next">next</li><li class="i-index"></li>');
		this.box = $(".slider-box",this.wrapper);
		this.default = {
			speed: 3000,
			index: 0,
			controls:true
		};
		this.options = $.extend(this.default,param);
		var _this = this,
			index = this.options.index,
			jsonData = $('li', this.box),
			timer = null,
			outerWidth = 0,
			$box = this.box,
			$nav = null;

		function controls(){
			var $controls = this.controls,
				$i_Arr = [];
			for(var i=0,len = jsonData.length;i<len;i++){
				var $i = $("<i>").html("<a href='#'>"+(i+1)+"</a>");
				!i && $i.addClass("on");
				(function(i){
					i.on("click",function(){
						index = $(this).index();
						go();
						return false;
					});
				})($i);
				$i_Arr.push($i);
			}
			$nav = $controls.find('.i-index').html($i_Arr);
			$controls.on("click",".v-prev",function(){prev();}).on("click",".v-next",function(){next();});
			$(this).append($controls);

		}
		function next(){
			index = index + 1 >= jsonData.length ?  index = 0 : index += 1;
			go();
		}

		function prev(){
			index = index - 1 < 0 ?  index = (jsonData.length - 1) : index -= 1;
			go();
		}
		function go(){
			$box.animate({"left":0 - outerWidth * index});
			$nav && $nav.find(">i").eq(index).addClass("on").siblings().removeAttr("class");

			if(!!_this.options.speed) {
				clearInterval(timer);
				bindTimer();
			}
		}
		function bindTimer(){
			timer = setInterval(function(){
				next();
			},_this.options.speed);
		}
		function init(){
			$(w).resize(function(){
				outerWidth = $(this).width();
				$box.width($(this).width() * jsonData.length).find("li").width($(this).width());
			}).resize();
			// $(this).html(this.wrapper.html($box));
			this.options.controls && controls.call(this);
			if(!!this.options.speed){
				bindTimer();
			}
		}
		init.call(this);
	}

	$.fn.Slider = function (param){
		this.slider = Slider.call(this, param);
		return this.slider;
	};
})(jQuery,window);