var models = require('../models');
var Info = models.Info;
var _ = require('underscore');

exports.newInfoSave=function (id,obj,callback) {
	var info = new Info();
	info.author_id = id;
	_.extend(info, obj);
	// info.images=img;
	info.save(callback);
}

exports.findById=function (id,callback) {
	Info.findById(id,callback);
}