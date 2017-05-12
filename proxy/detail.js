var models = require('../models');
var Info = models.Info;
var User = models.User;
var _ = require('underscore');

exports.findDetail=function (info_id,callback) {
	Info.findById(info_id, function (error, info) {
		if(error){
			console.log(error);
			return;
		}
		User.findById(info.author_id,function (err,author) {
	      callback(err,info,author);
		})
    })
}