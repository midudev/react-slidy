'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ReactLoryItem;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ReactLoryItem(_ref) {
  var className = _ref.className;
  var item = _ref.item;

  return _react2.default.createElement(
    'li',
    { className: className },
    item
  );
}

ReactLoryItem.propTypes = {
  className: _react.PropTypes.string,
  item: _react.PropTypes.node
};