import React, { Component, PropTypes } from 'react'
import ReactDOMServer from 'react-dom/server'

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
    this.DOM = {}

    this.classes = {
      classNameItem: this.getClassName('item'),
      classNameFrame: this.getClassName('frame'),
      classNameSlideContainer: this.getClassName('slides'),
      classNamePrevCtrl: this.getClassName('prev'),
      classNameNextCtrl: this.getClassName('next')
    }

    const { children } = this.props
    this.listItems = Array.isArray(children) ? children : [children]

    const sliderItems = React.Children.map(this.listItems, (child) => {
      return ReactDOMServer.renderToStaticMarkup(child)
    })

    this.sliderOptions = {
      ...this.classes,
      items: sliderItems,
      doAfterSlide: this.handleAfterSlide,
      // fix if the user try to use a `true` value for infinite
      infinite: this.props.infinite === true ? 1 : this.props.infinite,
      // if infinite, rewindOnResize is always true
      rewindOnResize: this.props.rewindOnResize || this.props.infinite
    }
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

  shouldComponentUpdate (nextProps) {
    return false
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
    this.props.doAfterSlide({currentSlide})
  }

  nextSlider (e) {
    e.preventDefault()
    this.slidyInstance.next()
  }

  prevSlider (e) {
    e.preventDefault()
    this.slidyInstance.prev()
  }

  renderItems () {
    return this.listItems.slice(0, 2).map((item, index) => (
      <li key={index} className={this.sliderOptions.classNameItem}>
        {item}
      </li>
    ))
  }

  render () {
    const { showArrows } = this.props

    return (
      <div ref={this.getSliderNode}>
        <div ref={this.getFrameNode} className={this.sliderOptions.classNameFrame}>
          {showArrows && <span className={this.classes.classNamePrevCtrl} onClick={this.prevSlider} />}
          {showArrows && <span className={this.classes.classNameNextCtrl} onClick={this.nextSlider} />}
          <ul className={this.sliderOptions.classNameSlideContainer}>
            {this.renderItems()}
          </ul>
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
  infinite: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]),
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
  infinite: 1,
  onReady: NO_OP,
  rewind: false,
  rewindOnResize: false,
  rewindSpeed: 500,
  showArrows: true,
  slideSpeed: 500,
  slidesToScroll: 1,
  snapBackSpeed: 500
}
