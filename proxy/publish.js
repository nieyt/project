var models = require('../models');
var Info = models.Info;

exports.newInfoSave=function () {
	var info = new Info();
	info.title = title;
	info.author_id = author_id;
	info.description = description;
	info.images = images;
	info.area = area;
	info.classify = classify;
	info.price = price;
	info.descrip tion = d escription;
	info.save(callback);
		
}