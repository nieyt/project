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
exports.findInfoSort=function (callback) {
    Info.find().
    sort({approval:-1}).
    exec(function (err,info) {
        callback(err,info);
    })
}
exports.findList = function(findObj, callback) {
    Info.find(findObj).
    	sort({'create_at':-1}).
    	exec(function(err, info) {
        const promises = info.map(f => new Promise((resolve, reject) => {
            f.images = f.images.split(",")[0];
            User.findById(f.author_id, function(error, user) {
                if (error) {
                    reject(error);
                    return;
                }
                f.brand = user.name;
                f.classify = user.avatar;//bug todo
                resolve(f);
                // console.log(f);
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
