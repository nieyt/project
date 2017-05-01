// var mongoose = require('mongoose');
// var userSchema  = require("../schemas/sign");
// var User = mongoose.model('User', userSchema);//根据模式来生成模型

// module.exports = User;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BaseModel = require('./base_model');

var UserSchema = new mongoose.Schema({
    urername: {type: String},
    userid: {type: Number},
    password: {type: String},
    avatar: { type: String, default: '/img/default.jpg' },
  	create_at: { type: Date, default: Date.now }
});
UserSchema.index({ userid: 1 });

mongoose.model('User', UserSchema);