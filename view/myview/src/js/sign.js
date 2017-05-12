import  'es5';
import 'layerPc301';
class sign{
	constructor(){
		this.selectTab();
		this.layer();
	}
	layer(){
		if($('#main').find('.wrong')&&$('#main').find('.wrong').data('err')){
			layer.msg($('#main').find('.wrong').data('err'),{ison:6});
		}
		if($('#prompt')&&$('#prompt').data('info')){
			layer.msg($('#prompt').data('info'));
		}
	}
	selectTab(){
		let hash=window.location.hash,
			tab=$('#tab');
		tab.on('click','a',function () {
			$(this).addClass('active').siblings().removeClass('active');
			if($(this).hasClass('signup')){
				$('#registerbox').show().next().hide();
			}else{
				$('#registerbox').hide().next().show();
			}
		})
		if(hash==='#signup'){
			$('.signup',tab).click();
		}else{
			$('.signin',tab).click();
		}
	}
	// checklogin(){
	// 	let reg=/^[0-9]{11}$/;
	// 	if(reg.test($('input[name=phone]').val()))
		
	// }
	checkregister(){

	}
}
new sign();