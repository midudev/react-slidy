import React, { Component, PropTypes } from 'react'

import ReactLoryList from './react-lory-list'

const EVENTS = {
  AFTER_DESTROY: 'after.lory.destroy',
  AFTER_INIT: 'after.lory.init',
  AFTER_SLIDE: 'after.lory.slide',
  BEFORE_SLIDE: 'before.lory.slide'
}

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
    this.handleBeforeSlide = this.handleBeforeSlide.bind(this)
    this.handleAfterInit = this.handleAfterInit.bind(this)
    this.handleAfterSlide = this.handleAfterSlide.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.loryInstance = null

    this.state = { currentSlide: 0 }
    this.sliderOptions = {
      classNameItem: this.getClassName('item'),
      classNameFrame: this.getClassName('frame'),
      classNameSlideContainer: this.getClassName('slides'),
      classNamePrevCtrl: this.getClassName('prev'),
      classNameNextCtrl: this.getClassName('next'),
      // fix if the user try to use a `true` value for infinite
      infinite: this.props.infinite === true ? 1 : this.props.infinite,
      // if infinite, rewindOnResize is always true
      rewindOnResize: this.props.rewindOnResize || this.props.infinite
    }
  }

  componentDidMount () {
    // wait to load the images in order to start some stuff only when needed
    imagesLoaded(this.sliderNode, () => {
      this.sliderNode.addEventListener(EVENTS.AFTER_INIT, this.handleAfterInit)
      this.sliderNode.addEventListener(EVENTS.AFTER_DESTROY, this.handleDestroy)
      this.sliderNode.addEventListener(EVENTS.AFTER_SLIDE, this.handleAfterSlide)
      this.sliderNode.addEventListener(EVENTS.BEFORE_SLIDE, this.handleBeforeSlide)
      // start lory slider instance
      this.loryInstance = lory(this.sliderNode, {...this.props, ...this.sliderOptions})
    })
  }

  componentWillUnmount () {
    this.sliderNode.removeEventListener(EVENTS.AFTER_INIT, this.handleAfterInit)
    this.sliderNode.removeEventListener(EVENTS.AFTER_SLIDE, this.handleAfterSlide)
    this.sliderNode.removeEventListener(EVENTS.BEFORE_SLIDE, this.handleBeforeSlide)
    this.loryInstance.destroy()
    this.sliderNode.removeEventListener(EVENTS.AFTER_DESTROY, this.handleDestroy)
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

  handleAfterSlide (event) {
    const {detail} = event
    const currentSlide = detail && detail.currentSlide ? detail.currentSlide : 0
    this.setState({currentSlide})
    this.props.doAfterSlide({currentSlide, event})
  }

  handleBeforeSlide (event) {
    const {detail} = event
    const nextSlide = detail && detail.nextSlide ? detail.nextSlide : 0
    this.props.doBeforeSlide({nextSlide, event})
  }

  handleDestroy (event) {
    this.props.doAfterDestroy({event})
  }

  handleAfterInit () {
    this.sliderNode.classList.add(this.getClassName('-ready'))
    this.props.onReady()
  }

  render () {
    const { children, infinite, lazyLoadConfig, showArrows } = this.props
    const listItems = Array.isArray(children) ? children : [children]

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
            items={listItems} />
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
  doAfterDestroy: PropTypes.func,
  doAfterSlide: PropTypes.func,
  doBeforeSlide: PropTypes.func,
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
  doAfterDestroy: NO_OP,
  doAfterSlide: NO_OP,
  doBeforeSlide: NO_OP,
  ease: 'ease',
  enableMouseEvents: true,
  infinite: 1,
  lazyLoadConfig: {
    enabledForContainer: false,
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
