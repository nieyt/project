import  'es5';

class sign{
	constructor(){
		this.selectTab();
	}
	selectTab(){
		let hash=window.location.hash;

		$('#tab').on('click','a',function () {
			$(this).addClass('active').siblings().removeClass('active');
			if(this.id==='register'){
				$('#registerbox').show().next().hide();
			}else{
				$('#registerbox').hide().next().show();
			}
		})

		if(hash==='#signup'){
			$('#register').click();
		}else{
			$('#login').click();
		}
	}
}
new sign();