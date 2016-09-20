import React, { Component, PropTypes } from 'react'

import ReactLoryList from './react-lory-list'
import ReactLoryArrows from './react-lory-arrows'

const EVENTS = {
  AFTER_DESTROY: 'after.lory.destroy',
  AFTER_SLIDE: 'after.lory.slide',
  BEFORE_SLIDE: 'before.lory.slide',
  INIT: 'after.lory.init'
}

const NO_OP = () => {}

let lory = NO_OP
let imagesLoaded = NO_OP

// in order to make react-lory compatible with server-rendering
if (typeof (window) !== 'undefined' && window.document) {
  lory = require('lory.js').lory
  imagesLoaded = require('imagesloaded')
}

export default class ReactLorySlider extends Component {

  constructor (...args) {
    super(...args)
    this.getSliderNode = this.getSliderNode.bind(this)
    this.handleBeforeSlide = this.handleBeforeSlide.bind(this)
    this.handleAfterSlide = this.handleAfterSlide.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleInit = this.handleInit.bind(this)
    this.loryInstance = null

    this.state = { currentSlide: 0 }
  }

  componentDidMount () {
    // wait to load the images in order to start some stuff only when needed
    imagesLoaded(this.sliderNode, () => {
      const classes = {
        classNameFrame: this.getClassName('frame'),
        classNameSlideContainer: this.getClassName('slides'),
        classNamePrevCtrl: this.getClassName('prev'),
        classNameNextCtrl: this.getClassName('next')
      }

      this.sliderNode.addEventListener(EVENTS.AFTER_DESTROY, this.handleDestroy)
      this.sliderNode.addEventListener(EVENTS.AFTER_SLIDE, this.handleAfterSlide)
      this.sliderNode.addEventListener(EVENTS.INIT, this.handleInit)
      this.sliderNode.addEventListener(EVENTS.BEFORE_SLIDE, this.handleBeforeSlide)

      // fix if the user try to use a `true` value for infinite
      const infiniteValue = this.props.infinite === true ? 1 : this.props.infinite
      const infiniteOption = { infinite: infiniteValue }
      this.loryInstance = lory(this.sliderNode, {...this.props, ...classes, ...infiniteOption})
      this.props.onReady()
    })
  }

  componentWillUnmount () {
    this.sliderNode.removeEventListener(EVENTS.INIT, this.handleInit)
    this.sliderNode.removeEventListener(EVENTS.AFTER_SLIDE, this.handleAfterSlide)
    this.loryInstance.destroy()
    this.sliderNode.removeEventListener(EVENTS.AFTER_DESTROY, this.handleDestroy)
    this.sliderNode.removeEventListener(EVENTS.BEFORE_SLIDE, this.handleBeforeSlide)
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

  handleInit () {
    this.sliderNode.classList.add(this.getClassName('-ready'))
    this.setState({ loading: false })
  }

  render () {
    const { children, showArrows } = this.props
    const listItems = Array.isArray(children) ? children : [children]

    return (
      <div ref={this.getSliderNode}>
        <div className={this.getClassName('frame')}>
          <ReactLoryArrows
            className={this.getClassName('nav')}
            classNamePrev={this.getClassName('prev')}
            classNameNext={this.getClassName('next')}
            showArrows={showArrows}
            />
          <ReactLoryList
            className={this.getClassName('slides')}
            classNameItem={this.getClassName('item')}
            currentSlide={this.state.currentSlide}
            lazyLoadConfig={this.props.lazyLoadConfig}
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
  rewindSpeed: 600,
  showArrows: true,
  slideSpeed: 300,
  slidesToScroll: 1,
  snapBackSpeed: 200
}
