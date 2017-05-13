var models = require('../models');
var Info = models.Info;
var User = models.User;
var _ = require('underscore');

// exports.findList=function (findObj,callback) {
// 	Info.find(findObj,function (err,info) {
// 		for(let i in info){
// 			info[i].image=info[i].images.split(',')[0];
// 			User.findById(info[i].author_id,function (error,user) {
// 				info[i].author_name=user.name;
// 				info[i].author_avatar=user.avatar;
// 				if(i==info.length-1){
// 					callback(err,info);
// 				}
// 			})
// 		}
// 	})
// }

exports.findList = function(findObj, callback) {
    Info.find(findObj, function(err, info) {
        const promises = info.map(f => new Promise((resolve, reject) => {
            f.image = f.images.split(",")[0];
            User.findById(f.author_id, function(error, user) {
                if (error) {
                    reject(error);
                    return;
                }
                f.author_name = user.name;
                f.author_avatar = user.avatar;
                resolve(f);
            });
        }));
        Promise.all(promises)
            .then(function(values) {
                // 成功的时候，这个 values 是所有 info 对象，
                // 作为一个数组返回出来，而不是某一个
                callback(null, values);
            })
            .catch(function(error) {
                // 注意这里 error 是第一个失败 error
                // 不是所有的 error 
                callback(error);
            });
    });
};

exports.findByKeyword=function (keyword,callback) {
	Info.find(function (err,info) {
		var Info=json.Parse(info);
		var matched=[];
		console.log(Info);
		for(let i=0;i<Info.length;i++){
			console.log(Info[i]);
		}
	})
}