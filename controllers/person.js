var Person = require('../proxy').Person;
var Chat = require('../proxy').Chat;
var _=require('underscore');

exports.personRender=function (req,res,next) {
	let user=req.session.user;
	Person.findByUser(user._id,function (err,info) {
		return res.render('person',{
			user:user,
			info:info
		})
	})
}

exports.deteleInfo=function (req,res,next) {
	let id=req.query.id;
	Person.deleteById(id,function (err,info) {
		return res.json({success:1});
	})
}

