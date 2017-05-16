import  'es5';
import 'layerPc301';
class person{
	constructor(){
		this.selectTab();
		this.delete();
	}
	selectTab(){
		$('#contentMe .nav').on('click', 'li', function(event) {
			event.preventDefault();
			$(this).addClass('active').siblings().removeClass('active');
			$('#contentMe .content >div').eq($(this).index()).addClass('active').siblings().removeClass('active');
		});
	}
	delete(){
		$('#contentMe .publishList').on('click', '.delete', function(event) {
            let deleteItem=$(this).parents('.item');
			let _id=$(this).data('id');
			event.preventDefault();
			$.ajax({
	            type:"DELETE",
	            url:"/person/publish?id=" + _id
	        })
	        .done(function (results) {
	            if(results.success == 1){
	            	// layer.open()
	                deleteItem.remove();
	            }
	        })
		});
	}
}
new person();