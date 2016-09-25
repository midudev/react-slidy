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
    this.getSliderNode = this.getSliderNode.bind(this)
    this.handleAfterSlide = this.handleAfterSlide.bind(this)
    this.slidyInstance = null

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
      // start slidy slider instance
      this.slidyInstance = slidy(this.sliderNode, {...this.props, ...this.sliderOptions})
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
