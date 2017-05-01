var configure = require('../configure');
var User = require('../proxy').User;
var crypto = require('crypto');
var password_salt = configure.password_salt;

exports.sign = function(req, res, next) {
  // if (req.session.user) {
  //   return res.redirect('/index');
  // }
  return res.render('sign', {
    err: req.flash('err').toString(),
    loginErr: req.flash('loginErr').toString()
  });
};

exports.register = function (req, res, next) {
  var name = req.body.username,
      phoneOrEmail = req.body.phoneoremail,
      password = req.body.password;
  if (name === '' || name === null) {
    req.flash('err', '用户名不能为空！');
    return res.redirect('/sign');
  }
  if (password.length < 6) {
    req.flash('err', '密码至少6位！');
    return res.redirect('/sign');
  }
  // 密码md5加盐加密
  var md5 = crypto.createHash('md5'),
      password = md5.update(password + password_salt).digest('hex');
  User.newUserSave(name, phoneOrEmail, password, function (err, user) {
    if (err) {
      req.flash('err', err.message);
      return res.redirect('/sign');
    }
    res.cookie(configure.auth_cookie_name, user._id, {
      maxAge: 1000 * 60 * 60 *24 * 30,
      signed: true
    });    
    req.session.user = user;
    return res.redirect('/');
  })
};

exports.login = function (req, res, next) {
  var phoneOrEmail = req.body.phoneoremail,
      password = req.body.password,
      isRemember = req.body.rememberMe;
  var md5 = crypto.createHash('md5'),
      password = md5.update(password + password_salt).digest('hex');
  User.login(phoneOrEmail, password, function (err, user) {
    if (err) {
      req.flash('loginErr', err.message);
      return res.redirect('/sign#signin');
    }
    if (!user) {
      req.flash('loginErr', '该号码未注册！');
      return res.redirect('/sign#signup');      
    }
    if (password != user.password) {
      req.flash('loginErr', '密码错误');
      return res.redirect('/sign#signin');      
    }
    // 记住密码 10天
    if (isRemember) {
      res.cookie(configure.auth_cookie_name, user._id, {
        maxAge: 1000 * 60 * 60 *24 * 30,
        signed: true
      });
    }
    req.session.user = user;
    return res.redirect('/');
  });
};

exports.logout = function (req, res, next) {
  req.session.user = null;
  res.clearCookie(configure.auth_cookie_name, {
    maxAge: 1000 * 60 * 60 *24 * 30,
    signed: true
  });
  return res.redirect('/sign');
};
