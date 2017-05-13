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
	var info=req.body.info,
		_id=req.session.user._id;
	console.log(req.file);
	for(var item in info){
		if(!info[item]){
			if(item!='images'){
				req.flash('err',item+'不能为空');
				return res.redirect('/publish');
			}
		}
	}
	Info.newInfoSave(_id,info,function (err,info) {
		if(err){
			req.flash('err',err);
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
        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(path.join('view/myview/dest/userPic',req.session.user._id + Date.now() +type));
        file.pipe(fstream);
    });
}
// exports.uploadimg = function (req, res, next) {
// 	console.log(11111111111);
// 	console.log(req);
//   upload(req, res, function (err) {
//     if (err) {
//       req.flash('uploadPicErr', err);
//       return res.redirect('back');
//     }
//     console.log(req,1000);
//     // var path = req.file.path.replace('public','');
//     // User.updateAvarar(req.session.user._id, path, function (err, user) {
//     //   return res.redirect('/home');
//     // });
//   });
// };
