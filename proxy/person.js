var models = require('../models');
var Info = models.Info;
var Chat = models.Chat;
var Like = models.Like;

exports.findInfoByUser=function (user_id,callback) {
	Info.find({author_id:user_id}).
        sort({create_at:-1}).
    	exec(function (err,info) {
    		for(let i in info){
    			info[i].images=info[i].images.split(',')[0];
    		}
            callback(err,info);
    	})
}

exports.deleteById=function (info_id,callback) {
	Info.remove({_id: info_id},function (err,info) {
        callback(err,info)
    });
}

exports.findChatbyUser=function (user_id,callback) {//收到的会话和消息一起查询了
    Chat.find({'send_id':user_id,'view':0}).
        exec(function (err,msg) {
            Chat.find({'send_id':user_id}).
            exec(function (err,view) {
                callback(err,msg,view);
            })
        });
}

exports.findLikeByUser=function (user_id,callback) {
    Like.find({'user_id':user_id}).
        exec(function (err,like) {
            callback(err,like.info_id);
        })
}
