'use strict';

global.SERVER_RENDING = true;
global.__VERSION__= '';

require('babel-register')({
  plugins: require('../../scripts/babel-require-ignore'),
});

require('./server');
