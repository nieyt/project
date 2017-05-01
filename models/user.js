var mongoose = require('mongoose');
var userSchema  = require("../schemas/sign");
var User = mongoose.model('User', userSchema);//根据模式来生成模型

module.exports = User;

