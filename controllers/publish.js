var Info = require('../proxy').Info;
// var upload = require('../common/upload').upload;
var busboy = require('connect-busboy');
var fs = require('fs');
var path = require('path');

exports.publish=function (req,res,next) {
	return res.render('publish',{
		err: req.flash('err').toString(),
		key:'publish',
		user:req.session.user
	});
}

exports.postInfo=function (req,res,next) {
	var info=req.body.info;
		_id=req.session.user._id;
	for(var item in info){
		if(!info[item]){
			if(item!='images'){
				req.flash('err',item+'不能为空');
				return res.redirect('/publish');
			}
		}
	}
	var fstream;
	var img=[];
	info.images=info.images.join(',');
	Info.newInfoSave(_id,info,function (err,info) {
		if(err){
			req.flash('err',err);
			console.log(err);
			return res.redirect('/publish');
		}
		res.redirect('/detail/'+info._id);
	})
}

exports.uploadimg=function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
    	var type='.'+filename.split('.')[1];
        fstream = fs.createWriteStream(path.join('view/myview/dest/userPic',filename));
        file.pipe(fstream);
    });
    res.send('success');
}

