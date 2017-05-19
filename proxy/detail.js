var models = require('../models');
var Info = models.Info;
var User = models.User;
var Like = models.Like;
var _ = require('underscore');

exports.findDetail=function (info_id,callback) {
	Info.findById(info_id, function (error, info) {
		if(error){
			console.log(error);
			return;
		}
		if(!info) return;
		User.findById(info.author_id,function (err,author) {
	      callback(err,info,author);
		})
    })
}

exports.likeChange=function (obj,callback) {
	if(obj.add=='true'){
		var like=new Like();
		like.user_id=obj.user_id;
		like.info_id=obj.info_id;
		like.save(function () {
			callback('收藏成功');			
		});
	}else{
		Like.remove({info_id:obj.info_id,user_id:obj.user_id},function (err,info) {
	        callback('您已取消收藏');
	    });
	}
}