  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function decode(qsArg, sepArg, eqArg, options, noCoding) {
    var sep = sepArg || '&';
    var eq = eqArg || '=';
    var obj = {};

    if (typeof qsArg !== 'string' || qsArg.length === 0) {
      return obj;
    }

    var regexp = /\+/g;
    var qs = qsArg.split(sep);

    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }

    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20');
      var idx = x.indexOf(eq);
      var kstr = undefined;
      var vstr = undefined;
      var k = undefined;
      var v = undefined;

      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }

      k = noCoding ? kstr : decodeURIComponent(kstr);
      v = noCoding ? vstr : decodeURIComponent(vstr);

      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (Array.isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }

    return obj;
  }

  function stringifyPrimitive(v) {
    switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  }

  function encode(objArg, sepArg, eqArg, name, noCoding) {
    var sep = sepArg || '&';
    var eq = eqArg || '=';
    var obj = objArg === null ? undefined : objArg;

    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
      return Object.keys(obj).map(function (k) {
        var strK = noCoding ? stringifyPrimitive(k) : encodeURIComponent(stringifyPrimitive(k));
        var ks = strK + eq;
        if (Array.isArray(obj[k])) {
          return obj[k].map(function (v) {
            var strV = noCoding ? stringifyPrimitive(v) : encodeURIComponent(stringifyPrimitive(v));
            return ks + strV;
          }).join(sep);
        }
        var strO = noCoding ? stringifyPrimitive(obj[k]) : encodeURIComponent(stringifyPrimitive(obj[k]));
        return ks + strO;
      }).join(sep);
    }

    if (!name) {
      return '';
    }
    if(noCoding){
      return stringifyPrimitive(name) + eq + stringifyPrimitive(obj);
    }
    return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
  }
  export default {
    encode: encode,
    decode: decode,
    parse: decode,
    stringify: encode
  };
  /*exports.default = {
    encode: encode,
    decode: decode,
    parse: decode,
    stringify: encode
  };
  module.exports = exports['default'];*/
