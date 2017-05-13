var List = require('../proxy').List;
var _=require('underscore');

exports.renderList=function (req,res,next) {
	var user=req.session.user;
	var obj={
		classify:'0'
	}
	if(req.body){
		_.extend(obj,req.body);
	}
	List.findList({classify:'0'},function (err,info) {
		return res.render('list',{
			user:user,
			info:info,
			crumbs:"二手手机"
		})
	})
}