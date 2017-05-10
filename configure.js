module.exports = {
  mongodb_url: 'mongodb://127.0.0.1:27017/myproj',       // mongoose连接

  // 这里的加密字符串到了生成环境要换成128个字符的随机字符串
  sessionSecret: 'myproj-sessionSecret',                 // session加密
  cookieSecret: 'myproj-cookieSecret',               // cookie加密
  auth_cookie_name: 'myproj-auth_cookie_name',           // cookie name
  password_salt: 'myproj-password_salt'                  // 密码加盐
};