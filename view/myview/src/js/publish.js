import  'es5';
import './mod/mod-public-method';

class publish{
	constructor(){
		selectdownList();
		this.imgUpload();
		this.layer();
	}
	imgUpload(){
		let _this=this;
		$("#fileField").change(function(){
			let objArr=[];
			for(let i=0,il=this.files.length;i<il;i++){
				objArr.push(_this.getObjectURL(this.files[i]));
				console.log(this.files[i]);
			} 
			if (objArr.length) {
				let insert=[];
				for(let i=0,il=objArr.length;i<il;i++){
					insert.push(`<div class="img${i}"><span>×</span><img src=${objArr[i]}></div>`)
				}
				$("#imgGroup").show().append(insert);
			}
		}) ;
	}
	layer(){
		if($('#wrong')&&$('#wrong').data('err')){
			layer.msg($('#wrong').data('err'));
		}
		if($('#prompt')&&$('#prompt').data('info')){
			layer.msg($('#prompt').data('info'));
		}
	}
	getObjectURL(file){
		var url = null ; 
		if (window.createObjectURL!=undefined) { // basic
			url = window.createObjectURL(file) ;
		} else if (window.URL!=undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file) ;
		} else if (window.webkitURL!=undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file) ;
		}
		return url ;
	}
}

new publish();