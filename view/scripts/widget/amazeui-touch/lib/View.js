'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ClassNameMixin = require('./mixins/ClassNameMixin');

var _ClassNameMixin2 = _interopRequireDefault(_ClassNameMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var View = _react2.default.createClass({
  displayName: 'View',

  mixins: [_ClassNameMixin2.default],

  propTypes: {
    classPrefix: _react.PropTypes.string.isRequired,
    component: _react.PropTypes.node.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      classPrefix: 'view',
      component: 'div'
    };
  },
  render: function render() {
    var _props = this.props;
    var component = _props.component;
    var className = _props.className;

    var props = _objectWithoutProperties(_props, ['component', 'className']);

    delete props.classPrefix;

    return _react2.default.createElement(component, _extends({}, props, {
      className: (0, _classnames2.default)(className, this.getClassSet())
    }));
  }
});

exports.default = View;
module.exports = exports['default'];