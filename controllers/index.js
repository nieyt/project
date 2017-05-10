// var Sort=require('../proxy').User;

exports.index= function(req, res, next) {
	var user = req.session.user;
	return res.render('index',{
		user:user
	})
}