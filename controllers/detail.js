var Detail = require('../proxy').Detail;
var _=require('underscore');

exports.getDetail=function(req,res,next) {
	var info_id=req.params.id;
	Detail.findDetail(info_id,function (err,info,author) {
		let imageArr=info.images.split(',');
		let join_day=Math.floor((Date.parse(new Date())-Date.parse(author.create_at))/86400000);
	 	return res.render('detail',{
	 		info:info,
	 		author:author,
	 		user:req.session.user,
	 		day:join_day,
	 		key:'detail',
	 		imageArr:imageArr
	 	})
	})
}

exports.approval=function (req,res,next) {
	let obj=req.body;
	// 	msg;
	// if(obj.add=='true'){
	// 	msg="收藏成功";
	// }else{
	// 	msg="您已取消收藏";
	// }
	// console.log(msg)
	Detail.likeChange(obj,function (data) {
		res.json({
			msg:data
		})
	})
	
	
}