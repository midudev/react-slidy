'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lory = require('lory.js');

var _imagesloaded = require('imagesloaded');

var _imagesloaded2 = _interopRequireDefault(_imagesloaded);

var _reactLoryList = require('./react-lory-list');

var _reactLoryList2 = _interopRequireDefault(_reactLoryList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactLory = function (_Component) {
  _inherits(ReactLory, _Component);

  function ReactLory() {
    var _ref;

    _classCallCheck(this, ReactLory);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = ReactLory.__proto__ || Object.getPrototypeOf(ReactLory)).call.apply(_ref, [this].concat(args)));

    _this.getSliderNode = _this.getSliderNode.bind(_this);
    _this.handleAfterSlide = _this.handleAfterSlide.bind(_this);
    _this.handleInit = _this.handleInit.bind(_this);
    return _this;
  }

  _createClass(ReactLory, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // wait to load the images in order to start some stuff only when needed
      (0, _imagesloaded2.default)(this.sliderNode, function () {
        var classes = {
          classNameFrame: _this2.getClassName('frame'),
          classNameSlideContainer: _this2.getClassName('slides'),
          classNamePrevCtrl: _this2.getClassName('prev'),
          classNameNextCtrl: _this2.getClassName('next')
        };

        _this2.sliderNode.addEventListener('after.lory.init', _this2.handleInit);
        _this2.sliderNode.addEventListener('after.lory.slide', _this2.handleAfterSlide);

        (0, _lory.lory)(_this2.sliderNode, _extends({}, _this2.props, classes));
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.sliderNode.removeEventListener('after.lory.init', this.handleInit);
      this.sliderNode.removeEventListener('after.lory.slide', this.handleAfterSlide);
    }
  }, {
    key: 'getClassName',
    value: function getClassName(element) {
      return this.props.classNameBase + '-' + element;
    }
  }, {
    key: 'getSliderNode',
    value: function getSliderNode(node) {
      this.sliderNode = node;
    }
  }, {
    key: 'handleAfterSlide',
    value: function handleAfterSlide(currentSlide) {
      this.props.doAfterSlide(currentSlide);
    }
  }, {
    key: 'handleInit',
    value: function handleInit() {
      this.sliderNode.classList.add(this.getClassName('-ready'));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var classNameBase = _props.classNameBase;

      var listItems = Array.isArray(children) ? children : [children];

      return _react2.default.createElement(
        'div',
        { ref: this.getSliderNode, className: classNameBase },
        _react2.default.createElement(
          'div',
          { className: this.getClassName('frame') },
          _react2.default.createElement(_reactLoryList2.default, {
            className: this.getClassName('slides'),
            classNameItem: this.getClassName('item'),
            items: listItems })
        )
      );
    }
  }]);

  return ReactLory;
}(_react.Component);

exports.default = ReactLory;


ReactLory.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]).isRequired,
  className: _react.PropTypes.string,
  classNameBase: _react.PropTypes.string,
  doAfterSlide: _react.PropTypes.func,
  ease: _react.PropTypes.string,
  enableMouseEvents: _react.PropTypes.bool,
  infinite: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.number]),
  rewind: _react.PropTypes.bool,
  rewindSpeed: _react.PropTypes.number,
  slideSpeed: _react.PropTypes.number,
  slidesToScroll: _react.PropTypes.number,
  snapBackSpeed: _react.PropTypes.number
};

ReactLory.defaultProps = {
  classNameBase: 'react-lory',
  doAfterSlide: function doAfterSlide() {},
  ease: 'ease',
  enableMouseEvents: true,
  infinite: 1,
  rewind: false,
  rewindSpeed: 600,
  slideSpeed: 300,
  slidesToScroll: 1,
  snapBackSpeed: 200
};