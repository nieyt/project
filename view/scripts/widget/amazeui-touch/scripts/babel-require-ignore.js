'use strict';

module.exports = [
  [
    // ignore scss require when running in Node env
    'transform-require-ignore',
    {
      extensions: ['.scss']
    }
  ]
];
