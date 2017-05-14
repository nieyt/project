var List = require('../proxy').List;
var _=require('underscore');

exports.renderList=function (req,res,next) {
	var user=req.session.user,
		sort=req.params.sort,
		obj,
		crumbsData;
		switch(sort){
			case 'shouji':
				crumbsData='二手手机';
				obj={
					classify:'0'
				};
				break;
			case 'pingban':
				crumbsData='二手平板';
				obj={
					classify:'1'
				};
				break;
			case 'bijiben':
				crumbsData='二手笔记本';
				obj={
					classify:'2'
				};
				break;
			default:
				crumbsData='二手信息列表';
				obj={};
		}
	List.findList(obj,function (err,info) {
		return res.render('list',{
			user:user,
			info:info,
			crumbs:crumbsData
		})
	})
}

exports.renderData=function (req,res,next) {
	console.log(req.body)
	return res.json({
		success:1
	})
	
}