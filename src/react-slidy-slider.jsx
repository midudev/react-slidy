import React, { Component, PropTypes } from 'react'

import ReactSlidyList from './react-slidy-list'

const NO_OP = () => {}

// in order to make react-slidy compatible with server-rendering
// by default slidy and imagesLoaded are empty functions
let slidy = NO_OP
let imagesLoaded = NO_OP

// if window is present, then we get the needed library
if (typeof (window) !== 'undefined' && window.document) {
  slidy = require('./slidy/slidy.js').slidy
  imagesLoaded = require('imagesloaded')
}

export default class ReactSlidySlider extends Component {

  constructor (...args) {
    super(...args)

    this.getFrameNode = this.getFrameNode.bind(this)
    this.getSliderNode = this.getSliderNode.bind(this)
    this.handleAfterSlide = this.handleAfterSlide.bind(this)
    this.nextSlider = this.nextSlider.bind(this)
    this.prevSlider = this.prevSlider.bind(this)
    this.slidyInstance = null

    this.classes = {
      classNameItem: this.getClassName('item'),
      classNameFrame: this.getClassName('frame'),
      classNameSlideContainer: this.getClassName('slides'),
      classNamePrevCtrl: this.getClassName('prev'),
      classNameNextCtrl: this.getClassName('next')
    }

    this.state = { currentSlide: 0 }
    this.sliderOptions = {
      ...this.classes,
      doAfterSlide: this.handleAfterSlide,
      // fix if the user try to use a `true` value for infinite
      infinite: this.props.infinite === true ? 1 : this.props.infinite,
      // if infinite, rewindOnResize is always true
      rewindOnResize: this.props.rewindOnResize || this.props.infinite
    }

    const { children } = this.props
    this.DOM = {}
    this.listItems = Array.isArray(children) ? children : [children]
  }

  componentDidMount () {
    // wait to load the images in order to start some stuff only when needed
    imagesLoaded(this.DOM['slider'], () => {
      const slidyOptions = {
        ...this.props,
        ...this.sliderOptions,
        frameDOMEl: this.DOM['frame']
      }
      // start slidy slider instance
      this.slidyInstance = slidy(this.DOM['slider'], slidyOptions)
    })
  }

  componentWillUnmount () {
    this.slidyInstance && this.slidyInstance.destroy()
  }

  shouldComponentUpdate (nextProps, {currentSlide}) {
    return currentSlide !== this.state.currentSlide
  }

  getClassName (element) {
    return `${this.props.classNameBase}-${element}`
  }

  getFrameNode (node) {
    this.DOM['frame'] = node
  }

  getSliderNode (node) {
    this.DOM['slider'] = node
  }

  handleAfterSlide ({currentSlide}) {
    this.setState({currentSlide}, function () {
      this.props.doAfterSlide({currentSlide})
    })
  }

  nextSlider (e) {
    e.preventDefault()
    this.slidyInstance.next()
  }

  prevSlider (e) {
    e.preventDefault()
    this.slidyInstance.prev()
  }

  render () {
    const { infinite, lazyLoadConfig, showArrows } = this.props

    return (
      <div ref={this.getSliderNode}>
        <div ref={this.getFrameNode} className={this.sliderOptions.classNameFrame}>
          {showArrows && <span className={this.sliderOptions.classNamePrevCtrl} onClick={this.prevSlider} />}
          {showArrows && <span className={this.sliderOptions.classNameNextCtrl} onClick={this.nextSlider} />}
          <ReactSlidyList
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

ReactSlidySlider.propTypes = {
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

ReactSlidySlider.defaultProps = {
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
