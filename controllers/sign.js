// var configure = require('../configure');
var User = require('../proxy').User;


exports.signPage = function(req, res, next) {
  return res.render('sign', {
    err: req.flash('err').toString(),
    prompt: req.flash('prompt').toString(),
    loginErr: req.flash('loginErr').toString()
  });
};

exports.register = function (req, res, next) {
  var name = req.body.name,
      phone = req.body.phone,
      password = req.body.password;
  if (name == '' || name == null) {
    req.flash('err', '用户名不能为空！');
    return res.redirect('/sign#signup');
  }
  if (!/^[0-9]{11}$/.test(phone)) {
    req.flash('err','请输入正确的手机号！');
    return res.redirect('/sign#signup');
  }
  if (password.length < 6) {
    req.flash('err', '密码至少6位！');
    return res.redirect('/sign#signup');
  }
  User.newUserSave(name, phone, password, function (err, user) {
    if (err) {
      req.flash('err', err.message);
      return res.redirect('/sign#signup');
    }
    req.session.user = user;
    req.flash('prompt', '注册成功，请登录！');
    return res.redirect('/sign#signin');
  })
};

exports.login = function (req, res, next) {
  var phone = req.body.phone,
      password = req.body.password;
  User.login(phone, password, function (err, user) {
    if (err) {
      req.flash('loginErr', err.message);
      return res.redirect('/sign#signin');
    }
    if (!user) {
      req.flash('loginErr', '该手机号未注册！');
      return res.redirect('/sign#signin');      
    }
    if (password != user.password) {
      req.flash('loginErr', '密码错误');
      return res.redirect('/sign#signin');   
    }
    req.session.user = user;
    return res.redirect('/');
  });
};

exports.logout = function (req, res, next) {
  req.session.user = null;
  return res.redirect('/sign');
};

