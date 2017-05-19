import  'es5';
import 'layerPc301';
import basePC from'basePC';
import {chat} from './mod/mod-public-template';
import './mod/mod-public-method';

class person extends basePC{
	constructor(){
		super();
		this.selectTab();
		this.delete();
		this.openPop();
		this.openTime=0;
		this.noData=new noDataShow();//实例化无数据显示
		this.cancelapp();
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
	cancelapp(){//detail
		$('#contentMe .approList').on('click', '.cancel', function(event) {
            let deleteItem=$(this).parents('.item');
			let info_id=$(this).data('id');
			let $this=$(this);
			layer.confirm('你确定要取消收藏吗？', {
						  btn: ['确定','取消'] //按钮
					}, function(){
						$.ajax({
							url: '/approval',
							type: 'POST',
							dataType: 'json',
							data: {
								info_id:info_id,
								user_id:$('#username').data('id'),
								add:false
							}
						})
						.done(function(data) {
							layer.msg(data.msg,{
								time:500
							});
							$this.parents('.item').remove();
						})
						.fail(function() {
							console.log("error");
						})
					});
		});
	}
	socket($this){
		let _this=this;
		if(this.openTime==0){
			window.socket = io.connect('http://localhost:8080');
			socket.on('connect', function(){
			  socket.on('chat', function(data){
			  	let time=new Date(data.create_at),
			  		mytime=_this.formatDate(time,'MM-dd HH:mm:ss').format;
			    $('#chatBody').append(
			    "<div class='chatLine'>"
			        +"<span class='grey-text'>" + data.author_name + "：</span>"
			        +"<span class='chat-content'>" + data.content + "</span>"
			        +"<span class='grey-text right'>" +mytime+ "</span>"
			    +"</div>"
			    );
			    $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight);
			  });
			});
			socket.on('error', function(err){
			  socket.removeAllListeners('connect');
			  io.sockets = {};
			})
			this.openTime=1;
		}
		if($this.parent().get(0).id==='msgList'){
			socket.emit('openPop',$('#msgList').data('send'));
			$('#chatBody').append($('#msgList>.chatLine'));
			$('#msgList>.chatLine').remove();
			$('#msgNum').text('0');
			$('#msgList').append('<div class="nodatame">暂无未读信息</div>')
		}else{
			let msgs=$('#openList>.chatLine').clone(true);
			$('#chatBody').append(msgs);
		}
		this.textarea();
	}
	textarea(){
		var textarea = document.querySelector('textarea');
		let resize=()=>{
			textarea.style.height = '0';
			var height = textarea.scrollHeight;
			textarea.style.height = height+5+ 'px';
		}
		textarea.addEventListener('input', resize);
		document.onkeydown = function(e){
			let time = new Date();
			if((e.keyCode || e.which) == 13){
				e.returnValue = false;
				if(textarea.value == ''){
					return false;
				}else{
					e.preventDefault();
					var name = document.getElementById('username').innerHTML;
					var msg = textarea.value;
					socket.emit('chat', {
						author_name: name,
						content: msg,
						create_at:time,
						send_id:$('#msgList').data('send'),
						author_id:$('#msgList').data('id')
					});
					textarea.value = '';
					resize();
				}
			}
		}
	}
	openPop(){
		let _this=this;
		const imgsrc='./img/default.jpg';
		$('#msgList,#openList').on('click', '.chatLine', function(event) {
			let $this=$(this);
			const name=$(this).data('name'); 
			layer.open({
				  type: 1,
				  area: ['480px', '420px'],
				  anim: 2,
				  shadeClose: true, //开启遮罩关闭
				  title:`<img class='layerAvatar' src=${imgsrc}><span>${name}</span>`,
				  content: chat(),
				  success:()=>{
						_this.socket($this);
				  }
			});
		});
	}
}
new person();