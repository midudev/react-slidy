import React, { Component, PropTypes } from 'react'

import ReactLoryList from './react-lory-list'

const NO_OP = () => {}

// in order to make react-lory compatible with server-rendering
// by default lory and imagesLoaded are empty functions
let lory = NO_OP
let imagesLoaded = NO_OP

// if window is present, then we get the needed library
if (typeof (window) !== 'undefined' && window.document) {
  lory = require('./lory/lory.js').lory
  imagesLoaded = require('imagesloaded')
}

export default class ReactLorySlider extends Component {

  constructor (...args) {
    super(...args)
    this.getSliderNode = this.getSliderNode.bind(this)
    this.handleAfterSlide = this.handleAfterSlide.bind(this)
    this.loryInstance = null

    this.state = { currentSlide: 0 }
    this.sliderOptions = {
      classNameItem: this.getClassName('item'),
      classNameFrame: this.getClassName('frame'),
      classNameSlideContainer: this.getClassName('slides'),
      classNamePrevCtrl: this.getClassName('prev'),
      classNameNextCtrl: this.getClassName('next'),
      doAfterSlide: this.handleAfterSlide,
      // fix if the user try to use a `true` value for infinite
      infinite: this.props.infinite === true ? 1 : this.props.infinite,
      // if infinite, rewindOnResize is always true
      rewindOnResize: this.props.rewindOnResize || this.props.infinite
    }

    const { children } = this.props
    this.listItems = Array.isArray(children) ? children : [children]
  }

  componentDidMount () {
    // wait to load the images in order to start some stuff only when needed
    imagesLoaded(this.sliderNode, () => {
      // start lory slider instance
      this.loryInstance = lory(this.sliderNode, {...this.props, ...this.sliderOptions})
    })
  }

  componentWillUnmount () {
    this.loryInstance.destroy()
  }

  shouldComponentUpdate (nextProps, {currentSlide}) {
    return currentSlide !== this.state.currentSlide
  }

  getClassName (element) {
    return `${this.props.classNameBase}-${element}`
  }

  getSliderNode (node) {
    this.sliderNode = node
  }

  handleAfterSlide ({currentSlide}) {
    this.setState({currentSlide}, function () {
      this.props.doAfterSlide({currentSlide})
    })
  }

  handleAfterInit () {
    // TODO
    this.sliderNode.classList.add(this.getClassName('-ready'))
  }

  render () {
    const { infinite, lazyLoadConfig, showArrows } = this.props

    return (
      <div ref={this.getSliderNode}>
        <div className={this.sliderOptions.classNameFrame}>
          {showArrows && <span className={this.sliderOptions.classNamePrevCtrl} />}
          {showArrows && <span className={this.sliderOptions.classNameNextCtrl} />}
          <ReactLoryList
            className={this.sliderOptions.classNameSlideContainer}
            classNameItem={this.sliderOptions.classNameItem}
            currentSlide={this.state.currentSlide}
            lazyLoadConfig={lazyLoadConfig}
            infinite={infinite}
            items={this.listItems} />
        </div>
      </div>
    )
  }
}

ReactLorySlider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  classNameBase: PropTypes.string,
  doAfterSlide: PropTypes.func,
  ease: PropTypes.string,
  enableMouseEvents: PropTypes.bool,
  infinite: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
  lazyLoadConfig: PropTypes.object,
  onReady: PropTypes.func,
  rewind: PropTypes.bool,
  rewindOnResize: PropTypes.bool,
  rewindSpeed: PropTypes.number,
  showArrows: PropTypes.bool,
  slideSpeed: PropTypes.number,
  slidesToScroll: PropTypes.number,
  snapBackSpeed: PropTypes.number
}

ReactLorySlider.defaultProps = {
  doAfterSlide: NO_OP,
  ease: 'ease',
  enableMouseEvents: true,
  infinite: 1,
  lazyLoadConfig: {
    enabledForItems: true,
    itemsOnLoad: 2,
    componentPlaceholder: <div />
  },
  onReady: NO_OP,
  rewind: false,
  rewindOnResize: false,
  rewindSpeed: 300,
  showArrows: true,
  slideSpeed: 300,
  slidesToScroll: 1,
  snapBackSpeed: 300
}
