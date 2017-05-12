var models = require('../models');
var Info = models.Info;
var User = models.User;
var _ = require('underscore');

exports.findList=function (findObj,callback) {
	Info.find(findObj,function (err,info) {
		// res.json(info);
		console.log(info);
	})
}

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