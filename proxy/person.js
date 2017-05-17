var models = require('../models');
var Info = models.Info;
var Chat = models.Chat;

exports.findByUser=function (user_id,callback) {
	Info.find({author_id:user_id}).
    	sort({'create_at':-1}).
    	exec(function (err,info) {
    		for(let i in info){
    			info[i].images=info[i].images.split(',')[0];
    		}
            Chat.find({'send_id':user_id,'view':0}).
            sort({'create_at':-1}).
            exec(function (err,msg) {
                callback(err,info,msg);
            });
            console.log(user_id);
    	})
}

exports.deleteById=function (info_id,callback) {
	Info.remove({_id: info_id},function (err,info) {
        callback(err,info)
    });
}