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
			layer.confirm('你确定要删除该条信息吗？', {
						  btn: ['确定','取消'] //按钮
					}, function(){
						$.ajax({
				            type:"DELETE",
				            url:"/person/publish?id=" + _id
				        })
				        .done(function (results) {
								layer.msg('删除成功', {time: 800});
								deleteItem.remove();
				        })
					});
		});
	}
}
new person();