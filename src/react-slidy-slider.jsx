import React, { Component, PropTypes } from 'react'
import detectPrefixes from './slidy/detect-prefixes.js'

import ReactSlidyList from './react-slidy-list'

// const LINEAR_ANIMATION = 'linear'
// const VALID_SWIPE_DISTANCE = 25
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
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.nextSlider = this.nextSlider.bind(this)
    this.prevSlider = this.prevSlider.bind(this)

    this.cssVendorPrefixes = {}
    this.slidyInstance = null

    this.classes = {
      classNameItem: this.getClassName('item'),
      classNameFrame: this.getClassName('frame'),
      classNameSlideContainer: this.getClassName('slides'),
      classNamePrevCtrl: this.getClassName('prev'),
      classNameNextCtrl: this.getClassName('next')
    }

    this.state = {
      cssTransform: '',
      currentSlide: 0,
      currentTouchOffset: { pageX: 0, pageY: 0 },
      delta: { x: 0, y: 0 },
      index: 0,
      isScrolling: false,
      position: 0,
      touchOffset: { pageX: 0, pageY: 0 },
      touchStarted: false
    }

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
    this.cssVendorPrefixes = detectPrefixes()
    // wait to load the images in order to start some stuff only when needed
    imagesLoaded(this.DOM['slider'], () => {
      const slidyOptions = {
        ...this.props,
        ...this.sliderOptions,
        frameDOMEl: this.DOM['frame']
      }
      // start slidy slider instance
      this.slidyInstance = slidy(this.DOM['slider'], slidyOptions)
      this.slidyInstance.destroy()
    })
  }

  componentWillUnmount () {
    this.slidyInstance.destroy()
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

  handleTouchStart (e) {
    const {pageX, pageY} = e.touches[0]
    this.setState({
      currentTouchOffset: { pageX, pageY },
      touchOffset: { pageX, pageY },
      touchStarted: true,
      isScrolling: false
    })
  }

  handleTouchMove (e) {
    const { pageX, pageY } = e.touches[0]
    const { currentTouchOffset, touchOffset } = this.state
    let { cssTransform } = this.state

    const delta = {
      x: pageX - touchOffset.pageX,
      y: pageY - touchOffset.pageY
    }

    const deltaNow = {
      x: pageX - currentTouchOffset.pageX,
      y: pageY - currentTouchOffset.pageY
    }

    const isScrollingNow = Math.abs(deltaNow.x) < Math.abs(deltaNow.y)
    const isScrolling = !!(this.state.isScrolling || isScrollingNow)

    this.setState({
      isScrolling
    }, () => {
      if (!isScrolling && delta.x !== 0) {
        cssTransform = this.createTranslation()
        this.setState({ cssTransform })
      } else if (isScrolling) {
        this.handleTouchEnd()
      }
    })
  }

  handleTouchEnd () {
    // const { delta, index } = this.state
    /**
     * is valid if:
     * -> swipe distance is greater than the specified valid swipe distance
     * -> swipe distance is more then a third of the swipe area
     * @isValidSlide {Boolean}
     */
    // const absoluteX = Math.abs(delta.x)
    // const isValid = absoluteX > VALID_SWIPE_DISTANCE || absoluteX > frameWidth / 3

    /**
     * is out of bounds if:
     * -> index is 0 and delta x is greater than 0
     * -> index is the last slide and delta is smaller than 0
     * @isOutOfBounds {Boolean}
     */

    // const direction = delta.x < 0
    // const isOutOfBounds = !index && !direction ||
    //     index === slides.length - 1 && direction
    //
    // if (isValid && !isOutOfBounds) {
    //   //slide(direction)
    // } else {
    //   //_translate(position, options.snapBackSpeed, LINEAR_ANIMATION)
    // }

    this.setState({
      delta: { x: 0, y: 0 },
      touchOffset: { x: 0, y: 0 },
      isScrolling: false,
      touchStarted: false
    })
  }

  createTranslation (to, duration, ease) {
    const { cssVendorPrefixes } = this
    const easeCssText = ease ? `${cssVendorPrefixes.transitionTiming}: ${ease};` : ''
    const durationCssText = duration ? `${cssVendorPrefixes.transitionDuration}: ${duration}ms;` : ''
    return `${easeCssText}${durationCssText}
      ${cssVendorPrefixes.transform}: ${cssVendorPrefixes.translate(to)};`
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
        <div
          className={this.sliderOptions.classNameFrame}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          ref={this.getFrameNode}>
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
