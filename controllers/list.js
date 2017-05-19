var List = require('../proxy').List;
var _=require('underscore');

function judge(sort) {
	let crumbsData,obj;
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
	return {
		crumbsData:crumbsData,
		obj:obj
	}
}

exports.renderList=function (req,res,next) {
	var user=req.session.user,
		sort=req.params.sort,
		judgeInfo=judge(sort),
		obj=judgeInfo.obj,
		crumbsData=judgeInfo.crumbsData;
	List.findList(obj,function (err,info) {
		return res.render('list',{
			user:user,
			info:info,
			crumbs:crumbsData,
			sort:sort
		})
	})
}

exports.renderData=function (req,res,next) {
	let querys=req.body,
		sort=req.params.sort,
		judgeInfo=judge(sort),
		obj=judgeInfo.obj,
		max,
		min;
	for(let i in querys){
		if(querys[i]!=''){
			if(i=='price'){
				let priceArr=querys[i].split(','),
					arr=[];
				for(let j in priceArr){
					let single=priceArr[j].split('-');
					for(let k in single){
						arr.push(parseInt(single[k]));
					}
				}
				arr=[...new Set(arr)];
				arr.sort(function(a,b){return a>b?1:-1});
				min=arr[0];
				max=arr[arr.length-1];
				obj[i]={$gte: min, $lt: max};
			}else if(i=='keyword'){
				let keyword=querys[i];
				obj['$or']=[
					{'title':{$regex:new RegExp(keyword,'i')}},
					{'description':{$regex:new RegExp(keyword,'i')}},
					{'brand':{$regex:new RegExp(keyword,'i')}}
				];
			}else{
				obj[i]={"$in":querys[i].split(',')}
			}
		}
	}
	List.findList(obj,function (err,info) {
		return res.json({
			info:info
		})
		console.log(err);
	})
}