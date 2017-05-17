import './mod/mod-public-method';
import 'layerPc301';
import basePC from'basePC';
import {chat} from './mod/mod-public-template';

class detail extends basePC{
	constructor(){
		super();
		this.switchImg();
		this.layerPop();
		this.openTime=0;
	}
	switchImg(){
		$('#imgWrap').on('click','.imgGroup>img',function () {
			$('#imgWrap .bigImg>img').get(0).src=this.src;
			$(this).addClass('active').siblings().removeClass('active');
		})
	}
	socket(){
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
		this.textarea();
	}
	textarea(){
		var textarea = document.querySelector('textarea');
		let resize=()=>{
			textarea.style.height = '0';
			var height = textarea.scrollHeight;
			textarea.style.height = height + 'px';
		}
		textarea.addEventListener('input', resize);
		document.onkeydown = function(e){
			let time = new Date();
			if((e.keyCode || e.which) == 13){
				e.returnValue = false;
				if(textarea.value == ''){
					return false;
				}else{
					var name = document.getElementById('username').innerHTML;
					var msg = textarea.value;
					socket.emit('chat', {
						author_name: name,
						content: msg,
						create_at:time,
						send_id:$('#connect').data('id'),
						author_id:$('#username').data('id')
					});
					textarea.value = '';
					resize();
				}
			}
		}

	}
	layerPop(){
		let _this=this;
		const connect=$('#connect'),
			name=connect.data('name'),
			imgsrc=connect.data('img');
		connect.on('click',function () {
			layer.open({
			  type: 1,
			  area: ['480px', '420px'], //宽高
			  anim: 2,
			  shadeClose: true, //开启遮罩关闭
			  title:`<img class='layerAvatar' src=${imgsrc}><span>${name}</span>`,
			  content: chat(),
			  success:()=>{
					_this.socket();
			  }
			});
		})
	}
	
}
new detail();