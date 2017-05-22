// var Sort=require('../proxy').User;
// var Like=require('../proxy').Like;
var List=require('../proxy').List;
exports.index= function(req, res, next) {
	var user = req.session.user;
	List.findInfoSort(function (err,info) {
		return res.render('index',{
			user:user,
			info:info
		})
	})
}