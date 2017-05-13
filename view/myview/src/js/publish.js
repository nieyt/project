import  'es5';
import './mod/mod-public-method';
import 'layerPc301';

class publish{
	constructor(){
		this.deleteIndex=[];
		selectdownList();
		this.imgUpload();
		this.layer();
		this.deleteImg();
		this.init();
	}
	init(){
		let _this=this;
		// $('#submitPic').click(_this.sendImg);
		$("#fileField").change(_this.sendImg)
	}
	imgUpload(){
		let _this=this;
		$("#fileField").change(function(){
			let objArr=[];
			for(let i=0,il=this.files.length;i<il;i++){
				objArr.push(_this.getObjectURL(this.files[i]));
			} 
			if (objArr.length) {
				let insert=[];
				for(let i=0,il=objArr.length;i<il;i++){
					insert.push(`<div class="img${i}"><span>×</span><img src=${objArr[i]}></div>`)
				}
				$("#imgGroup").show().append(insert);
			}
		});
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
	deleteImg(){
		let _this=this;
		$('#imgGroup').on('click','span',function () {
			let index=$(this).index();
			$(this).parent().remove();
			_this.deleteIndex.push(index);
			// Array.prototype.splice.call($('#fileField')[0].files,index,1);
			// Array.from($('#fileField')[0].files).splice(index,1);
			// console.log($('#fileField')[0].files);
		})

	}
	sendImg(){
		var fd = new FormData();
		for(let i=0;i<$('#fileField')[0].files.length;i++){
		    fd.append("file",$('#fileField')[0].files[i]);
		}
	    $.ajax({
	        type:'POST',
	        processData: false,  // 告诉JSLite不要去处理发送的数据
	        contentType: false,   // 告诉JSLite不要去设置Content-Type请求头
	        data:fd,
	        url:'/uploadimg',
	        success:function(data){
	           console.log('success:',data)
	        },
	        error:function(d){
	           console.log('error:',d)
	        }
	    })
	}
}

new publish();