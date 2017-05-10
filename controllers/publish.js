
exports.publish=function (req,res,next) {
	return res.render('publish',{
		key:'publish',
		user:req.session.user
	});
}