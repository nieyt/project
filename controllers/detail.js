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