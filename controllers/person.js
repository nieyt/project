var Person = require('../proxy').Person;
var Chat = require('../proxy').Chat;
var _=require('underscore');


// exports.personRender=function (req,res,next) {
// 	let user=req.session.user;
// 	Person.findByUser(user._id,function (err,info,msg,view) {
// 		return res.render('person',{
// 			user:user,
// 			info:info,
// 			msg:msg,
// 			view:view
// 		})
// 	})
// }

exports.personRender=function (req,res,next) {
	let user=req.session.user;
	Person.findInfoByUser(user._id,function (info) {
		Person.findChatbyUser(user._id,function (msg,view) {
			Person.findLikeByUser(user._id,function (like) {
				if(like&&like.length){
					Person.findInfoByLikes(like,function (infoArr) {
						return res.render('person',{
							user:user,
							info:info,
							msg:msg,
							view:view,
							infoArr:infoArr
						})
					})
				}else{
					return res.render('person',{
						user:user,
						info:info,
						msg:msg,
						view:view
					})
				}

			})
		})
	})
}

exports.deteleInfo=function (req,res,next) {
	let id=req.query.id;
	Person.deleteById(id,function (err,info) {
		return res.json({success:1});
	})
}


