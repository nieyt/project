var models = require('../models');
var Info = models.Info;

exports.findByUser=function (user_id,callback) {
	Info.find({author_id:user_id}).
    	sort({'create_at':-1}).
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