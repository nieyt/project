var models = require('../models');
var Chat = models.Chat;
var User = models.User;
var _ = require('underscore');

exports.newChatSave=function (obj,callback) {
	var info = new Chat();
	_.extend(info, obj);
	info.save(callback);
}