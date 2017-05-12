var Info = require('../proxy').Info;


exports.publish=function (req,res,next) {
	return res.render('publish',{
		err: req.flash('err').toString(),
		key:'publish',
		user:req.session.user
	});
}

exports.postInfo=function (req,res,next) {
	var info=req.body.info,
		_id=req.session.user._id;
	console.log(req.file);
	for(var item in info){
		if(!info[item]){
			if(item!='images'){
				req.flash('err',item+'不能为空');
				return res.redirect('/publish');
			}
		}
	}
	Info.newInfoSave(_id,info,function (err,info) {
		if(err){
			req.flash('err',err);
			return res.redirect('/publish');
		}
		res.redirect('/detail/'+info._id);
	})
	
}