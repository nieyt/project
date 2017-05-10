// var mongoose = require('mongoose');
// var userSchema  = require("../schemas/sign");
// var User = mongoose.model('User', userSchema);//根据模式来生成模型

// module.exports = User;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');

var UserSchema = new Schema({
    name: {type: String},
    phone: {type: Number},
    password: {type: String},
    avatar: { type: String, default: '/img/default.jpg' },
  	create_at: { type: Date, default: Date.now }
});


mongoose.model('User', UserSchema);