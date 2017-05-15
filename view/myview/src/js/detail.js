import './mod/mod-public-method';
class detail{
	constructor(){
		this.switchImg();
	}
	switchImg(){
		$('#imgWrap').on('click','.imgGroup>img',function () {
			$('#imgWrap .bigImg>img').get(0).src=this.src;
			$(this).addClass('active').siblings().removeClass('active');

		})
	}
	
}
new detail();