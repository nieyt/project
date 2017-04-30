'use strict';

module.exports = function ignoreLoader(content) {
  this.cacheable && this.cacheable();
  this.value = content;
  return `module.exports = ''`;
};
