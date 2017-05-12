var List = require('../proxy').List;

exports.renderList=function (req,res,next) {
	var user=req.session.user;
	return res.render('list',{
		user:user
	})

}