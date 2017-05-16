var mongoose = require('mongoose');
var configure = require('../configure');

mongoose.connect(configure.mongodb_url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('成功连上数据库！');
});

require('./user');
require('./info');
require('./up');
// require('./answer');
// require('./topic');
// require('./push');

exports.User = mongoose.model('User');
exports.Info = mongoose.model('Info');
exports.Up = mongoose.model('Up');
// exports.Answer = mongoose.model('Answer');
// exports.Topic = mongoose.model('Topic');
// exports.Push = mongoose.model('Push');