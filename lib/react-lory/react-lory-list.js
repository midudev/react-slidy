'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ReactLoryList;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLoryItem = require('./react-lory-item');

var _reactLoryItem2 = _interopRequireDefault(_reactLoryItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ReactLoryList(_ref) {
  var className = _ref.className;
  var classNameItem = _ref.classNameItem;
  var items = _ref.items;

  return _react2.default.createElement(
    'ul',
    { className: className },
    items.map(function (item, index) {
      return _react2.default.createElement(_reactLoryItem2.default, {
        className: classNameItem,
        item: item,
        key: index });
    })
  );
}

ReactLoryList.propTypes = {
  className: _react.PropTypes.string,
  classNameItem: _react.PropTypes.string,
  items: _react.PropTypes.array
};